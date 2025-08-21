/* global WebImporter */
export default function parse(element, { document }) {
  // The block header, as in the example
  const headerRow = ['Carousel (carousel2)'];
  const cells = [headerRow];

  // Find the carousel structure
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;
  const stage = carousel.querySelector('.owl-stage');
  if (!stage) return;
  const owlItems = Array.from(stage.children).filter(child => child.classList.contains('owl-item'));

  owlItems.forEach((owlItem) => {
    // Each slide: .item
    const item = owlItem.querySelector('.item');
    if (!item) return;

    // Get background image from style attribute
    let bgUrl = '';
    const style = item.getAttribute('style');
    if (style) {
      const match = style.match(/background:\s*url\(['"]?([^'"\)]+)['"]?/);
      if (match) {
        bgUrl = match[1];
      }
    }
    // Create image element for the first cell (keep the reference for max fidelity)
    let imgEl = null;
    if (bgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = bgUrl;
      imgEl.setAttribute('loading', 'lazy');
      imgEl.style.width = '100%';
      imgEl.style.height = 'auto';
    } else {
      // fallback if no bg image
      imgEl = '';
    }

    // Slide content for second cell
    let textCell = [];
    // The dom structure puts the content in .container > .col-*
    const textContainer = item.querySelector('.container');
    let colContent = null;
    if (textContainer) {
      // Try to find the (first) .col-* inside .container
      colContent = textContainer.querySelector('[class*="col-"]') || textContainer;
    }
    if (colContent) {
      // Heading (h1)
      const origHeading = colContent.querySelector('h1');
      if (origHeading) {
        // Use h2 for block structure, but keep original content
        const h2 = document.createElement('h2');
        h2.innerHTML = origHeading.innerHTML;
        textCell.push(h2);
      }
      // Any other descriptive text (usually not present, but for flexibility)
      // If there are text nodes (siblings of h1), or <p>, add them
      Array.from(colContent.childNodes).forEach(node => {
        // Only add text nodes between elements, not inside h1 or a
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent.trim() !== ''
        ) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textCell.push(p);
        }
        // Paragraphs outside h1/a
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName.toLowerCase() === 'p'
        ) {
          textCell.push(node);
        }
      });
      // CTA button (a)
      const cta = colContent.querySelector('a');
      if (cta) {
        textCell.push(cta);
      }
    }
    // If nothing found, ensure cell is not empty
    if (textCell.length === 0) textCell = [''];

    // Push row for this slide
    cells.push([imgEl, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
