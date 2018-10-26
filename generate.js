const fs = require("fs");
const { Transform } = require("stream");
const Sax = require("sax");

const svgpath = require("svgpath");

const { SVGPathData } = require("svg-pathdata");
const { Matrix } = require("transformation-matrix-js");

async function generate(src) {
  const saxStream = Sax.createStream(true);
  const transformStack = [new Matrix()];
  function applyTransform(d) {
    return new SVGPathData(d).matrix(
      ...transformStack[transformStack.length - 1].toArray()
    );
  }

  let vb = [],
    vb_x,
    vb_y,
    vb_w,
    vb_h;
  let width, height;
  let paths = [];

  return new Promise((resolve, reject) => {
    saxStream.on("opentag", tag => {
      if (tag.name === "svg") {
        let hasViewBox = "viewBox" in tag.attributes,
          hasWidth = "width" in tag.attributes,
          hasHeight = "height" in tag.attributes;
        if (hasViewBox) {
          vb = tag.attributes.viewBox
            .split(/\s*,*\s|\s,*\s*|,/)
            .map(value => parseFloat(value));
          vb_x = vb[0];
          vb_y = vb[1];
          vb_w = vb[2];
          vb_h = vb[3];
          width = hasWidth ? parseFloat(tag.attributes.width) : vb_w;
          height = hasHeight ? parseFloat(tag.attributes.height) : vb_h;

          // const dx = parseFloat(vb[0]);
          // const dy = parseFloat(vb[1]);
          // const width = parseFloat(vb[2]);
          // const height = parseFloat(vb[3]);
          // glyph.width =
          //   "width" in tag.attributes
          //     ? parseFloat(tag.attributes.width)
          //     : width;
          // glyph.height =
          //   "height" in tag.attributes
          //     ? parseFloat(tag.attributes.height)
          //     : height;

          // transformStack[transformStack.length - 1]
          //   .translate(-dx, -dy)
          //   .scale(glyph.width / width, glyph.height / height);
        } else {
          // glyph.width = parseFloat(tag.attributes.width);
          // glyph.height = parseFloat(tag.attributes.height);
        }
      }
      if (tag.name === "path" && tag.attributes.d) {
        // glyph.paths.push(applyTransform(tag.attributes.d));
        // glyph.paths.push(
        //   svgpath(tag.attributes.d)
        //     .translate(-parseFloat(vb[0]), -parseFloat(vb[1]))
        //     .scale(
        //       glyph.width / parseFloat(vb[2]),
        //       glyph.height / parseFloat(vb[3])
        //     )
        // );
        // glyph.d = svgpath(tag.attributes.d)
        //   .translate(-parseFloat(vb[0]), -parseFloat(vb[1]))
        //   .scale(
        //     glyph.width / parseFloat(vb[2]),
        //     glyph.height / parseFloat(vb[3])
        //   )
        //   .rel()
        //   .round(1)
        //   .toString();
      }
    });

    saxStream.on("end", () => {
      // const glyphPath = new SVGPathData("");
      // const glyphPathTransform = new Matrix().transform(1, 0, 0, -1, 0, 0); // ySymmetry
      // glyph.paths.forEach(path => {
      //   glyphPath.commands.push(
      //     ...path.toAbs().matrix(...glyphPathTransform.toArray()).commands
      //   );
      // });
      // glyph.d =  glyphPath.round(1).encode();

      resolve(icon);
    });

    fs.createReadStream("./svg/set.svg").pipe(saxStream);
  });
}

generate().then(data => {
  console.log(data);
});


/**
 * 测试
 */
// var st = fs.createReadStream("./svg/set.svg");

// const saxStream = Sax.createStream(true);
// saxStream.on('opentag',tag=>{
//   console.log(tag);
// })
// saxStream.on('end',()=>{
//   console.log('end');
// })


// st.on('data',data =>{
//   console.log(data.toString());
//   saxStream.write(data.toString());
//   saxStream.end();
// });

