
import { htmljavascriptlog, output } from './parts.js'
const doc = String.raw`<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
`.replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`);


const cssBase = `<style id="css-base">*, *::before, *::after {box-sizing:border-box;margin:0; background-color:rgb(30, 30, 30);color:rgb(99, 255, 213);} html, body { height:100%; background-color:rgba(45, 65, 65,1); } button{cursor:pointer;}</style>`

export const normalizeTag = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" referrerpolicy="no-referrer" />`.replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)

const vueTag = `<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>`
const jqueryTag = `<script src="https://code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=" crossorigin="anonymous"></script>`
const petiteVueTag = `<script src="https://unpkg.com/petite-vue" defer init></script>`

function getTemplate(templ) {
	return `<!DOCTYPE html>
    <html lang="en">
        ${getHead()}
        ${getBody(templ)}
    </html>`
}
function getHead(extra = '') {
	return `<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${normalizeTag}
        <!-- ${jqueryTag} -->
        <!-- ${vueTag} -->
        <!-- ${petiteVueTag} -->
        ${cssBase}
        ${extra}`
}
function getBody(templ) {
	return ``
	//return templs[temple]
}

export const template1 = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
	${getHead()}
	<style id="css"></style>
</head>
<body>
	<div id="html" style="display:contents;"></div>
	<script id="js"></script>
</body>
</html>`.replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)

export const template2 = `<!DOCTYPE html>
<html lang="en">
	<head>
		${getHead()}
		<style id="css">
			button{
				background-color:rgba(65,45,45,0.8);
				color: white;
			}
		</style>
	</head>
	<body>
		<div id="html" style="display:contents;">
			<div>
				<p>template 111--1</p>
				<button onclick="btn1()">btn1</button>
				<button onclick="btn2()">btn2</button>
			</div>
		</div>
		<script id="js">
			function btn1(){
				console.log('btn1', )
			}
			function btn2(){
				console.log('btn2', )
			}
			console.log('hello')
		</script>
	</body>
</html>`.replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)


export const with_output = `<!DOCTYPE html>
<html>
<head>
    ${getHead()}
    <style id="css">
        [contenteditable]{
            background-color: gray; border-radius: 5px; padding: 0 2px;
        }
        body{
            display:flex;
            flex-direction: column;
            height: 100%;
        }
        #main, #html{
            display: contents;
        }
    </style>
</head>
<body id="body">
    ${htmljavascriptlog}
</body>
${output}

</html>`.replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)

