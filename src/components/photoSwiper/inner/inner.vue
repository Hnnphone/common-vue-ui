<template>
    <div id="Player-inner">
        <infobar :userInfo="userInfo"/>
        <toolbar
            @zoomIn="_zoomIn"
            @zoomOut="_zoomOut"
            @_rotateCCW="_rotateCCW"
            @_rotateCW="_rotateCW"/>
        <navigation :currentIndex="currentIndex" :count="slides.length" :loop="opts.loop"
            @previous="_previous"
            @next="_next"/>
        <indicator  :currentIndex="currentIndex" :count="slides.length"/>

        <stage :slides="slides" :options="opts" :currentIndex="currentIndex"/>
        <stage-caption/>
    </div>
</template>

<script>
    /*导入组件*/
    import infobar from './infobar/infobar.vue'
    import toolbar from './toolbar/toolbar.vue'
    import navigation from './navigation/navigation.vue'
    import indicator from './indicator/indicator.vue'
    import stage from './stage/stage.vue'
    import stageCaption from './caption/caption.vue'

    export default {
        data() {
            return {
                scaleMultiple: 1,
                rotateDegree: 0,
            }
        },
        props: {
            slides: Array,
            currentIndex: Number,
            opts: Object,
            userInfo: Object,
        },
        components: {
            infobar,
            toolbar,
            navigation,
            indicator,
            stage,
            stageCaption,
        },
        methods: {
            _initialize() {},

            // 上一张
            _previous() {
                this.$emit("jumpTo", this.currentIndex - 1);
            },

            // 下一张
            _next() {
                this.$emit("jumpTo", this.currentIndex + 1);
            },

            // TODO 放大
            _zoomIn() {},

            // TODO 缩小
            _zoomOut() {},

            // TODO 逆时针旋转
            _rotateCCW() {},

            // TODO 顺时针旋转
            _rotateCW() {},

            // TODO 重置
            _reset() {},
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../mixins.styl"

    #Player-inner
        full-screen(absolute, 2799)
</style>