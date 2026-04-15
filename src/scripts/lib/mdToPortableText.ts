/**
 * Minimal Markdown → Sanity Portable Text for Nation Bulletin import.
 * Handles: ##/### headings with ** wrappers, bullets, paragraphs, [text](url), **bold**, ![][imageN].
 */

export type ImageRefMap = Record<string, { _type: 'reference'; _ref: string }>;

function uid(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function parseInline(text: string): { children: Record<string, unknown>[]; markDefs: Record<string, unknown>[] } {
  const markDefs: Record<string, unknown>[] = [];
  const children: Record<string, unknown>[] = [];

  const addText = (t: string, marks: string[] = []) => {
    if (!t) return;
    const parts = t.split(/\*\*/);
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      const m = i % 2 === 1 ? [...marks, 'strong'] : [...marks];
      children.push({ _type: 'span', _key: uid(), text: parts[i], marks: m });
    }
  };

  let rest = text;
  while (rest.length > 0) {
    const m = rest.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (m) {
      const mk = uid();
      markDefs.push({ _type: 'link', _key: mk, href: m[2] });
      addText(m[1], [mk]);
      rest = rest.slice(m[0].length);
      continue;
    }
    const next = rest.indexOf('[');
    if (next > 0) {
      addText(rest.slice(0, next));
      rest = rest.slice(next);
      continue;
    }
    if (next === 0 && !m) {
      addText(rest[0]);
      rest = rest.slice(1);
      continue;
    }
    addText(rest);
    break;
  }

  return { children, markDefs };
}

function blk(
  style: string,
  children: Record<string, unknown>[],
  markDefs: Record<string, unknown>[],
  listItem?: string,
  level?: number
): Record<string, unknown> {
  const b: Record<string, unknown> = {
    _type: 'block',
    _key: uid(),
    style,
    children,
    markDefs,
  };
  if (listItem) {
    b.listItem = listItem;
    b.level = level ?? 1;
  }
  return b;
}

function headingLevel(trimmed: string): 'h2' | 'h3' | 'h4' | null {
  if (/^###\s+/.test(trimmed)) return 'h4';
  if (/^##\s+/.test(trimmed)) return 'h3';
  if (/^#\s+/.test(trimmed)) return 'h2';
  return null;
}

function stripHeading(trimmed: string): string {
  return trimmed
    .replace(/^#{1,3}\s+/, '')
    .replace(/^\*\*(.+)\*\*\s*$/, '$1')
    .replace(/\*\*/g, '')
    .trim();
}

export function markdownToPortableText(md: string, imageRefs: ImageRefMap): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [];
  const lines = md.split('\n');
  let para = '';

  const flushPara = () => {
    const t = para.trim();
    if (!t) return;
    const { children, markDefs } = parseInline(t);
    if (children.length) blocks.push(blk('normal', children, markDefs));
    para = '';
  };

  for (const raw of lines) {
    const trimmed = raw.replace(/\r$/, '').trim();

    const imgLine = trimmed.match(/^!?\[\]\[image(\d+)\]\s*$/);
    if (imgLine) {
      flushPara();
      const refKey = `image${imgLine[1]}`;
      const assetRef = imageRefs[refKey];
      if (assetRef) {
        blocks.push({
          _type: 'image',
          _key: uid(),
          asset: assetRef,
        });
      }
      continue;
    }

    const hl = headingLevel(trimmed);
    const restAfterHashes = trimmed.replace(/^#{1,3}\s+/, '').trim();
    const isHeading =
      hl &&
      (/^#{1,3}\s+\*\*/.test(trimmed) || /^\*\*.+\*\*$/.test(restAfterHashes));

    if (isHeading && hl) {
      flushPara();
      const text = stripHeading(trimmed);
      const { children, markDefs } = parseInline(text);
      blocks.push(blk(hl, children, markDefs));
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushPara();
      const item = trimmed.replace(/^[-*]\s+/, '');
      const { children, markDefs } = parseInline(item);
      blocks.push(blk('normal', children, markDefs, 'bullet', 1));
      continue;
    }

    if (!trimmed) {
      flushPara();
      continue;
    }

    para += (para ? ' ' : '') + trimmed;
  }
  flushPara();
  return blocks;
}
