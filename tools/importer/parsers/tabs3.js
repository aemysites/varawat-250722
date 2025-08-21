/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabbed content section
  const tabbedContent = element.querySelector('.tabbed-content.tabs-side');
  if (!tabbedContent) return;

  // Header row for the Tabs block
  const cells = [['Tabs']];

  // Get all tab labels in order
  let tabLabels = [];
  const labelList = tabbedContent.querySelector('.ta-tabs ul');
  if (labelList) {
    tabLabels = Array.from(labelList.querySelectorAll('a')).map(a => a.textContent.trim());
  }

  // Get all tab content elements in order
  const tabContentBox = tabbedContent.querySelector('.ta-content-box');
  if (!tabContentBox) return;
  const tabItems = Array.from(tabContentBox.querySelectorAll('.ta-item'));

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabItems.length; i++) {
    const tabItem = tabItems[i];
    let label = '';
    if (tabLabels[i]) {
      label = tabLabels[i];
    } else if (tabItem.getAttribute('data-title')) {
      label = tabItem.getAttribute('data-title').trim();
    } else {
      const h3 = tabItem.querySelector('h3');
      label = h3 ? h3.textContent.trim() : '';
    }
    // Tab content: use .ta-item-content as the cell content
    const content = tabItem.querySelector('.ta-item-content');
    if (label && content) {
      cells.push([label, content]);
    }
  }

  // Create table and replace 
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
