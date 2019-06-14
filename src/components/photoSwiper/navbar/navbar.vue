<template>
    <div id="Player-navbar">
        <button class="pagePrev iconfont iconsrt-back1"></button>
        <button class="pageNext iconfont iconsrt-forward1"></button>
        <div class="thumbs-list">
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/juHayWuaaoQ/240x160)" class="thumbs-item-active"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/eWFdaPRFjwE/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/i2KibvLYjqk/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/RFgO9B_OR4g/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/7bwQXzbF6KE/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/NhU0nUR7920/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/ndjyaOp0fOc/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/A-fubu9QJxE/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/rkkr6-2I4sg/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/mr_Tg4SI66A/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/YEsedBccUEA/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/Hw62tzAkXXE/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/Lzx4J_Pb3sk/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/cZVthlrnlnQ/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/vddccTqwal8/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/Sj5efgWguDs/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/Y7y7fe8hrh0/240x160)"></a>
            <a href="javascript:;" style="background-image:url(https://source.unsplash.com/sYegwYtIqJg/240x160)"></a>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="stylus" scoped>
    @import "../mixins.styl"

    #Player-navbar
        height: 80px
        full-screen(absolute, 2899)
        top: auto
        bottom: -80px
        background-color: #313131
        padding: 10px 0
        box-sizing: border-box
        transition: bottom .8s cubic-bezier(0.68, -0.55, 0.265, 1.55)

        button
            background-color: transparent
            display: inline-block;
            width: 30px
            height: 100%
            cursor: pointer;
            border: 0
            color: #FFF
            font-size: 18px
            float: left

            &.pageNext
                float: right

        .thumbs-list
            margin: 0 30px;
            height: 100%
            white-space: nowrap
            overflow: hidden
            text-align: center

            a
                display: inline-block
                height: 60px
                width: 60px
                margin: 0 1px
                backface-visibility: hidden
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