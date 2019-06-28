<template>
    <div id="Player-inner">
        <infobar :userInfo="userInfo"/>
        <toolbar
            @zoomIn="_zoomIn"
            @zoomOut="_zoomOut"
            @rotateCCW="_rotateCCW"
            @rotateCW="_rotateCW"/>
        <navigation :currentIndex="currentIndex" :count="slides.length" :loop="opts.loop"
            @previous="_previous"
            @next="_next"/>
        <indicator  :currentIndex="currentIndex" :count="slides.length"/>

        <stage :slides="slides" :currentIndex="currentIndex" :options="opts.stage" ref="stage" />
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
        props: {
            slides: Array,
            currentIndex: Number,
            opts: Object,
            userInfo: Object,

            _close: Function,
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
            init() {
                this.$refs.stage.init();
            },

            // 上一张
            _previous() {
                this.$emit("jumpTo", this.currentIndex - 1);
            },

            // 下一张
            _next() {
                this.$emit("jumpTo", this.currentIndex + 1);
            },

            // 放大
            _zoomIn() {
                this.$refs.stage.scaleTo("IN");
            },

            // 缩小
            _zoomOut() {
                this.$refs.stage.scaleTo("OUT");
            },

            // 顺时针旋转
            _rotateCW() {
                this.$refs.stage.whirlTo("CW");
            },

            // 逆时针旋转
            _rotateCCW() {
                this.$refs.stage.whirlTo("CCW");
            },

        },
    }
</script>

<style lang="stylus" scoped>
    @import "../mixins.styl"

    #Player-inner
        full-screen(absolute, 2799)
</style>