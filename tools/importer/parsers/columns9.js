/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for columns block, as per instructions
  const headerRow = ['Columns (columns9)'];

  // Identify main structure within element
  // Find: the heading, text column, images column, button
  const h1 = element.querySelector('h1');
  
  // The inner row contains two columns: text + badges
  let textCol = null;
  let imagesCol = null;
  const innerRow = element.querySelector('.row');
  if (innerRow) {
    const cols = innerRow.querySelectorAll(':scope > div');
    cols.forEach(col => {
      if (col.classList.contains('col-lg-5')) {
        textCol = col;
      }
      if (col.classList.contains('col-lg-3')) {
        imagesCol = col;
      }
    });
  }

  // Compose left column: heading, paragraph, button
  const leftCol = [];
  if (h1) leftCol.push(h1);
  if (textCol) {
    const p = textCol.querySelector('p');
    if (p) leftCol.push(p);
  }
  const button = element.querySelector('a.btn');
  if (button) leftCol.push(button);

  // Compose right column: all images (badges)
  const rightCol = [];
  if (imagesCol) {
    const badgeImgs = imagesCol.querySelectorAll('img');
    badgeImgs.forEach(img => {
      rightCol.push(img);
    });
  }

  // If columns are empty, use empty strings to avoid errors and maintain structure
  const columnsRow = [leftCol.length ? leftCol : '', rightCol.length ? rightCol : ''];

  // Build cells array: header, then columns row
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
