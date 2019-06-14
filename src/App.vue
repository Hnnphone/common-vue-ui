<template>
    <div id="app">
        <p style="margin-top: 15px"><a id="test" href="javascript:;" class="btn btn-primary" @click="openPhotoswiper">Click me</a></p>
        <p class="imglist" style="max-width: 1000px;">
            <a href="https://source.unsplash.com/juHayWuaaoQ/1500x1000" data-fancybox="images">
                <img src="https://source.unsplash.com/juHayWuaaoQ/240x160"/>
            </a>
            <a href="https://source.unsplash.com/eWFdaPRFjwE/1500x1000" data-fancybox="images">
                <img src="https://source.unsplash.com/eWFdaPRFjwE/240x160"/>
            </a>
            <a href="https://source.unsplash.com/i2KibvLYjqk/1500x1000" data-fancybox="images">
                <img src="https://source.unsplash.com/i2KibvLYjqk/240x160"/>
            </a>
            <a href="https://source.unsplash.com/RFgO9B_OR4g/1500x1000" data-fancybox="images">
                <img src="https://source.unsplash.com/RFgO9B_OR4g/240x160"/>
            </a>
            <a href="https://source.unsplash.com/7bwQXzbF6KE/1500x1000" data-fancybox="images">
                <img src="https://source.unsplash.com/7bwQXzbF6KE/240x160"/>
            </a>
            <a href="https://source.unsplash.com/NhU0nUR7920/1500x1000" data-fancybox="images">
                <img src="https://source.unsplash.com/NhU0nUR7920/240x160"/>
            </a>
            <a href="https://source.unsplash.com/ndjyaOp0fOc/1500x1000" data-fancybox="images" data-type="image">
                <img src="https://source.unsplash.com/ndjyaOp0fOc/240x160"/>
            </a>
            <a href="https://source.unsplash.com/A-fubu9QJxE/1500x1000" data-fancybox="images" data-type="image">
                <img src="https://source.unsplash.com/A-fubu9QJxE/240x160"/>
            </a>
        </p>

        <photoswiper ref="photoswiper" />
    </div>
</template>

<script>
    import dataOBJ from './components/photoSwiper/config.js'
    import photoswiper from './components/photoSwiper/photoSwiper.vue'

    export default {
        data() {
            return {}
        },
        components: {
            photoswiper
        },
        methods: {
            openPhotoswiper() {
                this.$refs.photoswiper._open(dataOBJ.slides, dataOBJ.options, dataOBJ.index, dataOBJ.userInfo);
            }
        }
    }
</script>

<style lang="stylus">
    .btn
        display: inline-block;
        font-weight: 400;
        color: #212529;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        background-color: transparent;
        border: 1px solid transparent;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 0.25rem;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    .btn-primary
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;

    a
        text-decoration: none
</style>