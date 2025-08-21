/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must exactly match example
  const headerRow = ['Hero (hero6)'];

  // Extract background image from inline style, if present
  let bgImgEl = null;
  const styleAttr = element.getAttribute('style') || '';
  const bgMatch = styleAttr.match(/background:\s*url\(([^)]+)\)/i);
  if (bgMatch && bgMatch[1]) {
    const bgUrl = bgMatch[1].replace(/&quot;/g, '').replace(/^['"]|['"]$/g, '');
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }

  // Row 2: background image (optional)
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // Row 3: text content (h1, p, a)
  // The text is in .col-lg-5 (left column)
  const col5 = element.querySelector('.col-lg-5');
  const contentCell = [];
  if (col5) {
    // Output all child nodes in order, reference existing elements
    col5.childNodes.forEach(node => {
      // Only add Elements (e.g. h1, p, a), skip text nodes with just whitespace
      if (node.nodeType === 1) {
        contentCell.push(node);
      }
    });
  }
  // If nothing found, ensure at least empty string so cell exists
  const textRow = [contentCell.length ? contentCell : ''];

  // Construct the table
  const cells = [headerRow, bgRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
