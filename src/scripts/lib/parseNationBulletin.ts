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

export async function loadMarkdownAndImages(repoRoot: string): Promise<{
  textPart: string;
  imageBuffers: Map<number, Buffer>;
}> {
  const mdPath = path.join(repoRoot, 'Nation Bulletin Blogs Full.md');
  if (!fs.existsSync(mdPath)) {
    throw new Error(`Missing source file: ${mdPath}`);
  }

  const input = fs.createReadStream(mdPath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  const textLines: string[] = [];
  const imageBuffers = new Map<number, Buffer>();

  for await (const line of rl) {
    textLines.push(line);
  }

  return { textPart: textLines.join('\n'), imageBuffers };
}

function blogRegionOnly(textPart: string): string {
  const w = textPart.indexOf('# Write for us Content');
  return w === -1 ? textPart : textPart.slice(0, w).trimEnd();
}

function isSeparatorLine(trimmed: string): boolean {
  if (!trimmed) return false;
  return /^=+$/.test(trimmed);
}

export function parseArticles(textPart: string): ParsedArticle[] {
  // Use separators to split articles
  const sections = textPart.split('================================================================================');
  const articles: ParsedArticle[] = [];
  let imageCount = 1;

  for (const section of sections) {
    const lines = section.trim().split('\n');
    if (lines.length < 3) continue;

    // Header 0: # Category
    const catMatch = lines[0].match(/^#\s+(.+)$/);
    if (!catMatch) continue;
    
    let rawCat = catMatch[1].trim().toLowerCase();
    
    // Skip legal pages in the blog parser
    if (['privacy policy', 'terms & condition', 'content policy'].includes(rawCat)) continue;

    let categorySlug = rawCat;
    if (rawCat === 'finance') categorySlug = 'business';
    else if (rawCat === 'tech') categorySlug = 'technology';

    // Header 1: **Title**
    const titleMatch = lines[2].match(/^\*\*(.+)\*\*$/);
    if (!titleMatch) continue;
    const title = titleMatch[1].trim();

    // The rest is body
    const bodyMarkdown = lines.slice(3).join('\n').trim();

    articles.push({
      categorySlug,
      title,
      slug: slugify(title),
      imageIndex: imageCount++,
      bodyMarkdown,
    });
  }

  return articles;
}

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
