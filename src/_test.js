/**
 * svg
 * | id | name | d |
 *
 *
 */

/**
 * 数据存储
 * font:
 * | id | fontName | prefix | icons |
 * id
 * fontName  字体名称，用于font-family
 * prefix    前缀，用于class
 * icons     字体内容[1，2，3，4，5，6，7，8，9，0，12];
 * 
 * icon：
 * | id | name | code | d |
 * code:  十进制模式
 * d： 标准模式，参考standard
 */

const fs = require("fs");

const Font = require('./Font');


let font = new Font();
font.from("../svg");
fs.writeFileSync("../fonts/font.css", font.css);
fs.writeFileSync("../fonts/font.html", font.html);

// const buffer = fs.readFileSync("../svg/all.svg");
// console.log(Font.normalize(buffer));

console.log("generate ok");
