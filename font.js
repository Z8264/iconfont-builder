const fs = require("fs");
const { Transform } = require("stream");
const Sax = require("sax"); //用于XML和HTML解析器

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

class NewStream extends Transform {
  constructor(options) {
    super({ objectMode: true });
    // Setting objectMode separately
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;

    this.glyphs = [];

    this._options = options || {};
    this._options.fontName = this._options.fontName || "iconfont";
    this._options.fontId = this._options.fontId || this._options.fontName;
    this._options.fixedWidth = this._options.fixedWidth || false;
    this._options.descent = this._options.descent || 0;
    this._options.round = this._options.round || 10e12;
    this._options.metadata = this._options.metadata || "";
  }
  _transform(svgIconStream, encodeing, callback) {
    console.log("run _transform");

    const saxStream = Sax.createStream(true);
    const parents = [];
    // const transformStack = [new Matrix()];
    function applyTransform(d) {
      return new SVGPathData(d).matrix(
        ...transformStack[transformStack.length - 1].toArray()
      );
    }
    const glyph = svgIconStream.metadata || {};
    glyph.width = 0;
    glyph.height = 1;

    glyph.paths = [];
    this.glyphs.push(glyph);
    //
    saxStream.on("opentag", tag => {
      console.log("run opentag", tag);
      parents.push(tag);


      if(tag.name === "svg"){
        
      }
    });
    saxStream.on("error", err => {
      console.log("run error");
    });
    saxStream.on("closetag", () => {
      console.log("run closetag");
    });
    saxStream.on("end", () => {
      console.log("run end");
      callback();
    });
    svgIconStream.pipe(saxStream);
    // this.push(chunk);
    // callback();
  }
  _flush(callback) {
    console.log("run _flush");
  }
}

/**
 * 测试newStream
 */

const stream = new NewStream();

stream
  .on("data", data => {
    console.log("data:", data.toString());
  })
  .on("finish", () => {
    console.log("finish");
  });

let font = fs.createReadStream("./svg/all.svg");

font.on("data", data => {
  console.log("font data", data);
});

stream.write(font);
// stream.write("abc");
stream.end();
