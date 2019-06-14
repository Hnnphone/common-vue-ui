<template>
    <div id="Player-infobar">
        <span id="avatar" style="background: url(https://source.unsplash.com/IvfoDk30JnI/20x20)"></span>
        <span id="userName">韩先生</span>
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="stylus" scoped>
    @import "../../mixins.styl"

    div#Player-infobar
        opacity: 1
        visibility: visible
        top: 20px
        left: 20px;
        max-width: 130px;
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        height: 40px
        line-height: 40px
        border-radius: 20px
        background-color: rgba(85, 85, 85, 0.4)
        color: #FFF
        padding: 0 13px;
        box-sizing: border-box
        font-size: 14px

        #avatar
            display: inline-block
            width: 20px
            height: 20px
            border-radius: 50%
            background-color: rgba(216, 216, 216, 1)
            vertical-align: middle
            margin-right: 6px

</style>