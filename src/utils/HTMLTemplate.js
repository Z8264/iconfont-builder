module.exports = data => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${data.fontName}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    ${data.css}
    </style>
    <style>
    ul{
        width:900px;
        padding: 20px;
        margin: 0 auto;
        list-style: none;
    }
    ul:after{
        content:'';
        display:table;
        clear:both;
    }
    li {
        width:10%;
        padding: 10px 0;
        float:left;
    }
    li i {
        display:block;
        font-size:40px;
        line-height:50px;
        text-align:center;
    }
    li span {
        display:block;
        font-size:14px;
        line-height:24px;
        text-align:center;
    }
    </style>
</head>
<body>

<!-- demo -->
<ul>
    ${data.icons
      .map(
        icon => `
    <li>
        <i class="${data.prefix} ${data.prefix}-${icon.name}"></i>
        <span>${icon.name}</span>
    </li>
    `
      )
      .join("")}
</ul>

<!-- css -->
<pre>
${data.css}
</pre>

</body>
`;
