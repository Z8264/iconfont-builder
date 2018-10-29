const fs = require("fs");
const Sax = require("sax"); //用于XML和HTML解析器

const SVGTemplate = d => `
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    style="" 
    version="1.1" 
    viewBox="0 0 1024 1024"
    width="1024" 
    height="1024">
  <defs><style type="text/css"></style></defs>
  <path d="${d}"/>
</svg>
`;

const FontTemplate = font => `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg">
<metadata></metadata>
<defs>
  <font id="${font.id}" horiz-adv-x="${font.width}">
    <font-face units-per-em="${font.height}" ascent="${font.ascent}" descent="${
  font.descent
}" />
    <missing-glyph horiz-adv-x="1024" />
    ${font.glyphs
      .map(
        glyph => `
    <glyph glyph-name="${glyph.name}"
      unicode="${glyph.unicode}"
      horiz-adv-x="${font.width}"
      d="${glyph.d}" />
    `
      )
      .join("")}
  </font>
</defs>
</svg>
`;

