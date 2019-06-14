<template>
    <div id="photoSwiper-container">
        <transition name="toggle">
            <div id="photoSwiper-bg" v-if="open" @click="_toggleSwiper"></div>
        </transition>

        <div id="Player" v-if="open">
            <div id="Player-Layer">
                <inner />
                <navbar/>
            </div>
            <button id="Player-close" class="iconfont iconsrt-close1" @click="_toggleSwiper"></button>
        </div>

        <progressbar/>
    </div>
</template>

<script>
    import config from './config.js'

    /*导入组件*/
    import navbar from './navbar/navbar.vue'
    import inner from './inner/inner.vue'
    import progressbar from './progressbar/progressbar.vue'

    export default {
        data() {
            return {
                open: false, // 状态开关
                slides: config.slides, // 图片相关的链接
                currentIndex: 0, // 当前索引
                target: {}, // 事件源元素
                options: config.options, // 选项
                userInfo: config.userInfo
            }
        },
        components: {
            navbar,
            inner,
            progressbar,
        },
        methods: {
            _toggleSwiper() {
                this.open = !this.open;
            },
        }
    }

</script>

<style lang="stylus" scoped>
    @import "mixins.styl"

    #photoSwiper-container
        position: fixed
        top: 0
        left: 0
        z-index: 99999

        #photoSwiper-bg
            full-screen(fixed, 1001)
            background-color: #1E1E1E
            opacity: .8

            &.toggle-enter-active, &.toggle-leave-active
                transition: opacity .4s cubic-bezier(.22, .61, .36, 1)

            &.toggle-enter, &.toggle-leave-to
                opacity: 0

        #Player
            full-screen(fixed, 2001)
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