const Sax = require("sax");
const svgpath = require("svgpath");

const STANDARD_WIDTH = 1024;
const STANDARD_HEIGHT = 1024;
const STANDARD_ROUND = 1;
/**
 *
 * @param {*} buffer
 */
module.exports = function standard(buffer) {
  const sax = Sax.createStream(true);
  let x, y, w, h;
  let paths = [];
  let d;

  sax.on("opentag", tag => {
    if (tag.name === "svg") {
      let vb =
        "viewBox" in tag.attributes
          ? tag.attributes.viewBox
              .split(/\s*,*\s|\s,*\s*|,/)
              .map(value => parseFloat(value))
          : [0, 0, 0, 0];
      x = vb[0];
      y = vb[1];
      w = "width" in tag.attributes ? parseFloat(tag.attributes.width) : vb[2];
      h =
        "height" in tag.attributes ? parseFloat(tag.attributes.height) : vb[3];
    } else if (tag.name === "path" && tag.attributes.d) {
      paths.push(tag.attributes.d);
    }
  });

  sax.on("end", () => {
    d = svgpath(paths.join(" "))
      .translate(-x, -y)
      .scale(STANDARD_WIDTH / w, STANDARD_HEIGHT / h)
      .rel()
      .round(STANDARD_ROUND)
      .toString();
  });

  sax.write(buffer);
  sax.end();

  return d;
}
