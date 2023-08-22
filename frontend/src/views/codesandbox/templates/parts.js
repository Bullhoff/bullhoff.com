



export const htmljavascriptlog = String.raw`<main id="main" >
<div id="html" >
    <div>
        <button onclick="types(this)" style="display:inline-block;">print stuff</button>
        <button onclick="add()" style="display:inline-block;">add row</button>
        <button onclick="console.log('hello')">btn1</button>
        <button onclick="console.log('ye')">btn1</button>
        <button onclick="console.log([1,2,3,4,'a', 'abc', 6, 'a'])">btn2</button>
        <button onclick="console.log({key1:'val1', key2:'val2'})">btn3</button>
        <button onclick="console.log(1,2,3,4,5,6,7,8)">btn4</button>
        <button onclick="console.log(Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), )">btn4</button>
    </div>

    <div id="buttons-div" style="display:inline-grid; grid-template-columns: auto 1fr ; align-items: center;"></div>
    <template id="buttons-template">
        <button onclick="eval(this.nextElementSibling.innerText)" style="display:inline-block; white-space: nowrap;">run</button>
        <p style="white-space: nowrap;">console.log(<span contenteditable="true" spellcheck="false" ></span>)</p> 
    </template>
</div>
<script id="js">
    add('this')
    add('[navigator.languages, navigator.userAgent, navigator.platform, navigator.oscpu, navigator.appCodeName, navigator.permissions, navigator.connection,  navigator.keyboard, navigator.geolocation, window.ProximitySensor, window.AmbientLightSensor, navigator.keyboard?.getLayoutMap(), performance?.getEntries(), ]'  )
    add('navigator.clipboard.writeText("abc")', )
    add('window.navigator.vibrate([200, 1000, 100])')
    add('history.go(-2)')
    add('[screen, screen.colorDepth, screen.mozOrientation, screen.width, screen.height]')
    add('document.body.contentEditable=true')
    add('document.designMode="on"')
    function add(val=''){
        if ("content" in document.createElement("template")) {
            const clone = document.getElementById('buttons-template').content.cloneNode(true);
            clone.querySelector('span').innerText = val
            clone.querySelector('span').addEventListener('keydown',logOnEnter);
            document.getElementById('buttons-div').appendChild(clone);
        }
    }
    //document.querySelectorAll('[contenteditable="true"]').forEach((el)=>el.addEventListener('keydown',logOnEnter))
    function logOnEnter(e){
        if(e.key != 'Enter') return
        e.preventDefault()
        console.log(eval(e.target.innerText))
    }
    function types(el){
        const type = (val,obj={}) => { obj[val] = {'call': Object.prototype.toString.call(val), 'typeof':typeof val}; console.log(obj[val].typeof.padEnd(10,' '), obj[val].call.padEnd(26, ' '), val); return obj[val];  }
        let obj = {}
        type('abc', obj)
        type(123, obj)
        type(null, obj)
        type(undefined, obj)
        type([!null, null==undefined, null===undefined], obj)
        type(obj, obj)
        type([1,2,3], obj)
        type(new Date(), obj)
        type(()=>{}, obj)
        type(function(){}, obj)
        type(location, obj)
        type(navigator, obj)
        type(history, obj)
        type(Clipboard, obj)
        type(el, obj)
        type(document.querySelectorAll('link'), obj)
        type(document.querySelector('[rel="stylesheet"]'), obj)
        type(document.querySelector('div'), obj)
        //type(document.querySelector('body'), obj)
        type(new XMLSerializer().serializeToString(el), obj)
        type(new Proxy({ key1: "val1", key2: "val2", }, {}), obj)
        type(this.XMLHttpRequest, obj)
        type([globalThis, this, window],obj)
        type([Object.prototype.toString.call(globalThis), Object.prototype.toString.call(this), Object.prototype.toString.call(window)],obj)
        console.log(obj)
    }
</script>
</main>`.replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)



export const output = String.raw`<script id="output">
(() => {
    class Output {
        constructor(parent = document.body) {
            this.rowNr = 0
            this.container = document.createElement('div')
            //this.container.style.cssText += \`display: flex; flex-direction: column-reverse;  \`
            this.container.style.cssText += \`flex-grow: 1; box-sizing:border-box; max-width:100%; width: 100%; min-height:1em; \` 
            this.container.style.cssText += \`position:relative; font-family: monospace; resize: both; z-index:100; background-color:rgba(5,5,5,1); color: red; border:1px solid chocolate; border-radius:1ch; padding:1ch; overflow:auto; \` 
            this.rowStyle = \`width: 100%; resize: both; display:flex; flex-direction:row; align-items:center; background-color:inherit; border:gray; border:1px dotted gray; \` 
            this.rowBadgeStyle = \`min-width:2em; text-align:center; font-weight:900; border-radius:1em; border:1px solid lightblue; background-color:black; color:white;  text-shadow:0 0 8px #009999;\`
            this.itemStyle = \`padding: 0 1ch; display:flex; flex-direction:row; align-items:center; background-color:inherit; border:1px dotted rgba(0,0,255,0.4); white-space:pre; min-height:fit-content; \`  
            
            this.btnExpandStyle = \`min-width:1.5em; text-align:center;  border:none;background-color:gray; border-radius:3px; \` 
            this.btnExpandStyleActive = \`background-color:yellow;\`
            this.textareaStyle = \`flex-shrink: 0;background-color:black; white-space:pre; width:100%; margin:0;padding:0;box-sizing:border-box; min-height:fit-content;height:fit-content;\`   
            
            this.colors = {
                '[object String]': \`color:green;\`, 
                '[object Number]': \`color:chocolate;\`, 
                '[object Null]': \`color:teal;\`,
                '[object Object]': \`color:ghostwhite;\`, 
                '[object Array]': \`color:yellow;\`, 
                '[object Date]': \`color:pink;\`, 
                '[object Function]': \`color:rgb(0,255,255);\`, 
                '[object NodeList]': \`color:#AAAA00;\`, 
                'HTML': \`color:#AADD00;\`, 
                'Proxy': \`border-bottom: 2px dotted cyan;\`,
            }
            parent.appendChild(this.container)
        }
        createEl(parent, element = 'div', obj = {}, funcs) {
            let el = document.createElement(element)
            Object.assign(el, obj)
            if (obj.style && typeof obj.style == 'object') Object.assign(el.style, obj.style)

            if (funcs && typeof funcs == 'function') el.addEventListener('click', funcs)
            else if (funcs && typeof funcs == 'object') {
                for (const key of Object.keys(funcs)) {
                    if (typeof funcs[key] == 'function') el.addEventListener(key, funcs[key])
                }
            }
            if (parent) parent.appendChild(el)
            return el
        }
        isProxy = obj => { try { postMessage(obj, window); } catch (error) { return error && error.code === 25; } return false; };  // https://gist.github.com/Raiondesu/d4491ae05b46ea32d6d803066f9d7997
        addRow(row) {
            const scrollAtBottom = this.container.scrollTop + this.container.clientHeight == this.container.scrollHeight
            this.rowNr++
            let elRow = this.createEl(this.container, 'div', { style: { cssText: this.rowStyle } }) 
            this.createEl(elRow, 'p', { textContent: this.rowNr, style: { cssText: this.rowBadgeStyle } }) 
            for (let i = 0; i < row.length; i++) {
                let item = row[i]
                let type = Object.prototype.toString.call(item)
                let color = this.colors[type]
                if(!color && type.includes('HTML')) color = this.colors['HTML']
                if(!color) color = \`color:gray;\`
                if(this.isProxy(item)) color += this.colors.Proxy
                let innerText = (typeof item == 'object') ? '' : item 
                let title = (this.isProxy(item))? 'Proxy - ' : ''
                let Elitem = this.createEl(elRow, 'div', { title, innerText, style: { cssText: this.itemStyle } }) 
                if (typeof item == 'object' ) {
                    let strings = {full:'', oneline:''}
                    if(type.includes('HTML'))  item = new XMLSerializer().serializeToString(item);
                    else if(type == '[object NodeList]') item = Array.from(item).map((el)=>new XMLSerializer().serializeToString(el)).join('')
                    try{ strings.full = JSON.stringify(item, null, 2) }catch(err){ strings.full = err}
                    try{ strings.oneline = JSON.stringify(item).replace(/\\"/g, '"') }catch(err){ strings.oneline = err}
                    Elitem.title += \`\${typeof item} - \${Object.prototype.toString.call(item)}: \n\${strings.full}\` 
                    let textarea = this.createEl(this.container, 'textarea', { value: (type.includes('HTML') || type == '[object NodeList]')? item : strings.full, spellcheck: false, style: { cssText: \`display:none; \${this.textareaStyle}\` } })    
                    textarea.setAttribute('rows', textarea.value.split('\n').length+1)
                    this.createEl(Elitem, 'button', { textContent: \`+\`, style: { cssText: this.btnExpandStyle } }, (e) => {
                        if (e.target.textContent == '+') {
                            e.target.textContent = '-'
                            e.target.style.cssText += this.btnExpandStyleActive
                            textarea.style.display = 'block'
                        } else {
                            e.target.textContent = '+'
                            e.target.style.cssText += this.btnExpandStyle
                            textarea.style.display = 'none'
                        }
                    })
                    this.createEl(Elitem, 'p', { innerText: strings.oneline, style: { cssText: color } })
                } else {
                    Elitem.style.cssText += color
                }
            }
            if(scrollAtBottom) this.container.scrollTo(0, this.container.scrollHeight,);
        }
    }
    
    console.log('hello2')
    window.addEventListener('DOMContentLoaded', () => {
        const hijackLog = () => {
            const originalLog = window.console.log;
            console.log = function () {
                if (output) output.addRow(arguments)
                originalLog.apply(console, arguments);
            };
        }

        var output = new Output(/* document.getElementById('html') */)
        hijackLog()
        console.log('DOMContentLoaded',)
        console.log('string', 123, {objectkey1:'val1', objectkey2:'val2'}, ['a','b','c',1,2,3])
    });
})();
</script>`.replaceAll(`\\\``, `\``).replaceAll(`\\\$`, `\$`)