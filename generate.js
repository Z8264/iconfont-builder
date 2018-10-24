const fs = require("fs");
const { Transform } = require("stream");
const Sax = require("sax");


const svgpath = require("svgpath");


async function generate(src) {
  const saxStream = Sax.createStream(true);
  // const transformStack = [new Matrix()];
  // function applyTransform(d) {
  //   return new SVGPathData(d).matrix(
  //     ...transformStack[transformStack.length - 1].toArray()
  //   );
  // }

  let glyph = {
    width: 0,
    height: 0,
    paths: []
  };

  let vb = [];

  return new Promise((resolve, reject) => {

    saxStream.on("opentag", tag => {
      if (tag.name === "svg") {
        if ("viewBox" in tag.attributes) {
          vb = tag.attributes.viewBox.split(/\s*,*\s|\s,*\s*|,/);
          const dx = parseFloat(vb[0]);
          const dy = parseFloat(vb[1]);
          const width = parseFloat(vb[2]);
          const height = parseFloat(vb[3]);
          glyph.width =
            "width" in tag.attributes
              ? parseFloat(tag.attributes.width)
              : width;
          glyph.height =
            "height" in tag.attributes
              ? parseFloat(tag.attributes.height)
              : height;

          // transformStack[transformStack.length - 1]
          //   .translate(-dx, -dy)
          //   .scale(glyph.width / width, glyph.height / height);
        } else {
          glyph.width = parseFloat(tag.attributes.width);
          glyph.height = parseFloat(tag.attributes.height);
        }
      }
      if (tag.name === "path" && tag.attributes.d) {
        // glyph.paths.push(applyTransform(tag.attributes.d));
        glyph.d = svgpath(tag.attributes.d)
          .translate(-parseFloat(vb[0]), -parseFloat(vb[1]))
          .scale(
            glyph.width / parseFloat(vb[2]),
            glyph.height / parseFloat(vb[3])
          )
          .rel()
          .round(1)
          .toString();
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
      // glyph.d =  glyphPath.round(1000).encode();
      resolve(glyph);
    });

    fs.createReadStream("./svg/all.svg").pipe(saxStream);
  });
}

generate().then(data => {
  console.log(data);
});
