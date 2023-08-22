/* 
https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
https://developer.mozilla.org/en-US/docs/Web/API/FileReader
*/
//import { Worker } from 'worker_threads';
//import fontsjson from './../../assets/fonts.json';
import pizzapng from '@assets/pizza/icon64.png'
import { fontsjson, charSets } from '@assets/imagetotext_charsets.js'

var colors = []
var charColors = {}

var currentStyle; //= getComputedStyle(document.body);

var outputButtons = {
    textcanvas: true,
    textcanvas2: false,
    text: false,
    textarea: false,
    canvas: false,
};

var state = {
    //outputElements: {'output-span':true, 'output-textarea': false, 'canvas': false},
    charset: 0,
    style: null,
    outputAs: 'textcanvas',
    convertOnChange: true,
    openedimage: false,
    colorMode: 'normal',
    outputFiletype: 'png',
    fontSize: 10,
    fontFamily: 'monospace',
};
//import Menu from './../../components/menu.js';
//import pizza1 from './../../assets/pizza/icon32.png';
//import charatersets from './charactersets.json'
/* 
var btn2 = document.createElement('button');
btn2.textContent = 'btn2';
btn2.addEventListener('click', (e) => {})
*/
//const parentElement = document.querySelector("#output-container");
//let allChildren = parentElement.querySelectorAll(":scope > *");
//console.log('parentElement', parentElement)
//console.log('allChildren', allChildren)
const menuContainer = document.getElementById('menu-container');
const outputContainer = document.getElementById('output-container');
const btnConvert = document.getElementById('btn-convert')


//const checkboxConvertOnChange = 
const checkboxConvertOnChange = document.getElementById('checkbox-convert-on-change')
const colorMode = document.getElementById('color-mode')
//const checkboxGray = document.getElementById('checkbox-gray')
//const checkboxRandomColors = document.getElementById('checkbox-random-colors')
const btnNewColors = document.getElementById('btn-new-colors')
//btn-gray
//btn-random-colors
//btn-new-colors

const selCharacterset = document.getElementById('sel-characterset');
const selFontfamily = document.getElementById('sel-fontfamily');
const inputFontSize = document.getElementById('input-fontsize');
const inputFile = document.getElementById('input-file');

const outputToggleButtons = document.getElementById('output-toggle-buttons');


const selectOutputFiletype = document.getElementById('output-filetype')
//const radioPng = document.getElementById('radio-png')
//const radioTxt = document.getElementById('radio-txt')
const inputFilename = document.getElementById('input-filename')

const outputText = document.getElementById('output-text');
const outputTextarea = document.getElementById('output-textarea');

// import { Worker } from 'worker_threads';
//const textCanvas = document.getElementById('output-textcanvas');
//const textCtx = textCanvas.getContext('2d');
const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');

//var cWorker = document.getElementById("output-textcanvas").transferControlToOffscreen();



/* const hiddenCanvas = document.createElement('canvas')
hiddenCanvas.style.display = 'none'
document.body.appendChild(hiddenCanvas)
var cWorker = hiddenCanvas.transferControlToOffscreen(); */


const textCanvas2 = document.getElementById('output-textcanvas2');
const textCtx2 = textCanvas2.getContext('2d');

const textCanvas = document.getElementById('output-textcanvas');
//const textCtx = textCanvas.getContext('2d');
//textCtx.drawImage(hiddenCanvas, 0, 0, textCtx.width, textCtx.height);

var cWorker = textCanvas.transferControlToOffscreen();
//var cWorker = document.getElementById("output-textcanvas").transferControlToOffscreen();

//var worker = new Worker("./offscreencanvas.js");
//var worker = new Worker(new URL('./offscreencanvas.js', import.meta.url));

//import MyWorker from './worker.js';
//import MyWorker from './myworker.worker.js';
//const worker = new MyWorker();
//const worker = new Worker('./myworker.worker.js');
//const worker = new Worker(new URL('./myworker.worker.js', import.meta.url));
const worker = new Worker(new URL('./worker.js', import.meta.url));
worker.postMessage({ canvas: cWorker }, [cWorker]);
worker.postMessage('aaaaaaa');
worker.onmessage = (e) => {

    console.log("--Message received from worker", e.data, e);
    if (e.data == 'loading') {
        document.body.style.cursor = 'wait'
    } else if (e.data == 'finishedloading') {
        document.body.style.cursor = 'auto'
        let rect = document.getElementById('output-container').getBoundingClientRect()
        //rect = {width: window.innerWidth, height: window.innerHeight}
        //textCtx2.drawImage(textCanvas, 0, 0, rect.width, rect.height);
        console.log('1finishedloading', { rect, textCtx2, textCanvas, textCanvas2 })

        const scale = Math.min(rect.width / textCanvas.width, rect.height / textCanvas.height);

        // Calculate the scaled dimensions
        var scaledWidth = textCanvas.width * scale;
        var scaledHeight = textCanvas.height * scale;
        scaledWidth = Math.floor(scaledWidth)
        scaledHeight = Math.floor(scaledHeight)
        //textCanvas2.width = scaledWidth
        //textCanvas2.height = scaledHeight
        // Draw the image on the canvas with the scaled dimensions
        //textCtx2.scale(scale, scale)
        textCtx2.drawImage(textCanvas, 0, 0, scaledWidth, scaledHeight);
        //textCtx2.scale(scale, scale)

        console.log('1finishedloading', { rect, textCtx2, textCanvas, textCanvas2, scale })

    } else if (e.data.href) {
        console.log('SAVE FROM WORKER', e.data.href)
        var link = document.createElement("a");
        link.setAttribute('download', `${filename}.png`);
        link.setAttribute('href', e.data.href);
        link.click();
        /* var link = document.createElement("a");
        if(radioPng.checked) link.setAttribute('download', `${filename}.png`);
        else if(radioTxt.checked) link.setAttribute('download', `${filename}.txt`);

        if(state.outputAs == 'textcanvas') {
            worker.postMessage({ action:'saveCanvas', filename:`${filename}.png`});
            return
        }
        //link.setAttribute('href', textCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        else if(state.outputAs == 'canvas') link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        else if(state.outputAs == 'text') link.setAttribute('href', URL.createObjectURL(new Blob([outputText.innerText], { type: "text/plain" })));
        else if(state.outputAs == 'textarea') link.setAttribute('href', URL.createObjectURL(new Blob([outputTextarea.value], { type: "text/plain" })));
        
        
        //document.body.appendChild(link);
        link.click(); */
    }
};

/* worker.addEventListener('message', (e) => {
    const result = e.data;
    console.log('**Received result from worker:', e.data, result);
  
    // Handle the received result from the worker
    // ...
}); */

//worker.postMessage('hello');
//var worker = new MyWorker(new URL('./worker.js', import.meta.url));
//worker.postMessage({ canvas: cWorker }, [cWorker]);

//const offscreen = new OffscreenCanvas(256, 256);
//const offscreenCtx = offscreen.getContext("2d");
//const gl = offscreen.getContext("webgl");



const addOption = (text, parent = selFontfamily, val) => {
    if (!val) val = text
    let elContainer = document.createElement('div');
    elContainer.title = text
    elContainer.style.width = '10ch';
    elContainer.style.maxWidth = '10ch';
    if (Array.isArray(text)) text = text.join('')
    if (text.length < 30) elContainer.innerText = text;
    else {
        elContainer.innerText = text.substring(0, 30) + '...';
    }
    let el = document.createElement('option');
    el.title = text
    el.value = val;
    el.appendChild(elContainer);
    parent.appendChild(el);
};

const resizeObserver = new ResizeObserver((entries) => {
    setCanvasWidth(canvas)
    setCanvasWidth(textCanvas)
    //wall.w = window.innerWidth;
    //wall.h = window.innerHeight;
    /* let menuContainer = document.getElementById('menu-container')
    let menuRect = menuContainer.getBoundingClientRect()
    if(canvas){
        canvas.width = window.innerWidth - menuRect.width
        canvas.height = window.innerHeight - menuRect.height
    } */
});
function setCanvasWidth(canvas) {
    return
    const dpr = window.devicePixelRatio
    let menuContainer = document.getElementById('menu-container')
    let menuRect = menuContainer.getBoundingClientRect()
    if (canvas) {
        canvas.width = (window.innerWidth - menuRect.width) * dpr
        canvas.height = (window.innerHeight - menuRect.height) * dpr
        //ctx.scale(dpr, dpr);
        //canvas.width = window.innerWidth - menuRect.width
        //canvas.height = window.innerHeight - menuRect.height
    }
}


export function main() {
    currentStyle = getComputedStyle(document.body);
    initHtmlElements();
    setCanvasWidth(canvas)
    setCanvasWidth(textCanvas)
    resizeObserver.observe(document.body);

    toText('init')
    //textCtx.imageSmoothingEnabled = false;

    //console.log(getTextWidth("hello there!", "bold 12pt arial"));
    //console.log('font', font);
    //console.log(getTextWidth("hello there!", getFontStr()));
}
function getFontStr() {
    currentStyle = getComputedStyle(document.body);
    //var currentStyle = getComputedStyle(document.body);
    let font = `${currentStyle.fontWeight} ${currentStyle.fontSize} ${currentStyle.fontFamily}`;
    return font;
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    //const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    //const context = textCtx.getContext("2d");
    textCtx.font = font;
    const metrics = textCtx.measureText(text);
    return metrics.width;
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function initHtmlElements() {
    inputFile.addEventListener('change', readfile);
    inputFontSize.addEventListener('change', (e) => {
        state.fontSize = parseInt(e.target.value) //+'px'
        outputContainer.style.fontSize = e.target.value + 'px'
        toText('fontSize')
    });
    inputFontSize.value = state.fontSize
    outputToggleButtons.addEventListener('click', toggleOutput);
    btnConvert.addEventListener('click', () => toText('button'))
    checkboxConvertOnChange.addEventListener('change', (e) => state.convertOnChange = e.target.checked)
    if (state.convertOnChange) checkboxConvertOnChange.checked = true
    btnNewColors.addEventListener('click', () => {
        charColors = {}
        toText('btnNewColors')
    })
    //checkboxGray.addEventListener('change',(e)=>state.gray = e.target.checked)
    //if(state.gray) checkboxGray.checked = true
    //checkboxRandomColors.addEventListener('change',(e)=>state.randomcolors = e.target.checked)
    //if(state.randomcolors) checkboxRandomColors.checked = true

    colorMode.addEventListener('change', (e) => {
        state.colorMode = e.target.value
        charColors = {}
        toText('colorMode')
    })
    colorMode.value = state.colorMode

    populateFontList();
    populateCharactersetList();

    var currentStyle = getComputedStyle(document.body);
    console.log('currentStyle.fontSize', currentStyle.fontSize);
    console.log('currentStyle.fontFamily', currentStyle.fontFamily);
    //inputFontSize.value = parseInt(currentStyle.fontSize);

}
/* function selectCharset(){

} */
function toggleOutput(e) {
    let id = e.target.id;
    if (id == 'output-toggle-buttons') return;
    console.log('toggleOutput', id);
    for (const [key, value] of Object.entries(outputButtons)) {
        let el = document.getElementById('output-' + key);
        let btn = document.getElementById('btn-' + key);
        console.log('toggleOutput', key, id);
        if (id == 'btn-' + key) {
            //outputButtons[]
            //el.style.visibility = 'visible'
            state.outputAs = key
            outputButtons[key] = true
            el.style.display = 'block';
            btn.style.backgroundColor = 'green';
        } else {
            //el.style.visibility = 'hidden'
            outputButtons[key] = false
            el.style.display = 'none';
            btn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
    }
}


function readfile(e) {
    const reader = new FileReader();
    // Uncaught NS_ERROR_FAILURE
    reader.onload = (e) => {
        console.log('readfile1.onload1', e)
        const image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            state.openedimage = true
            toText('imageloaded');
        };
        console.log('readfile1.onload2', e.target.result)
        image.src = e.target.result;
    };
    state.orgfilename = e.target.files[0].name

    console.log('readfile1', inputFile.files[0])
    console.log('readfile2', e.target.files)
    console.log('readfile3', inputFile.files)
    reader.readAsDataURL(inputFile.files[0]);
}
function loadFont(url = 'fonts/SegaArcadeFont-Regular.ttf', name) {
    console.log('fonts2.test1.1', name, url);
    var newStyle = document.createElement('style');
    newStyle.appendChild(
        document.createTextNode(
            `@font-face {
                font-family: '${name}';
                src: url('${url}');
            }`
        )
    );
    document.head.appendChild(newStyle);
}

function populateFontList() {
    addOption('monospace', selFontfamily);
    addOption('secrcode', selFontfamily);
    addOption('monofonto', selFontfamily);
    addOption('ConsolaMono-Book', selFontfamily);
    addOption('ConsolaMono-Bold', selFontfamily);

    let currentSTyle = getComputedStyle(document.body)

    let defaultFonts = { Helvetica: null, Arial: null, Tahoma: null, 'Times New Roman': null }; //fontsjson = [...defaultFonts, ...fontsjson]
    for (const [key, value] of Object.entries({ ...{ [currentSTyle.fontFamily]: null }, ...defaultFonts, ...fontsjson })) {
        addOption(key, selFontfamily,);
    }
    selFontfamily.addEventListener('change', (e) => {
        let fontname = e.target.value; //fontsjson[e.target.value].name

        if (fontsjson[e.target.value] != null) {
            console.log('selFontfamily', fontname)
            let url = './../../assets' + fontsjson[e.target.value].url;
            loadFont(url, fontname)
            /* const font = new FontFace(fontname, `url('${url}')`);
            document.fonts.add(font);
            console.log('selFontfamily', fontname, url, font, document.fonts) */
        }
        console.log('selFontfamily', fontname, fontsjson[e.target.value])
        state.fontFamily = fontname
        outputContainer.style.fontFamily = fontname
        outputText.style.fontFamily = fontname
        outputTextarea.style.fontFamily = fontname
        //document.body.style.fontFamily = fontname
        /* var newStyle = document.createElement('style');
        newStyle.appendChild(
            document.createTextNode(
                `* {
                    font-family: '${fontname}';
                }`
            )
        );
        document.head.appendChild(newStyle); */


        /* let val = e.target.value;
        console.log('selFontfamily.change', val)
        outputContainer.style.fontFamily = val */
        toText('fontchange');

    });
    selFontfamily.value = state.fontFamily //currentStyle.fontFamily;
}
function populateCharactersetList() {
    for (let i = 0; i < charSets.length; i++) {
        addOption(charSets[i], selCharacterset, i);
    }
    selCharacterset.addEventListener('change', (e) => {
        let val = parseInt(e.target.value)
        state.charset = (val) ? val : 0;
        console.log('state.charset', state.charset)
        toText('charsetchanged');
    });
    //selCharacterset.value = state.charset //currentStyle.fontFamily;
}


var fileHandle;
document.getElementById('save-image').addEventListener('click', saveImage)
function saveImage(e) {
    console.log('saveImage', e)

    saveCanvas()
}

function saveCanvas() {
    var filename = inputFilename.value
    if (filename == '') filename = state.outputAs

    let filetype = selectOutputFiletype.value

    var link = document.createElement("a");
    if (filetype == 'png') link.setAttribute('download', `${filename}.png`);
    else if (filetype == 'txt') link.setAttribute('download', `${filename}.txt`);

    if (state.outputAs == 'textcanvas') {
        //link.setAttribute('href', cWorker.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        let todataurl = textCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        console.log('todataurl', todataurl)
        link.setAttribute('href', todataurl);
        //link.setAttribute('href', document.getElementById("output-textcanvas").toDataURL("image/png").replace("image/png", "image/octet-stream"));
        //worker.postMessage({ action:'saveCanvas', filename:`${filename}.png`});
        //return
    }
    //link.setAttribute('href', textCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    else if (state.outputAs == 'canvas') link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    else if (state.outputAs == 'text') link.setAttribute('href', URL.createObjectURL(new Blob([outputText.innerText], { type: "text/plain" })));
    else if (state.outputAs == 'textarea') link.setAttribute('href', URL.createObjectURL(new Blob([outputTextarea.value], { type: "text/plain" })));

    console.log('link', link)
    //document.body.appendChild(link);
    link.click();
}

/* function saveCanvas(){
    var filename = inputFilename.value
    if(filename == '') filename = state.outputAs

    var link = document.createElement("a");
    if(state.outputAs == 'textcanvas') link.setAttribute('href', textCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    else if(state.outputAs == 'canvas') link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    else if(state.outputAs == 'text') link.setAttribute('href', URL.createObjectURL(new Blob([outputText.innerText], { type: "text/plain" })));
    else if(state.outputAs == 'textarea') link.setAttribute('href', URL.createObjectURL(new Blob([outputTextarea.value], { type: "text/plain" })));
    
    if(radioPng.checked) link.setAttribute('download', `${filename}.png`);
    else if(radioTxt.checked) link.setAttribute('download', `${filename}.txt`);
    //document.body.appendChild(link);
    link.click();
} */

function scaleImage(image, scaleFactor) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate the scaled dimensions
    const scaledWidth = image.width * scaleFactor;
    const scaledHeight = image.height * scaleFactor;

    // Set the canvas dimensions to the scaled size
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Draw the scaled image onto the canvas
    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

    // Create a new Image object and return it
    const scaledImage = new Image();
    scaledImage.src = canvas.toDataURL();
    return scaledImage;
}

function drawRandomBox() {
    //let w = canvas.width
    //let h = canvas.height

    /* ctx.beginPath(); */
    ctx.fillStyle = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);

    let x = Math.floor(Math.random() * canvas.width)
    let w = Math.floor(Math.random() * (canvas.width - x))
    let y = Math.floor(Math.random() * canvas.height)
    let h = Math.floor(Math.random() * (canvas.height - y))
    /* ctx.fill(); */
    ctx.rect(x, y, w, h);
    /* ctx.stroke(); */
}

function drawBox() {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            ctx.fillStyle = `rgb(
              ${Math.floor(255 - 42.5 * i)},
              ${Math.floor(255 - 42.5 * j)},
              0)`;
            ctx.fillRect(j * 25, i * 25, 25, 25);
        }
    }
}
function drawSomething() {
    ctx.beginPath();
    //ctx.rect(25, 50, 100, 70);
    //ctx.rect(100, 0, 10, 10);
    //ctx.rect(Math.floor(Math.random()*100), 50, 100, 70);
    for (let i = 0; i < 10; i++) {
        //drawRandomBox()

    }
    ctx.fillStyle = '#00FF00';
    drawBox()
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function randomColor(brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

function loadDefaultImage() {
    let image = new Image()
    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        state.openedimage = true
        toText('defaultimage');
    };
    image.src = pizzapng
}
function toText(from) {
    console.log('toText1', state.convertOnChange, from)
    if ((from != 'button' && !state.convertOnChange)) {  // || !inputFile.files?.[0]
        if (![...btnConvert.classList].includes('btnConvert.classList')) btnConvert.classList.add('btn-active')
        return
    }
    btnConvert.classList.remove('btn-active')

    console.log('toText2', !inputFile.files?.[0])
    if (!state.openedimage && inputFile.files?.[0]) {
        // e.target.files[0]
        readfile({ target: { files: inputFile.files } })
        return
    }
    if (from != 'defaultimage' && !inputFile.files?.[0]) {  // !canvas.width || 
        return loadDefaultImage()
        //drawBox()
        //drawSomething()   readfile

        /* canvas.width = 300//image.width;
        canvas.height = 300//image.height;
        ctx.drawImage(image, 0, 0);  */
    }
    console.log('toText2', inputFile.files?.[0])

    //if(state.convertOnChange) toText();
    //else btnConvert.style.backgroundColor = 'green'
    console.log('toText1', canvas.width, canvas.height, canvas)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // , {colorSpace: 'srgb'} , {colorSpace: 'display-p3'}
    console.log('toText2', imageData)
    const pixels = imageData.data;
    console.log('toText3', pixels)
    //var ASCII_CHARS = charSets[state.charset != undefined ? state.charset : 0];
    var ASCII_CHARS = charSets[state.charset];
    if (document.getElementById('input-characterset').value != '') ASCII_CHARS = document.getElementById('input-characterset').value;
    if (typeof ASCII_CHARS == 'string') ASCII_CHARS = ASCII_CHARS.split('')
    if (document.getElementById('checkbox-reverse').checked) ASCII_CHARS = ASCII_CHARS.reverse()
    console.log('toText4', ASCII_CHARS)
    //const ASCII_CHARS = charsetSelected

    // ImageData { width: 512, height: 512, data: Uint8ClampedArray(1048576) }
    // ImageData { width: 512, height: 512, data: Uint8ClampedArray(1048576) }
    // ImageData { width: 512, height: 512, data: Uint8ClampedArray(1048576) }
    //console.log('imageData', imageData);
    //console.log('pixels', pixels);
    let arr = []
    let ascii = '';
    let y = 0
    let counter = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        var colormix = (r + g + b) / 3;

        //gray = Math.round(gray / 255)
        colormix = colormix / 255;
        colormix = colormix * (ASCII_CHARS.length - 1);
        colormix = Math.round(colormix);
        //if((gray<0 || gray>ASCII_CHARS.length) && i<200) console.log('!!!', i, gray)
        //if(ASCII_CHARS[gray] == undefined) console.log('1!!!', i, gray, ASCII_CHARS[gray])
        //if(ASCII_CHARS[gray] == ',') console.log('2!!!', i, gray, ASCII_CHARS[gray])
        //if(ASCII_CHARS[gray].length <= 0) console.log('3!!!', i, gray, ASCII_CHARS[gray])
        const char = ASCII_CHARS[colormix];
        if (!arr[y]) arr.push([])//arr[y] =[]
        arr[y].push(char)
        if (!charColors[char]) {
            if (state.colorMode == 'normal') charColors[char] = `rgba(${r}, ${g}, ${b}, ${a})`
            else if (state.colorMode == 'random') charColors[char] = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
            else if (state.colorMode == 'gray') charColors[char] = `rgb(${100}, ${100}, ${100})`
            //charColors[char] = `rgb(${r}, ${g}, ${b})`
            //charColors[char] = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
            //charColors[char] = randomColor(Math.round(Math.random()*250))

        }
        //const char = ASCII_CHARS[Math.round((gray / 255) * (ASCII_CHARS.length - 1))];
        ascii += char;
        //ascii += char;
        //ascii += gray;
        counter += 1;
        if (counter === canvas.width) {
            ascii += '\n';
            counter = 0;
            y++
        }
    }
    //console.log(ascii);
    //output.value = ascii;
    outputText.innerText = ascii;
    outputTextarea.value = ascii;
    /* let width = getTextWidth(ascii, getFontStr())
    
    console.log('width', {
        ww: window.innerWidth
        , wh: window.innerHeight
        ,width
    }) */
    let computedstyle = getComputedStyle(document.body);
    /* console.log({
        computedstyle,
        lineHeight: computedstyle.lineHeight,
        width: computedstyle.width,
        height: computedstyle.height,
        fontFamily: computedstyle.fontFamily,
        fontSize: computedstyle.fontSize,
        'textCtx.font':textCtx.font
    }); */

    /* 
    const ascii = asciiOutput.value;
    const lines = ascii.split('\n');
    asciiCanvas.width = lines[0].length * ASCII_SIZE;
    asciiCanvas.height = lines.length * ASCII_SIZE;
    asciiCtx.font = `${ASCII_SIZE}px monospace`;
    for (let y = 0; y < lines.length; y += 1) {
        for (let x = 0; x < lines[y].length; x += 1) {
            const char = lines[y][x];
            asciiCtx.fillStyle = ASCII_COLORS[char] || 'black';
            asciiCtx.fillText(char, x * ASCII_SIZE, (y + 1) * ASCII_SIZE);
        }
    }
    */

    //var cWorker = document.getElementById("output-textcanvas").transferControlToOffscreen();
    //var worker = new Worker("offscreencanvas.js");
    //worker.postMessage({ canvas: cWorker }, [cWorker]);

    //worker.postMessage({ charArr: arr, charColors:charColors }, [arr, charColors]);
    worker.postMessage({ charArr: arr, charColors: charColors, fontFamily: state.fontFamily, fontSize: state.fontSize, width: canvas.width, height: canvas.height });


    /* 
       //console.log('arr', arr)
        //console.log('charColors1', charColors)
        const charSize = 8//ASCII_CHARS.length;
        //const lines = ascii.split('\n');
        //textCanvas.width = lines[0].length * charSize;
        //textCanvas.height = lines.length * charSize;
        console.log('*1', arr[0].length, arr.length)
        console.log('*2', arr[0].length * charSize, arr.length * charSize)
        let width = arr[0].length * charSize
        let height = arr.length * charSize
        if(width > 8192 || height > 8192) {
    
        }
    
        
        textCanvas.width = arr[0].length * charSize;
        textCanvas.height = arr.length * charSize; 
        //offscreen.width = arr[0].length * charSize;
        //offscreen.height = arr.length * charSize;
        console.log('*3', textCanvas)
        
        //*1 3024     4032 
        //*2 24192    32256 
        //*3 <canvas id="output-textcanvas" style="display: block;" width="24192" height="32256">
        
        //textCanvas.width = window.innerWidth;
        //textCanvas.height = window.innerHeight;
        
        textCtx.font = `${charSize}px ${outputContainer.style.fontFamily}`;
        //offscreenCtx = `${charSize}px ${outputContainer.style.fontFamily}`;
    
        for (let y = 0; y < arr.length; y += 1) {
            for (let x = 0; x < arr[y].length; x += 1) {
                var char = arr[y][x];
                //console.log('charColors[char]', char, charColors[char])
                textCtx.fillStyle = charColors[char] || 'red';
                //textCtx.fillStyle = ASCII_COLORS[char] || 'red';
                let posX = x * charSize
                let posY = (y + 1) * charSize
                // textCtx.fillText(char, posX, posY);
                
                //console.log(char, )
                textCtx.fillText(char, posX, posY);
            }
        } */
    return
    //textCtx.font = `${charSize}px monospace`;
    for (let y = 0; y < lines.length; y += 1) {
        for (let x = 0; x < lines[y].length; x += 1) {
            var char = lines[y][x];
            //console.log('charColors[char]', char, charColors[char])
            textCtx.fillStyle = charColors[char] || 'red';
            //textCtx.fillStyle = ASCII_COLORS[char] || 'red';
            let posX = x * charSize
            let posY = (y + 1) * charSize
            // textCtx.fillText(char, posX, posY);
            let arr = []
            for (let i = 0; i < char.length; i++) {
                arr.push(parseInt(char[0].codePointAt(0), 16))
                //arr.push(char[0].codePointAt(0))
            }
            //char = char.codePointAt(0)
            // String.fromCharCode(parseInt(h, 16));
            //textCtx.fillText(String.fromCharCode(parseInt(char,16)), posX, posY);
            //textCtx.fillText(String.fromCharCode(...arr), posX, posY);
            //console.log('!!', String.fromCodePoint(parseInt('😁'.codePointAt(0))))
            //char = ASCII_CHARS[]
            //char = String.fromCodePoint(parseInt(char.codePointAt(0)))
            //char = String.fromCharCode(char.codePointAt(0))
            console.log(char,)
            textCtx.fillText(char, posX, posY);
        }
    }
    /* let charstrtest = '☃★♲abc'
    for (let i = 0; i < charstrtest.length; i++) {
        let codep = charstrtest.codePointAt(i)
        console.log(i, charstrtest[i], codep)
    } */
    console.log('ascii', ascii)
    console.log('lines', lines)
    //console.log('charColors2', charColors)
    /* textCanvas.width = window.innerWidth;
    textCanvas.height = window.innerHeight;
    //textCanvas.width = window.innerWidth;
    //textCanvas.height = window.innerHeight;
    let asciisplitted = ascii.split('\n');
    for (let i = 0; i < asciisplitted.length; i++) {
        textCtx.textBaseline = 'top';
        textCtx.textAlign = 'left';
        textCtx.fillStyle = '#435a6b';
        //textCtx.font = "50px serif";
        //textCtx.font = '16px monospace';
        textCtx.fillText(asciisplitted[i], 0, i*16);
    } */
    // "textCtx.font": "10px sans-serif"
    //const ctx = document.getElementById("canvas").getContext("2d");
    //textCtx.font = getFontStr() //"48px serif";

    /* textCtx.beginPath();
    textCtx.lineWidth = "6";
    textCtx.strokeStyle = "red";
    textCtx.rect(20, 20, 150, 100);
    textCtx.stroke();  */

    //textCtx.fillText("Hello World", 0, 200);
}
