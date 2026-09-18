const fs = require('fs');

function replaceProps(filename, propName) {
  let content = fs.readFileSync(filename, 'utf8');
  
  // Remove the hardcoded array
  const arrayStart = content.indexOf(`const ${propName} = [`);
  if (arrayStart !== -1) {
    const arrayEnd = content.indexOf('];', arrayStart);
    if (arrayEnd !== -1) {
      content = content.substring(0, arrayStart) + content.substring(arrayEnd + 2);
    }
  }

  // Find component declaration
  const componentName = filename.split('/').pop().replace('.jsx', '');
  content = content.replace(
    new RegExp(`const ${componentName} = \\(\\) => {`), 
    `const ${componentName} = ({ data }) => {\n  const ${propName} = data || [];`
  );

  fs.writeFileSync(filename, content);
}

replaceProps('client/src/components/home/VehiclesSection.jsx', 'vehicles');
replaceProps('client/src/components/home/OccasionsSection.jsx', 'occasions');
replaceProps('client/src/components/home/TestimonialsSection.jsx', 'testimonials');
replaceProps('client/src/components/home/GallerySection.jsx', 'gallery');

console.log('Fixed props!');
