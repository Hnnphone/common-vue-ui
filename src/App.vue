<template>
    <div id="app">
        <!--<p style="margin-top: 15px"><a id="test" href="javascript:;" class="btn btn-primary" @click="openPhotoswiper">Click me</a></p>-->

        <!--<p class="imglist" style="max-width: 1000px;" v-look>-->
            <!--<img src="https://source.unsplash.com/juHayWuaaoQ/240x160"/>-->
            <!--<img src="https://source.unsplash.com/eWFdaPRFjwE/240x160"/>-->
            <!--<img src="https://source.unsplash.com/i2KibvLYjqk/240x160"/>-->
            <!--<img src="https://source.unsplash.com/RFgO9B_OR4g/240x160"/>-->
            <!--<img src="https://source.unsplash.com/7bwQXzbF6KE/240x160"/>-->
            <!--<img src="https://source.unsplash.com/NhU0nUR7920/240x160"/>-->
            <!--<img src="https://source.unsplash.com/ndjyaOp0fOc/240x160"/>-->
            <!--<img src="https://source.unsplash.com/A-fubu9QJxE/240x160"/>-->
        <!--</p>-->

        <!--<photoswiper ref="photoswiper" />-->

        <!--<circle-progress></circle-progress>-->
        <!--<a-map></a-map>-->

        <SVG-container></SVG-container>
    </div>
</template>

<script>
    import dataOBJ from './components/photoSwiper/config.js'
    import photoswiper from './components/photoSwiper/photoSwiper.vue'

    import circleProgress from './components/widget/CircleProgress.vue'
    import AMap from './components/map/AMap.vue'

    import SVGContainer from './components/widget/svg/SVGContainer.vue'

    export default {
        data() {
            return {}
        },
        components: {
            photoswiper,
            circleProgress,
            AMap,
            SVGContainer
        },
        methods: {
            openPhotoswiper() {
                this.$refs.photoswiper._open(dataOBJ.slides, dataOBJ.options, dataOBJ.index, dataOBJ.userInfo);
            }
        },

        directives: {
            look: {
                // 指令的定义
                inserted(el, binding, vnode) {
                    var instance,
                        imgs,
                        items = [],
                        index = 0;

                    instance = vnode.context.$refs.photoswiper;
                    imgs = el.getElementsByTagName('img');

                    [].forEach.call(imgs, (img) => {
                        items.push(img.currentSrc);

                        img.addEventListener('click', (e) => {
                            _run(e, e.target);
                        })
                    });

                    function _run(e, $target) {
                        index = [].indexOf.call(imgs, $target);

                        // Sometimes current item can not be found
                        if (index < 0) {
                            index = 0;
                        }

                        const formatObj = items.map((item) => {
                            return {
                                src: item,
                                thumbnail: item
                            }
                        });

                        instance._open(formatObj, dataOBJ.options, index, dataOBJ.userInfo)
                    }
                }
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