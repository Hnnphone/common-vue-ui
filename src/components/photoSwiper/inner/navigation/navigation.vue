<template>
    <div id="Player-navigation">
        <button id="navigation-Prev" class="iconfont iconsrt-back1"></button>
        <button id="navigation-Next" class="iconfont iconsrt-forward1"></button>
    </div>
</template>

<script>
    export default {
        name: "navigation"
    }
</script>

<style lang="stylus" scoped>
    @import "../../mixins.styl"

    #Player-navigation
        #navigation-Prev
        #navigation-Next
            z-index: 9999
            width: 90px
            height: 90px
            line-height: 90px
            position: absolute
            top: 50%
            margin-top: -45px;
            border: 0
            border-radius: 50%
            color: #FFF
            font-size: 72px
            font-weight: bold
            text-shadow: 0 0 1px #B4B3B4
            background-color: rgba(85, 85, 85, 0.4)
            opacity: 0
            visibility: hidden
            transition: opacity .25s ease, visibility 0s ease .25s
            cursor: pointer

        #navigation-Prev
            left: 150px
            padding-right: 14px

        #navigation-Next
            right: 150px
            padding-left: 14px

</style>