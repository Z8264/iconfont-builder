
var fs = require('fs');
var fontCarrier = require('font-carrier')
//创建空白字体，使用svg生成字体
var font = fontCarrier.create()
var set = fs.readFileSync('./svg/set.svg').toString()
var all = fs.readFileSync('./svg/all.svg').toString()

//使用汉字
// font.setGlyph('爱',{
//   svg:love,
//   glyphName:'爱'
// })

//使用unicode
font.setSvg('&#xe000;',all)
font.setSvg('&#xe001;',set)

font.output({
  path:'./test'
})