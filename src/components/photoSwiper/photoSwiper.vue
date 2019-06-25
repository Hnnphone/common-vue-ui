<template>
    <transition name="toggle" @after-enter="afterToggle">
        <div id="photoSwiper-container" v-if="isOpen">
            <div id="photoSwiper-bg" @click="_close"></div>

            <div ref="player" id="Player">
                <div id="Player-Layer">
                    <inner  :slides="slides" :currentIndex="currentIndex" :opts="option" :userInfo="userInfo" ref="inner" @jumpTo="_jumpTo" :_close="_close"/>
                    <navbar ref="navbar" :slides="slides" :currentIndex="currentIndex" :opts="option.thumbs" @jumpTo="_jumpTo"/>
                </div>
                <button id="Player-close" class="iconfont iconsrt-close1" @click="_close"></button>
            </div>

            <progressbar/>
        </div>
    </transition>
</template>

<script>
    /*导入组件*/
    import navbar from './navbar/navbar.vue'
    import inner from './inner/inner.vue'
    import progressbar from './progressbar/progressbar.vue'

    export default {
        data() {
            return {
                isOpen: false, // 状态开关

                slides: [], // 图片相关的链接
                currentIndex: 0, // 当前索引

                option: {}, // 选项
                userInfo: {}, // 个人信息

                pageNum: 0,
                pageCount: 0,
                currentPage: 0,
            }
        },
        components: {
            navbar,
            inner,
            progressbar,
        },
        methods: {
            _open(content, opts, index, userInfo) {
                if (!this.isOpen) {
                    this.isOpen = true;

                    this.slides = content;
                    this.currentIndex = index;
                    this.option = opts;
                    this.userInfo = userInfo;
                }
            },
            _close() {
                if(this.isOpen) {
                    this.isOpen = false;
                }
            },

            // 切换
            _jumpTo(position) {
                let index, len = this.slides.length;
                if (this.option.stage.loop) {
                    index = position % len;
                    index = index < 0 ? len + index : index;
                } else {
                    index = position;
                }

                if(index < 0 || index > len - 1) {
                    return;
                }

                this.currentIndex = index;
            },

            // 布局调整
            _adjustLayout() {
                const _player = this.$refs.player;
                const _vh = document.documentElement.clientHeight;
                const _ch = _player.clientHeight;
                const _requiredH = _ch + 70;
                if (_requiredH < _vh) {
                    _player.style.top = _vh / 2 - _ch / 2 + 'px';
                } else {
                    _player.style.top = 35 + 'px';
                }
            },
            _setResizeListener() {
                window.addEventListener("resize", () => {
                    if (this.isOpen) {
                        this._adjustLayout();
                        this.$refs.navbar._adjustLayout();
                    }
                });
            },

            afterToggle() {
                this.$refs.inner.init();
            },
        },
        watch: {
            isOpen(newVal) {
                this.$nextTick(() => {
                    if (newVal) {
                        this._adjustLayout();
                        this._setResizeListener();

                        this.$refs.navbar._adjustLayout();

                        //this.$refs.inner._initialize();
                    }
                })
            }
        }
    }

</script>

<style lang="stylus" scoped>
    @import "mixins.styl"

    #photoSwiper-container
        full-screen(fixed, 99999)
        transition: opacity .4s

        #photoSwiper-bg
            full-screen(absolute, 1001)
            background-color: #1E1E1E
            opacity: .8

        #Player
            full-screen(absolute, 2001)
            width: 87.5%
            height: 83%
            background-color: #000
            min-width: 750px
            max-width: 1314px
            min-height: 400px
            max-height: 710px
            margin: 0 auto

            #Player-Layer
                position: relative
                width: 100%
                height: 100%
                overflow: hidden

            #Player-close
                position: absolute
                z-index: 2999
                width: 50px
                height: 50px
                border: 0
                top: -25px
                right: -25px
                border-radius: 50%
                font-size: 36px
                color: #FFF
                cursor: pointer
                background-color: #313131

        &.toggle-enter-active
            #photoSwiper-bg
                transition: opacity .4s cubic-bezier(0.47, 0, 0.74, .71)
            #Player
                transition: transform  .4s cubic-bezier(0.175, 0.885, 0.32, 1.275)
        &.toggle-leave-active
            #photoSwiper-bg
                transition: opacity .4s cubic-bezier(0.22, 0.61, 0.36, 1)
            #Player
                transition: transform  .4s cubic-bezier(0.6, -0.28, 0.735, 0.045)
        &.toggle-enter, &.toggle-leave-to
            #photoSwiper-bg
                opacity: 0
            #Player
                transform: scale(0)
</style>