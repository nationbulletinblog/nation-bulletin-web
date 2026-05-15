function decodeEntities(text: string) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export function htmlToPortableText(html: string) {
  if (!html) return [];

  // 1. Basic normalization
  let normalized = html
    .replace(/\r?\n|\r/g, ' ') // Replace newlines with spaces
    .replace(/<div[^>]*>(.*?)<\/div>/gi, '<p>$1</p>') // Divs to paragraphs
    .replace(/&nbsp;/g, ' ');

  // 2. Extract structural blocks
  const blockRegex = /<(p|h1|h2|h3|h4|h5|h6|li)[^>]*>(.*?)<\/\1>/gi;
  const blocks: any[] = [];
  let match;

  while ((match = blockRegex.exec(normalized)) !== null) {
    const tag = match[1].toLowerCase();
    const rawContent = match[2];
    
    const children: any[] = [];
    const markDefs: any[] = [];
    let activeMarks: string[] = [];
    
    // Tokenize the content into tags and text segments
    const tokens = rawContent.match(/(<[^>]+>|[^<]+)/g) || [];
    
    for (const token of tokens) {
      if (token.startsWith('<a')) {
        const hrefMatch = token.match(/href="([^"]+)"/i);
        if (hrefMatch) {
          const markKey = `link-${Math.random().toString(36).substring(2, 11)}`;
          markDefs.push({
            _key: markKey,
            _type: 'link',
            href: hrefMatch[1]
          });
          activeMarks.push(markKey);
        }
      } else if (token === '</a>') {
        activeMarks = activeMarks.filter(m => !m.startsWith('link-'));
      } else if (token === '<strong>' || token === '<b>') {
        activeMarks.push('strong');
      } else if (token === '</strong>' || token === '</b>') {
        activeMarks = activeMarks.filter(m => m !== 'strong');
      } else if (token === '<em>' || token === '<i>') {
        activeMarks.push('em');
      } else if (token === '</em>' || token === '</i>') {
        activeMarks = activeMarks.filter(m => m !== 'em');
      } else if (!token.startsWith('<')) {
        // This is a text segment
        const text = decodeEntities(token);
        if (text) {
          children.push({
            _key: `span-${Math.random().toString(36).substring(2, 11)}`,
            _type: 'span',
            text: text,
            marks: [...new Set(activeMarks)]
          });
        }
      }
    }

    if (children.length === 0) continue;

    const block: any = {
      _key: `block-${Math.random().toString(36).substring(2, 11)}`,
      _type: 'block',
      children,
      markDefs,
      style: tag.startsWith('h') ? tag : 'normal'
    };

    if (tag === 'li') {
      block.listItem = 'bullet';
      block.level = 1;
      block.style = 'normal';
    }

    blocks.push(block);
  }

  // Fallback for simple content
  if (blocks.length === 0 && html) {
    const plainText = decodeEntities(html.replace(/<[^>]*>/g, '').trim());
    if (plainText) {
      return [{
        _key: `block-${Math.random().toString(36).substring(2, 11)}`,
        _type: 'block',
        style: 'normal',
        children: [{ _key: `span-${Math.random().toString(36).substring(2, 11)}`, _type: 'span', text: plainText }]
      }];
    }
  }

  return blocks;
}
