const SVGIcons2SVGFontStream = require("svgicons2svgfont");
const fs = require("fs");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2eot = require("ttf2eot");
const ttf2woff2 = require("ttf2woff2");
const woff2base64 = require("woff2base64");

const config = {
  fontName: "iconfont",
  prefix: "icon",
  startCodePoint: 0xe000,
  icons: [
    {
      file: "svg/all.svg",
      unicode: ["\uE001"],
      name: "all"
    }
  ]
};

/**
 * svg 文件 -> svg font stream
 * @param {Object} icons
 * generateSvg([{
 * 	file: "svg/all.svg",
 * 	unicode: ["\uE001"],
 * 	name: "all"
 * }])
 * 使用方法：
 * const svg = await generateSvg(icons);
 * fs.writeFileSync("fonts/font.svg", svg);
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
        unicode: [icon.unicode],
        name: icon.name
      };
      stream.write(glyph);
    });
    stream.end();
  });
}

/**
 *
 * @param {*} svg
 */
async function generate(icons) {
  /**
   * svg
   */
  const svg = await generateSvg(icons);
  // fs.writeFileSync("fonts/font.svg", svg);
  /**
   * ttf
   */
  const ttf = new Buffer(svg2ttf(svg).buffer);
  // fs.writeFileSync("fonts/font.ttf", ttf);
  /**
   * eot
   */
  const eot = new Buffer(ttf2eot(new Uint8Array(ttf)).buffer);
  // fs.writeFileSync("fonts/font.eot", eot);
  /**
   * woff
   */
  const woff = new Buffer(ttf2woff(new Uint8Array(ttf)).buffer);
  // fs.writeFileSync("fonts/font.woff", woff);
  /**
   * woff2
   */
  const woff2 = new Buffer(ttf2woff2(new Uint8Array(ttf)).buffer);
  // fs.writeFileSync("fonts/font.woff2", woff2);
  /**
   * base64
   */
  const css = woff2base64(
    { "q.woff2": woff2, "q.woff": woff },
    { fontFamily: "iconfont" }
  );
  // fs.writeFileSync("fonts/font.css", css.woff);
  return css;
}



/**
 * 获取文件夹下所有svg文件
 * @param {*} src  文件路径
 */
async function getSvgFilesInDir(src) {
  return new Promise((resolve, reject) => {
    fs.readdir(src, (err, files) => {
      if (err) {
        reject(err);
      } else {
        files = files.filter(file => /\.svg$/i.test(file));
        resolve(files);
      }
    });
  });
}
/**
 * svg文件 --> icons集合
 * 
 * code -> hexcode/unicode/xmlcode
 */
async function getIcons(src) {
  return new Promise((resolve, reject) => {
    const files = await getSvgFilesInDir(src);

    let code = 0xe000;
    let icons = files.map(file => {
      code++;
      return {
        file: './svg/' + file,
        name: file.replace(".svg", ""),
        code: code,
        hex: code.toString(16),   // hexcode
        unicode: String.fromCharCode(code), // unicode
        xml: `&#x${code.toString(16)};`  // xmlcode
      };
    });
    resolve(icons);

  })

}
// readSvg("./svg").then(data => {
//   let icons = getIcons(data);
//   console.log(icons);
// });

async function css(src) {
  const files = await readSvg(src);
  const icons = getIcons(files);
  const fontcss = await generate(icons);
  console.log(fontcss.woff);
}

css("./svg");