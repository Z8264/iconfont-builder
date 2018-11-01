const fs = require("fs");

const core = require("./core/core");

module.exports = class Font {
  constructor(options = {}) {
    /**
     * 字体的名称，用于font-family的属性值
     */
    this._fontName = options.fontName || "iconfont";
    /**
     * 前缀，用于css类名
     */
    this._prefix = options.prefix || "icon";
    /**
     * 存放字体图标 Icon 对象
     */
    this._icons = [];
    /**
     * 当前unicode计数
     */
    this._code = 0xe000;
    /**
     * 用于存储已经存在的unicode
     */
    this._codeStack = [];
    /**
     * 用于已经存在的name
     */
    this._nameStack = [];

    /**
     * 当fontName,prefix,icons更新时,_latest变为false，需要重新调用generate进行编译
     */
    this._latest = false;

    /**
     * 调用generate，编译字体文件
     * 生成 ttf，eot，woff，woff2，css，html
     */
    this._ttf = "";
    this._eot = "";
    this._woff = "";
    this._woff2 = "";
    this._css = "";
    this._html = "";
  }
  static normalize() {
    return core.normalize.apply(this, arguments);
  }
  static generate() {
    return core.generate.apply(this, arguments);
  }
  /**
   * 添加一个图标到字体中
   * @param {String} name  图标名
   * @param {Buffer || String} buffer  图标Buffer
   */
  add(name, buffer) {
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
    let code = this._code++;
    while (this._codeStack.includes(code)) {
      code = this._code++;
    }
    /**
     * 添加单个icon
     */
    this._nameStack.push(name);
    this._codeStack.push(code);
    this._icons.push({
      name: name,
      d: core.normalize(buffer),
      hex: code.toString(16) // 十六进制
      // unicode: String.fromCharCode(code), // unicode
      // xml: `&#x${code.toString(16)};` // xmlcode
    });

    this._latest = false;
  }
  /**
   * 读取svg文件或文件夹中的svg文件，添加到font
   * @param {*} src
   */
  from(src) {
    if (!fs.existsSync(src)) return;
    if (fs.statSync(src).isDirectory()) this._fromDir(src);
    else this._fromFile(src);
  }
  /**
   * 读取svg文件，并添加到Font
   * @param {*} src
   */
  _fromFile(src) {
    const val = src.match(/^.+\/(\w+\.\w+)/i)[1].split(".");
    const name = val[0];
    const type = val[1];
    if (type.toLowerCase !== "svg") return;
    const buffer = fs.readFileSync(src);
    this.add(name, buffer);
  }
  /**
   * 批量读取文件夹中的svg文件，并添加到Font
   * @param {*} src
   */
  _fromDir(src) {
    const _this = this;
    const files = fs.readdirSync(src).filter(file => /\.svg$/i.test(file));
    files.map(file => {
      const name = file.replace(".svg", "");
      const buffer = fs.readFileSync(src + "/" + file);
      _this.add(name, buffer);
    });
  }
  generate() {
    const res = core.generate(this._icons, this._fontName, this._prefix);
    this._svg = res.svg;
    this._ttf = res.ttf;
    this._eot = res.eot;
    this._woff = res.woff;
    this._woff2 = res.woff2;
    this._css = res.css;
    this._html = res.html;
    this._latest = true;
  }
  /**
   * fontName
   */
  get fontName() {
    return this._fontName;
  }
  set fontName(value = "") {
    this._fontName = value;
    this._latest = false;
  }
  /**
   * prefix
   */
  get prefix() {
    return this._prefix;
  }
  set prefix(value = "") {
    this._prefix = value;
    this._latest = false;
  }
  /**
   * icons
   */
  get icons() {
    return this._icons;
  }
  /**
   *  获取生成genrate之后的文件
   */
  get svg() {
    if (!this._latest) this.generate();
    return this._svg;
  }
  get ttf() {
    if (!this._latest) this.generate();
    return this._ttf;
  }
  get eot() {
    if (!this._latest) this.generate();
    return this._eot;
  }
  get woff() {
    if (!this._latest) this.generate();
    return this._woff;
  }
  get woff2() {
    if (!this._latest) this.generate();
    return this._woff2;
  }
  get css() {
    if (!this._latest) this.generate();
    return this._css;
  }
  get html() {
    if (!this._latest) this.generate();
    return this._html;
  }
};
