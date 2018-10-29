const fs = require("fs");
const Sax = require("sax");
const svgpath = require("svgpath");

const svgTemplate = d => `
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    t="1540626565584" 
    class="icon" 
    style="" 
    viewBox="0 0 1024 1024" 
    version="1.1" 
    p-id="2732" 
    width="1024" 
    height="1024">
  <defs><style type="text/css"/></defs>
  <path d="${d}"/>
</svg>
`;

function standard(buffer) {
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
    /**
     * 合并路径
     * 转换成标准d
     */
    d = svgpath(paths.join(" "))
      .translate(-x, -y)
      .scale(1024 / w, 1024 / h)
      .rel()
      .round(1)
      .toString();
  });

  sax.write(buffer);
  sax.end();

  return d;
}

let st = fs.createReadStream("./svg/all.svg");
st.on("data", data => {
  let d = standard(data);
  fs.writeFileSync("test/standard_all.svg", svgTemplate(d));
  console.log(svgTemplate(d));
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
