/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .owl-stage container inside the element (sometimes element is .owl-stage-outer, sometimes .owl-stage)
  let stage = element.querySelector(':scope > .owl-stage');
  if (!stage) stage = element;

  // Extract direct .owl-item children
  const owlItems = Array.from(stage.querySelectorAll(':scope > .owl-item'));

  // Deduplicate: Use the .row HTML signature
  const seenContent = new Set();
  const rows = [];
  owlItems.forEach(item => {
    const row = item.querySelector('.row');
    if (!row) return;
    const contentSig = row.innerHTML.trim();
    if (!seenContent.has(contentSig)) {
      seenContent.add(contentSig);
      rows.push(row);
    }
  });

  // Compose header row
  const headerRow = ['Columns (columns7)'];
  const tableRows = [headerRow];

  // For each row, gather each cell (column)
  rows.forEach(row => {
    // Use only immediate column divs (by bootstrap col class), else fallback to all children
    const columns = Array.from(row.children).filter(c => /col( |$|-|_)/.test(c.className));
    const colEls = columns.length ? columns : Array.from(row.children);

    // For each cell, reference the *existing* element in the document, not a clone
    const cells = colEls.map(cell => {
      // For any iframe element inside, replace with a link in the referenced original
      const iframes = Array.from(cell.querySelectorAll('iframe'));
      iframes.forEach(iframe => {
        const src = iframe.getAttribute('src') || '';
        if (src) {
          // Create a link element
          const link = document.createElement('a');
          link.href = src;
          link.textContent = src;
          iframe.parentNode.replaceChild(link, iframe);
        }
      });
      // Reference the original cell element which now has links
      return cell;
    });
    tableRows.push(cells);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(block);
}
