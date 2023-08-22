/* 
const htmlCanvas = document.getElementById("canvas");
const offscreen = htmlCanvas.transferControlToOffscreen();

const worker = new Worker("offscreencanvas.js");
worker.postMessage({ canvas: offscreen }, [offscreen]);
*/

var canvas = null;
var ctx = null;
var dataUrl;
onmessage = (evt) => {
	console.log('WORKER evt.data', evt.data);
	console.log('WORKER evt', evt);
	if (evt.data.canvas) {
		canvas = evt.data.canvas;
		ctx = canvas.getContext('2d');
	}
	if (evt.data.charArr) {
		self.postMessage('loading');
		worke(evt.data);
		/* worke({
			charArr: evt.data.charArr,
			charColors: evt.data.charColors,
		}); */
		self.postMessage('finishedloading');
	}
	if (evt.data.action == 'saveCanvas') {
		console.log('action=saveCanvas', evt.data.action);
		console.log('canvas', canvas);
		//self.postMessage({href: canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")});
	}
	//saveCanvas(evt.data.filename)
	//var arr = evt.data.charArr;
};

function saveCanvas(filename) {
	//action:'saveCanvas', link
	/* var link = self.createElement("a");
    link.setAttribute('download', `${filename}.png`);
	link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
	link.click(); */
}
function downscale(width, height, max) {
	if (width <= max && height <= max) return {width, height};
	const widthRatio = max / width;
	const heightRatio = max / height;
	const ratio = Math.min(widthRatio, heightRatio);
	width = width * ratio;
	height = height * ratio;
	return {width, height};
}

/* 
const getSize = () => {
		let width = charArr[0].length * charSize;
		let height = charArr.length * charSize;

		if (width <= max && height <= max) {
			return {width, height};
		}
	
		const widthRatio = max / width;
		const heightRatio = max / height;
		const ratio = Math.min(widthRatio, heightRatio);
		charSize = Math.round(charSize * ratio)
		width = width * ratio;
		height = height * ratio;
		console.log('RATIO', ratio)
		return {width, height};

		return {width, height};
	};
	let {width, height} = getSize();

*/
function worke({charArr, charColors, fontFamily, fontSize = 10, width, height}) {
	var charSize = fontSize;
	console.log('*1', charArr[0].length, charArr.length, {fontFamily, fontSize});
	console.log('*2', charArr[0].length * charSize, charArr.length * charSize);
	//let width = charArr[0].length * charSize;
	//let height = charArr.length * charSize;
	let max = 16384; //8192
	//const getSize = () => {
	//	let width = charArr[0].length * charSize;
	//	let height = charArr.length * charSize;
	width = charArr[0].length * charSize;
	height = charArr.length * charSize;

	if (width <= max && height <= max) {
		//return {width, height};
	} else {
		const widthRatio = max / width;
		const heightRatio = max / height;
		const ratio = Math.min(widthRatio, heightRatio);
		charSize = Math.round(charSize * ratio);
		width = width * ratio;
		height = height * ratio;
		console.log('RATIO', ratio);
	}
	//	return {width, height};

	//	return {width, height};
	//};
	//let {width, height} = getSize();

	/* if (width > 8192 || height > 8192) {
		//ctx.scale(0.5, 0.5);
		width =  width/2
		height =  height/2
	} */
	//ctx.scale(4.5, 0.5);
	/* textCanvas.width = arr[0].length * charSize;
	textCanvas.height = arr.length * charSize; */
	canvas.width = width;
	canvas.height = height;
	console.log('*3', canvas, canvas.width, canvas.height, charSize);
	ctx.font = `${charSize}px ${fontFamily}`;
	//ctx.font = `${charSize}px monospace`;

	for (let y = 0; y < charArr.length; y += 1) {
		for (let x = 0; x < charArr[y].length; x += 1) {
			var char = charArr[y][x];
			//console.log('charColors[char]', char, charColors[char])
			ctx.fillStyle = charColors[char] || 'red';
			//textCtx.fillStyle = ASCII_COLORS[char] || 'red';
			let posX = x * charSize;
			let posY = (y + 1) * charSize;
			// textCtx.fillText(char, posX, posY);

			//console.log(char, )
			ctx.fillText(char, posX, posY);
		}
	}
	console.log('*4', canvas, canvas.width, canvas.height, charSize);

	//self.postMessage({offscreencanvas: canvas});
	//dataUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
	//console.log('*5', dataUrl);
}

/* onmessage = (evt) => {
    const canvas = evt.data.canvas;
    const gl = canvas.getContext("webgl");
  
    function render(time) {
      // Perform some drawing using the gl context
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }; */
