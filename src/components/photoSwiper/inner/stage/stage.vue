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
             *   keyboard: true,
             *   wheel: true,
             *   touch: {
             *      vertical: true,
             *      momentum: true,
             *   },
             * }
             */
            options: Object,
        },
        methods: {
            init() {
                stage.init(this, this.currentIndex, this.$refs.playerStage, this.slides, this.options);
            },

            scaleTo(TYPE) {
                stage._scaleTo(TYPE);
            },

            whirlTo(TYPE) {
                stage._whirlTo(TYPE);
            },
        },
        watch: {
            currentIndex() {
                stage.swipe(this.currentIndex);
            }
        }
    }
</script>

<style lang="stylus">
    @import "../../mixins.styl"

    #Player-stage
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0

    .stage-slide
        display: none
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0

        .slide-content
            display: inline-block
            text-align: center
            position: relative
            transition-property: transform
            transform-origin: center
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

        &.stage-slide--animating
            .slide-content
                transition-duration: 336ms

    &.stage-can-swipe
    &.stage-can-pan
        .slide-content
            cursor: grab;
    &.stage-can-zoomOut
        .slide-content
            cursor: zoom-out;
    &.stage-can-zoomIn
        .slide-content
            cursor: zoom-in;

    &.stage-is-grabbing
        .slide-content
            cursor: grabbing;
</style>