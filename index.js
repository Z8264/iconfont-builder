const SVGIcons2SVGFontStream = require("svgicons2svgfont");
const fs = require("fs");
const svg2ttf = require('svg2ttf');
const ttf2woff = require('ttf2woff');
const ttf2eot = require('ttf2eot');
const ttf2woff2 = require('ttf2woff2');
const woff2base64 = require('woff2base64');
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

generateSvg([{
  file: "svg/all.svg",
  unicode: ["\uE001"],
  name: "all"
}]).then(svg => {
  generateTTF(svg);
})

async function generateTTF(svg) {
  const ttf = new Buffer(svg2ttf(svg).buffer);
  const eot = new Buffer(ttf2eot(new Uint8Array(ttf)).buffer);
  const woff = new Buffer(ttf2woff(new Uint8Array(ttf)).buffer);
  const woff2 = new Buffer(ttf2woff(new Uint8Array(ttf)).buffer);

  const css = woff2base64({ "q.woff2":woff2,"q.woff":woff }, { fontFamily: 'iconfont' });
  fs.writeFileSync('fonts/font.css', css.woff);

  // fs.writeFileSync('fonts/font.ttf',ttf);
  // fs.writeFileSync('fonts/font.eot',eot);
  // fs.writeFileSync('fonts/font.woff',woff);
}

