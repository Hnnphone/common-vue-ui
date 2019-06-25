<template>
    <div id="Player-stage" ref="playerStage"></div>
</template>

<script>
    import stage from './stageTool.js'

    export default {
        props: {
            slides: Array, // 元数据
            currentIndex: Number,

            /*
             * options {
             *   loop,
             *   preload,
             *   transitionEffect,
             *   transitionDuration,
             *   hash,
             * }
             */
            options: Object,
        },
        methods: {
            init() {
                stage.init(this, this.currentIndex, this.$refs.playerStage, this.slides, this.options);
            },

            // _scale(ratio) {
            //     stage.onScale(ratio);
            // },
            //
            // _rotate(degress) {
            //     stage.onRotate(degress);
            // }
        },
        watch: {
            currentIndex(newValue) {
                stage.swipe(newValue);
            }
        }
    }
</script>

<style lang="stylus">
    @import "../../mixins.styl"

    #Player-stage
        full-screen(absolute)

    .stage-slide
        display: none
        full-screen(absolute)

        .slide-content
            display: inline-block;
            text-align: center;
            user-select: none

            &.slide-is-hidden
                position: absolute !important;
                visibility: hidden;

            img
                position: absolute
                width: 100%
                height: 100%
                max-height: none
                max-width: none
                background: transparent
                padding: 0
                border: 0
                margin: 0
                left: 0
                top: 0
                vertical-align: middle
                user-select: none

        .loading
            display: none
            opacity: 0
            transition: opacity 5s cubic-bezier(0.47, 0, 0.74, .71)
            width: 2.5em
            height: 2.5em
            line-height: 1.15
            center()
            transform: rotate(165deg)

            &:before
            &:after
                content: ''
                position: absolute;
                top: 50%
                left: 50%
                width: 0.5em
                height: 0.5em
                border-radius: 0.25em
                transform: translate(-50%, -50%)

            &:before
                animation: before 2s infinite;

            &:after
                animation: after 2s infinite;

        &.stage-slide--current
            display: block

        &.slide-is--scaling
            .slide-content
                transition transform 366ms

        &.slide-is--rotating
            .slide-content
                transition transform 366ms
</style>