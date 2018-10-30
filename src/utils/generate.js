const svgpath = require("svgpath");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2eot = require("ttf2eot");
const ttf2woff2 = require("ttf2woff2");
const woff2base64 = require("woff2base64");

const SVGFontTemplate = require("./SVGFontTemplate");
const CSSTemplate = require("./CSSTemplate");
const HTMLTemplate = require("./HTMLTemplate");

/**
 * 生成字体
 * @param {Array} icons
 * @param {String} fontName
 * @param {String} prefix
 *  -- name   图标名称
 *  -- code   图标unicode
 *  -- d      图标d属性值
 * @returns { svg, ttf, eot, woff, woff2, css, html }
 */
function generate(icons, fontName = "iconfont", prefix = "icon") {
  /**
   * 将icon做path偏移
   * 偏移量：0 -64
   * 偏移原因：为了适配字体基线
   */
  const glyphs = icons.map(icon => {
    icon.d = svgpath(icon.d)
      .translate(0, -64)
      .rel()
      .round(1)
      .toString();
    return icon;
  });
  /**
   * svg
   */
  const svg = SVGFontTemplate({
    width: 1024,
    height: 1024,
    ascent: 960,
    descent: -64,
    glyphs: glyphs
  });
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
  const base64 = woff2base64(
    { "q.woff2": woff2, "q.woff": woff },
    { fontFamily: fontName }
  ).woff;
  /**
   * css
   */
  const css = CSSTemplate({
    fontName: fontName,
    prefix: prefix,
    base64: base64,
    icons: icons
  });
  /**
   * html
   */
  const html = HTMLTemplate({
    fontName: fontName,
    prefix: prefix,
    css: css,
    icons: icons
  });

  return { svg, ttf, eot, woff, woff2, css, html };
}
module.exports = generate;
