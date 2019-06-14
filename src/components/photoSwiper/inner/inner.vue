<template>
    <div id="Player-inner">
        <caption />
        <indicator />
        <infobar />
        <navigation />
        <stage />
        <toolbar />
    </div>
</template>

<script>
    /*导入组件*/
    import caption from './caption/caption.vue'
    import indicator from './indicator/indicator.vue'
    import infobar from './infobar/infobar.vue'
    import navigation from './navigation/navigation.vue'
    import stage from './stage/stage.vue'
    import toolbar from './toolbar/toolbar.vue'

    export default {
        components: {
            caption,
            indicator,
            infobar,
            navigation,
            stage,
            toolbar
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../mixins.styl"

    #Player-inner
        full-screen(absolute, 2799)
</style>