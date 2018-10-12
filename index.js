const SVGIcons2SVGFontStream = require("svgicons2svgfont");
const fs = require("fs");

/**
 * svg -> svg font stream
 * @param {Object} icons 
 * generateSvg([{
 * 	file: "svg/all.svg",
 * 	unicode: ["\uE001"],
 * 	name: "all"
 * }])
 * 
 */
async function generateSvg(icons) {
  return new Promise((resolve, reject) => {
    const opts = {
      normalize: true,
      fontName: "demo",
      fontHeight: 1024,
      fontWidth: 1024,
      round: 1000
    };
    const stream = new SVGIcons2SVGFontStream(opts);
    let font = new Buffer(0);
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

