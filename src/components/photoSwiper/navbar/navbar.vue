<template>
    <div id="Player-navbar" v-if="opts.hasNavbar">
        <button class="pagePrev iconfont iconsrt-back1" v-show="isPagination" @click="prevPage"
                :class="{'enabled': currentPage !== 0 }"></button>
        <button class="pageNext iconfont iconsrt-forward1" v-show="isPagination" @click="nextPage"
                :class="{'enabled': currentPage < pageNum - 1 }"></button>

        <div class="thumbs-list" ref="thumbsList">
            <a href="javascript:;"
               v-for="(thumb, index) in thumbs"
               :key="index"
               :style="{
                    'background-image' : `url(${thumb.thumbnail})`,
                    'margin-right': `${marginRight}px`
               }"
               :class="{'thumbs-item-active': _realIndex(index)  === currentIndex}"
               @click="jumpTo(index)"></a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            slides: Array,
            currentIndex: Number,
            opts: Object,
        },
        data() {
            return {
                isPagination: false,
                marginRight: 0,

                pageNum: 0,
                pageCount: 0,
                currentPage: 0,
                currentPageCount: 0,

                // 阈值数组
                threshold: []
            }
        },
        computed: {
            thumbs() {
                const pageStart = this.currentPage * this.pageCount;

                return Array.prototype.slice.call(this.slides, pageStart, pageStart + this.pageCount);
            },
        },
        watch: {
            pageCount(newVal) {
                this.threshold = [];
                for (let i = 1; i <= this.pageNum; i++) {
                    this.threshold.push(i * newVal);
                }
            },

            currentIndex(newVal) {
                // 达到阈值时自动切换分页
                this.currentPage = this.threshold.findIndex((t) => {
                    return newVal < t;
                });
            },
        },
        methods: {
            // 布局调整
            _adjustLayout() {
                const _tlWidth = this.$refs.thumbsList.clientWidth;
                const _tiWidth = this.opts.thumbWidth || 60;
                const _minMargin = 5;
                const _requiredWidth = this.slides.length * (_tiWidth + _minMargin);

                //computed at any time
                if (_tlWidth <= _requiredWidth) {
                    this.isPagination = true;
                    this.pageCount = Math.floor(_tlWidth / (_tiWidth + _minMargin));
                    this.pageNum = Math.ceil(this.slides.length / this.pageCount);
                    this.currentPage = Math.floor(this.currentIndex / this.pageCount);

                    // 修改margin值
                    this.marginRight = (_tlWidth - _tiWidth * this.pageCount) / this.pageCount;
                } else {
                    this.isPagination = false;
                    this.pageCount = this.slides.length;
                    this.pageNum = 1;
                    this.currentPage = 0;
                    this.marginRight = _minMargin;
                }
            },

            _realIndex(index) {
                return index + this.currentPage * this.pageCount;
            },

            // 分页处理
            prevPage() {
                if (this.currentPage > 0) {
                    this.currentPage--;
                }
            },
            nextPage() {
                if (this.currentPage < this.pageNum - 1) {
                    this.currentPage++;
                }
            },
            // 切换
            jumpTo(position) {
                this.$emit('jumpTo', this._realIndex(position));
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../mixins.styl"

    #Player-navbar
        height: 80px
        full-screen(absolute, 2899)
        top: auto
        //bottom: -80px
        background-color: #313131
        transition: bottom .8s cubic-bezier(0.68, -0.55, 0.265, 1.55)

        button
            background-color: transparent
            display: inline-block;
            width: 30px
            height: 100%
            cursor: pointer
            border: 0
            color: #6F6F6F
            font-size: 18px
            float: left

            &.pageNext
                float: right

            &.enabled
                color: #FFF

            &.enabled:hover
                color: #5293F5

        .thumbs-list
            margin: 0 30px;
            padding: 10px 0;
            height: 100%
            white-space: nowrap
            overflow: hidden
            text-align: center
            box-sizing: border-box

            a
                display: inline-block
                height: 60px
                width: 60px
                background-clip: content-box
                background-position: 50%
                background-repeat: no-repeat
                background-size: cover
                position: relative

                &:before
                    content: ''
                    display: block
                    full-screen(absolute)
                    background-color: #000
                    opacity: .8

                &:hover:before
                    opacity: 0
                    transition: opacity .3s

                &.thumbs-item-active:before
                    opacity: 0

</style>