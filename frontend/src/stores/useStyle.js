
import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import _ from 'lodash';
import * as store from '@stores/store.js';

export default defineStore('style', () => {
    const styles = reactive({
        body: {},
        main: {},
        header: {},
    })
    function getStyles() {
        styles.body = getStyleObj(document.body)
        styles.main = getStyleObj(document.getElementById('main'))
        styles.header = getStyleObj(document.getElementById('header'))
    }
    getStyles()

    function getStyleObj(el) {
        if (!el) return
        let style = getComputedStyle(el)
        return {
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
        }
    }

    function setFont(fontname, elid = 'main') {
        let elFont = document.getElementById('fonts_' + elid);
        console.log('setFont elFont', fontname, elid, elFont);
        if (!elFont) {
            elFont = document.createElement('style');
            elFont.id = 'fonts_' + elid;
            document.head.appendChild(elFont);
        }
        if (elid != 'body') elid = `#${elid}`;
        elFont.innerHTML = `${elid} * {font-family: '${fontname}';}`;
    }
    function setFontSize(size, elid = 'main') {
        let el = document.getElementById(elid)
        if (!el) return
        el.style.fontSize = size
    }

    const refs = reactive({ messageBoard: null, })
    const topmenuHeight = computed(() => {
        if (!refs.topmenu) return 3
        let rect = refs.topmenu.getBoundingClientRect()
        console.log('topmenuHeight', rect.height, topmenuHeight.value, rect)
        return 3//rect.height
    })
    const topmenuSvgHeight = computed(() => {
        console.log('topmenuSvgHeight', topmenuHeight.value, topmenuHeight.value - 1 + 'ch')
        return '100%' //topmenuHeight.value - 1 + 'ch'
    })

    const rowHeight = ref(1.3)
    const rowIcon = reactive({
        height: '1em',
    })
    //const topmenuHeight = ref('3ch')

    function postMessage(text = 'Message', color = 'rgba(0,0,0,0.9)', time = 5000) {
        if(Console) Console.log({file:'useStyle.js', func: 'postMessage'}, {text, color, time}, refs.messageBoard,  )
        let div = document.createElement('div');
        div.classList.add('message');
        div.style.backgroundColor = color;
        div.innerHTML = text;
        refs.messageBoard.appendChild(div);
        setTimeout(() => {
            div.classList.add('hide');
            div.addEventListener('webkitAnimationEnd', () => div.remove(), false);
        }, time);
    }
    return {
        styles, getStyles,
        setFont, setFontSize,
        topmenuHeight, topmenuSvgHeight,
        refs,
        rowIcon,
        rowHeight,
        postMessage,
    };
});