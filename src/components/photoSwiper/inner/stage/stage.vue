<template>
    <div id="Player-stage">
        <ul class="Stage-List">
            <li class="Stage-content Stage-content-current">
                <img src="https://source.unsplash.com/IvfoDk30JnI/1500x1000" alt="">
                <loading/>
            </li>
            <li class="Stage-content">
                <img src="https://source.unsplash.com/juHayWuaaoQ/1500x1000" alt="">
                <loading/>
            </li>
            <li class="Stage-content">
                <img src="https://source.unsplash.com/eWFdaPRFjwE//1500x1000" alt="">
                <loading/>
            </li>
        </ul>
    </div>
</template>

<script>
    import loading from './loading/loading.vue'

    export default {
        props: {
            slides: Array,
            currentIndex: Number,
            options: Object,
        },
        components: {
            loading
        },
        methods: {
            _initStage() {

            },
        },
    }
</script>

<style lang="stylus" scoped>
    @import "../../mixins.styl"

    #Player-stage
        full-screen(absolute)

        .Stage-content
            full-screen(absolute)
            display: none

            img
                max-height: 100%
                max-width: 100%
                outline: none
                border: 0
                position: absolute
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)
                user-select: none

            &.Stage-content-current
                display: block

</style>