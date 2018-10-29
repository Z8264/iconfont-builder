const fs = require("fs");

/**
 * 获取文件夹下所有svg文件内容
 * @param {*} src
 */
async function fromDir(src) {
  let files = fs.readdirSync(src).filter(file => /\.svg$/i.test(file));
  let icons = files.map((file)=>{
    return {
      name:file.replace(".svg",""),
      buffer:fs.readFileSync(src + "/" + file)
    }
  })
  return icons;
}

console.log(fromDir("../svg"));
/**
 * 获取文件夹下所有svg文件
 * @param {*} src  文件路径
 */
async function getSvgFilesInDir(src) {
  return new Promise((resolve, reject) => {
    fs.readdir(src, (err, files) => {
      if (err) {
        reject(err);
      } else {
        files = files.filter(file => /\.svg$/i.test(file));
        resolve(files);
      }
    });
  });
}
/**
 * 将文件夹下所有svg文件转换为icons集合
 * @param {*} src
 */
async function getIconsInDir(src) {
  const files = await getSvgFilesInDir(src);

  let code = 0xe000;
  let icons = files.map(file => {
    code++;
    return {
      file: src + "/" + file,
      name: file.replace(".svg", ""),
      code: code,
      hex: code.toString(16), // hexcode
      unicode: String.fromCharCode(code), // unicode
      xml: `&#x${code.toString(16)};` // xmlcode
    };
  });
}
