<script setup>
import { onMounted, reactive } from 'vue';
import MovableElement from '@scripts/MovableElement.js'
const refs = reactive({ wrapper: null, movable: null, textarea: null });
const state = reactive({ textarea: 'text' });

const props = defineProps({});

var movableElement
onMounted(() => {
    movableElement = new MovableElement({
        el: refs.movable,
        outputEl: refs.textarea
        //head: refs.head,
        //body: refs.dropdown,
    });

    // Keyboard events
    document.addEventListener('keydown', eventFunction, false); // first
    document.addEventListener('keypress', eventFunction, false); // second
    document.addEventListener('keyup', eventFunction, false); // third

    // Mouse events
    document.addEventListener('mousedown', eventFunction, false); // first
    document.addEventListener('mouseup', eventFunction, false); // second
    document.addEventListener('click', eventFunction, false); // third

    document.addEventListener('touchstart', eventFunction);
    document.addEventListener('touchend', eventFunction);
    document.addEventListener('touchcancel', eventFunction);
    document.addEventListener('touchmove', eventFunction);
});
function eventFunction(e) {
    let obj = getEventData(e);
    console.log('event', obj);
    state.textarea = JSON.stringify(obj, null, 2);
}
function getEventData(e) {
    //https://developer.mozilla.org/en-US/docs/Web/API/Event/type
    return getTargetData(e);
}
function getTargetData(e, obj = {}) {
    add(e, 'type', obj);
    add(e, 'timeStamp', obj);
    add(e, 'TouchList', obj);
    add(e, 'touches', obj);
    add(e, 'radiusX', obj);
    add(e, 'radiusY', obj);
    add(e, 'rotationAngle', obj);
    add(e, 'force', obj);
    add(e, 'screenX', obj);
    add(e, 'screenY', obj);
    add(e, 'clientX', obj);
    add(e, 'clientY', obj);
    add(e, 'pageX', obj);
    add(e, 'pageY', obj);
    add(e, 'identifier', obj);
    add(e, 'touchType', obj);

    if (e.touches) {
        obj.touches__ = [...e.touches];
        obj.touches_ = [];
        for (let i = 0; i < e.touches.length; i++) {
            obj.touches_.push(getTargetData(e.touches[i]));
            //getTargetData()
            //add(obj.touches[i], 'screenX', obj.touchesListed)
        }
    }
    obj.e = e;
    return obj;
}
function getTouchData(e) { }
function addVal(val, obj = {}) {
    //if(val != undefined && val != null) obj[e[key]]
    return obj;
}
function add(e, key, obj = {}) {
    if (e[key]) obj[key] = e[key];
    return obj;
}
</script>

<template>
    <Teleport to="#extra-settings"> aaa </Teleport>
    <div :ref="(el) => refs.movable = el" style="width:100px;height:100px;background-color: blue;position:fixed; z-index:100; right:0; transform: translateX(-50%);"></div>
    <textarea :ref="(el) => refs.textarea = el" v-model="state.textarea" spellcheck="false"> </textarea>
</template>

<style scoped lang="scss">
* {
    box-sizing: border-box;
    margin: 0;
}

textarea {
    display: block;
    position: relative;
    width: 100%;
    max-width: 100%;
    min-height: 50%;
    border: 1px solid chocolate;
    background-color: black;
    color: wheat;
}
</style>
