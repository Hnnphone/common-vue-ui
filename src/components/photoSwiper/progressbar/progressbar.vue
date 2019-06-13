<template>
    <div id="photoSwiper-progress"></div>
</template>

<script>
    export default {
        name: "progress"
    }
</script>

<style lang="stylus" scoped>
    #photoSwiper-progress
        background-color: #ff5268;
        position: absolute;
        height: 2px;
        top: 0;
        left: 0;
        right: 0;
        transform: scaleX(0);
        transform-origin: 0;
        transition-property: transform;
        transition-timing-function: linear;
        z-index: 99999;
</style>