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
                stage._init(this.currentIndex, this.$refs.playerStage, this.slides, this.options);
            }
        },
        watch: {
            currentIndex(newValue) {
                stage._swipe(newValue);
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
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            user-select: none

            img
                position: absolute
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)
                max-width: 100%
                max-height: 100%
                padding: 0
                border: 0
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
</style>