<template>
    <div id="Player-toolbar">
        <button id="toolbar-zoomIn" class="iconfont iconsrt-enlarge1"></button>
        <button id="toolbar-zoomOut" class="iconfont iconsrt-narrow1"></button>
        <button id="toolbar-rotate-acw" class="iconfont iconsrt-anti-clockwise1"></button>
        <button id="toolbar-rotate-cw" class="iconfont iconsrt-clockwise1"></button>
        <button id="toolbar-play" style="display: none"></button>
    </div>
</template>

<script>
    export default {
        name: "toolbar"
    }
</script>

<style lang="stylus" scoped>
    @import "../../mixins.styl"

    #Player-toolbar
        top: 20px
        right: 60px

        button
            width: 40px
            height: 40px
            border: 0
            border-radius: 50%
            font-size: 20px
            color: #FFF
            background-color: rgba(85, 85, 85, 0.4)
            margin-left: 6px
            cursor: pointer

</style>