<template>
    <div id="photoSwiper-container">
        <div id="photoSwiper-bg"></div>

        <div id="Player">
            <div id="Player-Layer">
                <inner/>
                <navbar/>
            </div>
            <button id="Player-close" class="iconfont iconsrt-close1"></button>
        </div>
    </div>
</template>

<script>
    /*导入组件*/
    import navbar from './navbar/navbar.vue'
    import inner from './inner/inner.vue'

    export default {
        name: "photoSwiper",
        components: {
            navbar,
            inner,
        }
    }

</script>

<style lang="stylus" scoped>
    @import "mixins.styl"

    #photoSwiper-container
        full-screen(fixed, 9999)
        touch-action: manipulation;

        #photoSwiper-bg
            full-screen(absolute, 1001)
            background-color: rgba(7, 17, 26, 0.4)

        #Player
            full-screen(absolute, 2001)
            width: 87.5%
            height: 83%
            background-color: #000
            min-width: 750px
            max-width: 1314px
            min-height: 400px
            max-height: 710px
            margin: auto

            #Player-Layer
                position: relative
                width: 100%
                height: 100%
                overflow: hidden

            #Player-close
                position: absolute
                z-index: 2999
                width: 60px
                height: 60px
                border: 0
                top: -30px
                right: -30px
                border-radius: 50%
                font-size: 40px
                color: #FFF
                cursor: pointer
                background-color: #313131

</style>