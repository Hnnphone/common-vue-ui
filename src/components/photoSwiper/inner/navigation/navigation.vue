<template>
    <div id="Player-navigation">
        <button v-show="loop || currentIndex > 0" id="navigation-Prev" class="iconfont iconsrt-back1" @click="previous"></button>
        <button v-show="loop || currentIndex < count - 1" id="navigation-Next" class="iconfont iconsrt-forward1" @click="next"></button>
    </div>
</template>

<script>
    export default {
        props: {
            count: Number,
            currentIndex: Number,
            loop: Boolean
        },
        methods: {
            previous() {
                this.$emit("previous");
            },
            next() {
                this.$emit("next");
            },
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../mixins.styl"

    #Player-navigation
        #navigation-Prev
        #navigation-Next
            z-index: 9999
            width: 60px
            height: 60px
            line-height: 60px
            position: absolute
            top: 50%
            margin-top: -30px
            border: 0
            border-radius: 50%
            color: #FFF
            font-size: 40px
            font-weight: bold
            text-shadow: 0 0 1px #B4B3B4
            background-color: #000
            opacity: 0
            visibility: hidden
            transition: opacity .25s ease, visibility 0s ease .25s
            cursor: pointer

            &:hover
                background-color: rgba(85, 85, 85, 0.4)

        #navigation-Prev
            left: 5%
            padding-right: 10px

        #navigation-Next
            right: 5%
            padding-left: 10px

</style>