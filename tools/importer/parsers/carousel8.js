/* global WebImporter */
export default function parse(element, { document }) {
  // Find carousel container
  const carousel = element.querySelector('.owl-carousel.owl-theme');
  if (!carousel) return;
  const owlStage = carousel.querySelector('.owl-stage');
  if (!owlStage) return;

  // Get all .item nodes (slides)
  const slideNodes = Array.from(owlStage.querySelectorAll('.owl-item .item'));

  // Filter unique slides by image src
  const seenSrc = new Set();
  const uniqueSlides = [];
  slideNodes.forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return;
    const src = img.getAttribute('src');
    if (seenSrc.has(src)) return;
    seenSrc.add(src);
    uniqueSlides.push(slide);
  });

  // Build table rows
  const headerRow = ['Carousel (carousel8)'];
  const cells = [headerRow];
  uniqueSlides.forEach((slide) => {
    // First column: image element (reference directly)
    const img = slide.querySelector('img');
    // Second column: Gather ALL visible text and links
    const cardBody = slide.querySelector('.card-body');
    const cellContent = [];
    if (cardBody) {
      Array.from(cardBody.children).forEach((child) => {
        // Headings (h3, h5, etc)
        if (/^H[1-6]$/i.test(child.tagName)) {
          // Use h2 for title, p for subtitle, keep strong/bold
          if (child.tagName === 'H3') {
            const h2 = document.createElement('h2');
            h2.innerHTML = child.innerHTML;
            cellContent.push(h2);
          } else if (child.tagName === 'H5') {
            const p = document.createElement('p');
            p.innerHTML = child.innerHTML;
            cellContent.push(p);
          } else {
            cellContent.push(child); // keep as-is
          }
        } else if (child.tagName === 'DIV' || child.tagName === 'P') {
          // Paragraphs, divs (for grouping)
          cellContent.push(child);
        } else if (child.tagName === 'A') {
          // Call-to-action link, keep as-is
          cellContent.push(child);
        } else {
          // Any other element: include if not hidden
          cellContent.push(child);
        }
      });
    }
    cells.push([
      img,
      cellContent.length ? cellContent : ''
    ]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
