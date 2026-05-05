export function htmlToPortableText(html: string) {
  if (!html) return [];

  // 1. Basic normalization - strip problematic Office/Google junk
  let normalized = html
    .replace(/\r?\n|\r/g, ' ') // Replace newlines with spaces
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1') // Strip spans
    .replace(/<div[^>]*>(.*?)<\/div>/gi, '<p>$1</p>') // Divs to paragraphs
    .replace(/&nbsp;/g, ' ');

  // 2. Extract structural blocks using a smarter approach
  // We want to find <p>, <li>, <h1>-<h4> tags and their contents
  const blockRegex = /<(p|h1|h2|h3|h4|h5|h6|li)[^>]*>(.*?)<\/\1>/gi;
  const blocks: any[] = [];
  let match;

  while ((match = blockRegex.exec(normalized)) !== null) {
    const tag = match[1].toLowerCase();
    let content = match[2].replace(/<[^>]*>/g, '').trim();
    
    // Basic decoding of entities
    content = content
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');

    if (!content) continue;

    const block: any = {
      _key: `block-${Math.random().toString(36).substring(2, 11)}`,
      _type: 'block',
      children: [
        {
          _key: `span-${Math.random().toString(36).substring(2, 11)}`,
          _type: 'span',
          text: content,
          marks: []
        },
      ],
      markDefs: [],
    };

    // Map tag to Sanity styles
    if (tag === 'li') {
      block.listItem = 'bullet';
      block.level = 1;
      block.style = 'normal';
    } else if (tag.startsWith('h')) {
      block.style = tag;
    } else {
      block.style = 'normal';
    }

    blocks.push(block);
  }

  // If no blocks found (e.g. raw text without tags), fallback to simple split
  if (blocks.length === 0 && html) {
    return html.split('\n').filter(t => t.trim()).map(text => ({
      _key: `block-${Math.random().toString(36).substring(2, 11)}`,
      _type: 'block',
      style: 'normal',
      children: [{ _key: `span-${Math.random().toString(36).substring(2, 11)}`, _type: 'span', text: text.trim() }]
    }));
  }

  return blocks;
}
