<template>
    <div id="Player-indicator">
        <span>2</span>/<span>35</span>
    </div>
</template>

<script>
    export default {
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