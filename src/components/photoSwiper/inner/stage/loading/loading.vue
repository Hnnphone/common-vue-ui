<template>
    <div id="Stage-loading"></div>
</template>

<script>
    export default {
        name: "loading"
    }
</script>

<style lang="stylus" scoped>
    #Stage-loading
        display: none
        line-height: 1.15
        z-index: 9999
        width: 2.5em
        height: 2.5em
        center()
        position: fixed
        transform: rotate(165deg);

        &:before
        &:after
            content: ''
            position: absolute;
            top: 50%
            left: 50%
            width: 0.5em
            height: 0.5em
            border-radius: 0.25em
            transform: translate(-50%, -50%)

        &:before
            animation: before 2s infinite;

        &:after
            animation: after 2s infinite;

</style>