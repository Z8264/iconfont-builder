const SVGIcons2SVGFontStream = require("svgicons2svgfont");

const fs = require("fs");

/**
 * fontName
 * fontId
 * fontStyle
 * fontWeight
 * fontHeight
 * fixedWidth
 * centerHorizontally
 * normalize
 * round
 * descent
 * ascent
 * metadata
 * log
 */

async function generateSvg(icons) {
  const stream = new SVGIcons2SVGFontStream({
    normalize: true,
    fontName: "demo",
    fontHeight: 1024,
    fontWidth: 1024,
    round: 1000
  });

  let font = new Buffer(0);
  return new Promise((resolve, reject) => {
    stream
      .on("data", data => {
        font = Buffer.concat([font, data]);
      })
      .on("finish", () => {
        resolve(font.toString());
      })
      .on("error", err => {
        reject(err);
      });

    icons.forEach(icon => {
      const glyph = fs.createReadStream(icon.file);
      glyph.metadata = {
        unicode: icon.unicode,
        name: icon.name
      };
      stream.write(glyph);
    });
    stream.end();
  });
}

generateSvg([
  {
    file: "svg/all.svg",
    unicode: ["\uE001"],
    name: "all"
  }
]).then(str => {
  console.log(str);
});
