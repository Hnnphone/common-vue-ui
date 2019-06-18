<template>
    <div id="Player-indicator">
        <span>{{currentIndex+1}}</span>/<span>{{count}}</span>
    </div>
</template>

<script>
    export default {
        props: {
            currentIndex: Number,
            count: Number,
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../mixins.styl"

    #Player-indicator
        padding: 0 20px
        line-height: 28px
        bottom: 100px
        left: 50%
        font-size: 14px
        border-radius: 14px
        transform: translateX(-50%)
        color: #FFF
        background-color: rgba(85, 85, 85, 0.4)
</style>