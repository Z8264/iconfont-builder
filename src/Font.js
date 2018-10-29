const fs = require("fs");
const svgpath = require("svgpath");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2eot = require("ttf2eot");
const ttf2woff2 = require("ttf2woff2");
const woff2base64 = require("woff2base64");

const standard = require("./utils/standerd");
const SVGTemplate = require("./utils/SVGTemplate");
const FontTemplate = require("./utils/FontTemplate");
const CSSTemplate = require("./utils/CSSTemplate");

class Font {
  constructor(options = {}) {
    /**
     * 字体的名称，font-family的属性值
     */
    this.fontName = options.fontName || "iconfont";
    /**
     * 前缀
     */
    this.prefix = options.prefix || "icon";
    /**
     * 存放字体图标 Icon 对象
     */
    this.icons = [];
    /**
     * 当前unicode计数
     */
    this._currentCode = 0xe000;
    /**
     * 用于存储已经存在的unicode
     */
    this._codeStack = [];
    /**
     * 用于已经存在的name
     */
    this._nameStack = [];
  }
  /**
   * 添加一个图标到字体中
   * @param {String} name  图标名
   * @param {Buffer || String} buffer  图标Buffer
   */
  add(name, buffer) {
    let me = this;

    /**
     * 判断数据是否合法
     */
    if (!name && !buffer) return;

    /**
     * name不能重复，给与一个合法的name
     */
    let _name = name;
    let i = 0;
    while (this._nameStack.includes(name)) {
      i++;
      name = _name + "_" + index;
    }
    /**
     * unicode不能重复，给与一个合法的unicode
     */
    let code = this._currentCode++;
    while (this._codeStack.includes(code)) {
      code = this._currentCode++;
    }
    /**
     * 添加单个icon
     */
    this._nameStack.push(name);
    this._codeStack.push(code);
    this.icons.push({
      name: name,
      d: standard(buffer),
      code: code
      // hex: code.toString(16), // hexcode
      // unicode: String.fromCharCode(code), // unicode
      // xml: `&#x${code.toString(16)};` // xmlcode
    });
  }

  generate() {
    /**
     * 将icon做字体偏移
     * 偏移量：-64
     */
    let glyphs = this.icons.map(icon => {
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
    const svg = FontTemplate({
      id: "",
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
      { fontFamily: "iconfont" }
    ).woff;
    /**
     * css
     */
    const css = CSSTemplate({
      fontName: this.fontName,
      prefix: this.prefix,
      base64: base64,
      icons: this.icons
    });
    return css;
  }
}

let font = new Font();

let files = fs.readdirSync("../svg").filter(file => /\.svg$/i.test(file));
files.map(file => {
  const name = file.replace(".svg", "");
  const buffer = fs.readFileSync("../svg" + "/" + file);
  font.add(name, buffer);
});

let css = font.generate();

fs.writeFileSync("../fonts/font.css", css);
console.log("css is ok");
