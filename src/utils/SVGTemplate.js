module.exports = d => `
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    style="" 
    version="1.1" 
    viewBox="0 0 1024 1024"
    width="1024" 
    height="1024">
  <defs><style type="text/css"></style></defs>
  <path d="${d}"/>
</svg>
`;
