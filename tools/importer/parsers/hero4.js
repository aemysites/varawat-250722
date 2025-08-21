/* global WebImporter */
export default function parse(element, { document }) {
  // Block header (matches example exactly)
  const headerRow = ['Hero (hero4)'];

  // Row 2: Background image (optional)
  let bgImgElem = null;
  const style = element.getAttribute('style') || '';
  const bgUrlMatch = style.match(/background:\s*url\((?:['"])?([^'")]+)(?:['"])?\)/);
  if (bgUrlMatch && bgUrlMatch[1]) {
    const bgImageUrl = bgUrlMatch[1];
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImageUrl;
    bgImgElem.setAttribute('loading', 'lazy');
  }
  const imageRow = [bgImgElem ? bgImgElem : ''];

  // Row 3: Content (title, subheading, CTA)
  let contentParts = [];
  // Find main content column: .slide-element
  const slideElems = element.querySelectorAll(':scope .slide-element');
  if (slideElems.length > 0) {
    const contentElem = slideElems[0];
    // Heading (could be missing)
    const heading = contentElem.querySelector('h1');
    if (heading) contentParts.push(heading);
    // Paragraph(s): may contain CTA links
    const paragraphs = contentElem.querySelectorAll('p');
    paragraphs.forEach(p => contentParts.push(p));
    // Direct children A tags NOT inside a paragraph (additional CTAs)
    Array.from(contentElem.children).forEach(child => {
      if (
        child.tagName === 'A' &&
        !Array.from(paragraphs).some(p => p.contains(child))
      ) {
        contentParts.push(child);
      }
    });
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
