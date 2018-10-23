const fs = require("fs");
const { Transform } = require("stream");
const Sax = require("sax");

// const saxStream = Sax.createStream(true);

// saxStream.on("opentag", tag => {
//   console.log("tag", tag);
// });

// saxStream.on("end", () => {
//   console.log("end");
// });

// fs.createReadStream("./svg/all.svg").pipe(saxStream);

async function generate(src) {

  const saxStream = Sax.createStream(true);

  let glyph=[];

  return new Promise((resolve, reject) => {
    saxStream.on("opentag", tag => {
      console.log("tag", tag);
      glyph.push(tag);
    });

    saxStream.on("end", () => {
      resolve(glyph);
    });

    fs.createReadStream("./svg/all.svg").pipe(saxStream);
  });
}


generate().then(data=>{
    console.log(data);
})