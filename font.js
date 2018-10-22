const fs = require("fs");
const { Transform } = require("stream");

// let font = Buffer.alloc(0);
let g = fs.createReadStream("./svg/all.svg");

console.log(g);

g.on("open", fd => {
  console.log("open:", fd);
})
  .on("data", data => {
    console.log("data:", data.toString());
  })
  .on("end", () => {
    console.log("end");
  })
  .on("close", () => {
    console.log("close");
  });

// stream
//   .on("data", data => {
//     console.log("stream data", data);
//   })
//   .on("finish", () => {
//     console.log("stream finish");
//   });

// stream.write(g);
// stream.end();
