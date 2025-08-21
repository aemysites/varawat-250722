/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row matches the example exactly
  const headerRow = ['Hero (hero5)'];

  // Extract background image from inline style
  const style = element.getAttribute('style') || '';
  let bgImgEl = null;
  const bgMatch = style.match(/background:\s*url\((?:"|')?(.*?)(?:"|')?\)/i);
  if (bgMatch && bgMatch[1]) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgMatch[1];
    bgImgEl.alt = '';
  }

  // Extract the main left column with textual content and CTA
  let contentCell;
  const container = element.querySelector('.container');
  if (container) {
    const leftCol = container.querySelector('.col-lg-6.slide-element');
    if (leftCol) {
      // Filter out any unwanted images (e.g. logo images)
      const children = Array.from(leftCol.childNodes).filter((n) => {
        if (n.nodeType === 1 && n.tagName === 'IMG') {
          return false; // skip logo image
        }
        // Remove empty text nodes
        if (n.nodeType === 3 && !n.textContent.trim()) {
          return false;
        }
        return true;
      });
      // If more than one child, pass as array; else as single element
      contentCell = children.length === 1 ? children[0] : children;
    }
  }

  // Fallback if no content extracted
  if (!contentCell) {
    contentCell = '';
  }

  // Build the table structure
  const rows = [
    headerRow,
    [bgImgEl || ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}