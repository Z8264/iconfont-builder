module.exports = data => `

@font-face{
  font-family:${data.fontName};
  src:url(data:application/font-woff;charset=utf-8;base64,${data.base64}) 
  format("woff");
  font-weight:normal;
  font-style:normal
}

.${data.prefix} {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: '${data.fontName}' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
${data.icons
  .map(
    icon => `
.${data.prefix}-${icon.name}:before {
  content:'\\${icon.code.toString(16)}';
}
`
  )
  .join("")}
`;
