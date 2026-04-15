import * as fs from 'fs';
import * as readline from 'readline';
import path from 'path';

export type ParsedArticle = {
  categorySlug: string;
  title: string;
  slug: string;
  imageIndex: number;
  bodyMarkdown: string;
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90);
}

export function parseTitleLine(line: string): { title: string; inlineImage: number | null } {
  const stripped = line.replace(/^#\s*/, '');
  const withImg = stripped.match(/^\*\*(.+?)\*\*\s*\*\*!?\[\]\[image(\d+)\]\*\*/);
  if (withImg) return { title: withImg[1].trim(), inlineImage: Number(withImg[2]) };
  const simple = stripped.match(/^\*\*(.+?)\*\*\s*$/);
  if (simple) return { title: simple[1].trim(), inlineImage: null };
  return { title: stripped.replace(/\*\*/g, '').trim(), inlineImage: null };
}

export async function loadMarkdownAndImages(repoRoot: string): Promise<{
  textPart: string;
  imageBuffers: Map<number, Buffer>;
}> {
  const mdPath = path.join(repoRoot, 'Nation Bulletin Blogs.md');
  if (!fs.existsSync(mdPath)) {
    throw new Error(`Missing source file: ${mdPath}`);
  }

  const input = fs.createReadStream(mdPath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  const textLines: string[] = [];
  const imageBuffers = new Map<number, Buffer>();
  let inImages = false;

  for await (const line of rl) {
    if (!inImages && line.startsWith('[image1]:')) {
      inImages = true;
    }
    if (inImages) {
      const m = line.match(/^\[image(\d+)\]:\s*<data:image\/png;base64,(.+)>$/);
      if (m) {
        const idx = Number(m[1]);
        try {
          imageBuffers.set(idx, Buffer.from(m[2], 'base64'));
        } catch {
          console.warn(`Failed to decode image${idx}`);
        }
      }
    } else {
      textLines.push(line);
    }
  }

  return { textPart: textLines.join('\n'), imageBuffers };
}

function blogRegionOnly(textPart: string): string {
  const w = textPart.indexOf('# Write for us Content');
  return w === -1 ? textPart : textPart.slice(0, w).trimEnd();
}

function isSeparatorLine(trimmed: string): boolean {
  if (!trimmed) return false;
  const t = trimmed.replace(/^\\+/, '');
  return /^=+$/.test(t);
}

export function parseArticles(textPart: string): ParsedArticle[] {
  const region = blogRegionOnly(textPart);
  const lines = region.split('\n');
  let category = 'finance';
  const articles: ParsedArticle[] = [];

  let pending: {
    title: string;
    imageIndex: number;
    categorySlug: string;
  } | null = null;
  const bodyLines: string[] = [];

  const flush = () => {
    if (!pending) return;
    const bodyMarkdown = stripTrailingStaticSections(bodyLines.join('\n').trim());
    bodyLines.length = 0;
    articles.push({
      categorySlug: pending.categorySlug,
      title: pending.title,
      slug: slugify(pending.title),
      imageIndex: pending.imageIndex,
      bodyMarkdown,
    });
    pending = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (isSeparatorLine(trimmed)) {
      continue;
    }

    const catOnly = trimmed.match(/^# (Finance|Tech|Health|Home|Education|Travel)\s*$/);
    if (catOnly) {
      category = catOnly[1].toLowerCase();
      continue;
    }

    if (/^#\s+\*\*/.test(raw)) {
      flush();
      const { title, inlineImage } = parseTitleLine(raw);
      let imageIndex = inlineImage ?? articles.length + 1;
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      const nextTrim = lines[j]?.trim() ?? '';
      const standaloneImg = nextTrim.match(/^!?\[\]\[image(\d+)\]\s*$/);
      if (standaloneImg) {
        if (inlineImage == null) imageIndex = Number(standaloneImg[1]);
        j++;
      }
      pending = {
        title,
        imageIndex,
        categorySlug: category,
      };
      i = j - 1;
      continue;
    }

    if (pending) bodyLines.push(raw);
  }

  flush();
  return articles;
}

/** Travel article shares one chunk with legal pages (no ==== before Write for us). */
function stripTrailingStaticSections(md: string): string {
  const markers = [
    '\n# Write for us Content',
    '\n# Privacy Policy',
    '\n# Terms & Condition',
    '\n# Content Policy',
  ];
  let out = md;
  for (const m of markers) {
    const idx = out.indexOf(m);
    if (idx !== -1) out = out.slice(0, idx);
  }
  return out.trim();
}

export function sliceStaticSection(textPart: string, startMarker: string, endMarker: string | null): string {
  const start = textPart.indexOf(startMarker);
  if (start === -1) return '';
  const from = start;
  if (!endMarker) return textPart.slice(from).trim();
  const rel = textPart.slice(from + startMarker.length);
  const end = rel.indexOf(endMarker);
  if (end === -1) return textPart.slice(from).trim();
  return (startMarker + rel.slice(0, end)).trim();
}
