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
                this.ratios = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
                this.ratiosIndex = 7;
                //this.degrees = [0, 90, 180, 270];
                //this.degreesIndex = 0;

                this.angle = false;

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
                // 处理倍数
                let {ratiosIndex, ratios} = this;

                if (ratiosIndex < ratios.length - 1) {
                    this.$refs.stage._scale(ratios[++ratiosIndex]);
                    this.ratiosIndex++;
                }
            },

            // 缩小
            _zoomOut() {
                // 处理倍数
                let {ratiosIndex, ratios} = this;

                if (ratiosIndex > 0) {
                    this.$refs.stage._scale(ratios[--ratiosIndex]);
                    this.ratiosIndex--;
                }
            },

            // 逆时针旋转
            _rotateCCW() {
                // 处理度数
                // this.degreesIndex--;
                //
                // let {degreesIndex, degrees} = this;
                // degreesIndex = degreesIndex % degrees.length;
                // degreesIndex = degreesIndex < 0 ? degrees.length + degreesIndex : degreesIndex;
                //
                // this.$refs.stage._rotate(degrees[degreesIndex]);
                this.angle -= 90;
                this.$refs.stage._rotate(this.angle);
            },

            // 顺时针旋转
            _rotateCW() {
                // 处理度数
                // this.degreesIndex++;
                //
                // let {degreesIndex, degrees} = this;
                // degreesIndex = degreesIndex % degrees.length;
                // degreesIndex = degreesIndex < 0 ? degrees.length + degreesIndex : degreesIndex;
                //
                // this.$refs.stage._rotate(degrees[degreesIndex]);
                this.angle += 90;
                this.$refs.stage._rotate(this.angle);
            },

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