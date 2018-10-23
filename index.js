const SVGIcons2SVGFontStream = require("./svgicons2svgfontstream");
const fs = require("fs");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2eot = require("ttf2eot");
const ttf2woff2 = require("ttf2woff2");
const woff2base64 = require("woff2base64");
const svgpath = require("svgpath");
const Font = require("fonteditor-core").Font;

const config = {
  fontName: "iconfont",
  prefix: "icon",
  src: "./svg"
};

/**
 * 将icons集合转化为svg font
 * @param {Object} icons
 * 使用方法：
 * const svg = await generateSvg(icons);
 * fs.writeFileSync("fonts/font.svg", svg);
 *
 */
async function icons2SVGFont(icons) {
  return new Promise((resolve, reject) => {
    const opts = {
      normalize: true,
      fontName: "demo",
      fontHeight: 1024,
      fontWidth: 1024,
      ascent: 960,
      descent: -64
      // fontWeight: 400
    };
    const stream = new SVGIcons2SVGFontStream(opts);
    let font = Buffer.alloc(0);
    stream
      .on("data", data => {
        // console.log(data.toString());
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
 * 将icons集合转化为base64 font
 * @param {Object} icons
 */
async function icons2base64(icons) {
  /**
   * svg
   */
  const svg = await icons2SVGFont(icons);
  fs.writeFileSync("fonts/font.svg", svg);
  /**
   * ttf
   */
  const ttf = Buffer.from(svg2ttf(svg).buffer);
  /**
   * eot
   */
  const eot = Buffer.from(ttf2eot(new Uint8Array(ttf)).buffer);
  /**
   * woff
   */
  const woff = Buffer.from(ttf2woff(new Uint8Array(ttf)).buffer);
  /**
   * woff2
   */
  const woff2 = Buffer.from(ttf2woff2(new Uint8Array(ttf)).buffer);
  /**
   * base64
   */
  const css = woff2base64(
    { "q.woff2": woff2, "q.woff": woff },
    { fontFamily: "iconfont" }
  );

  return css.woff;
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
 * 将文件夹下所有svg文件转换为icons集合
 * @param {*} src
 */
async function getIconsInDir(src) {
  const files = await getSvgFilesInDir(src);

  let code = 0xe000;
  return (icons = files.map(file => {
    code++;
    return {
      file: src + "/" + file,
      name: file.replace(".svg", ""),
      code: code,
      hex: code.toString(16), // hexcode
      unicode: String.fromCharCode(code), // unicode
      xml: `&#x${code.toString(16)};` // xmlcode
    };
  }));
}

/**
 * CSS Template
 * @param {Object} data
 * -- fontName
 * -- prefix
 * -- icons
 *   -- name
 *   -- hex
 */
const cssTemplate = data => `
  ${data.base64}
  .${data.prefix} {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: '${data.fontName}' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;

    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ${data.icons.map(icon=>`
  .${data.prefix}-${icon.name}:before {
    content:'\\${icon.hex}';
  }
  `).join('')}
`;


async function css(src) {
  const icons = await getIconsInDir(src);

  const cssbase64 = await icons2base64(icons);

  const css = cssTemplate({
    base64: cssbase64,
    fontName:'iconfont',
    prefix:'icon',
    icons: icons
  })

  fs.writeFileSync("fonts/font.css", css);
  console.log('css is ok');
}

css("./svg");
