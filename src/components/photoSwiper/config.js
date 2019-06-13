
export default {
    slides: [
        /*
            {
                src: 'bigImageUrl'
                thumbnail: 'thumbnailImageUrl'
            }
         */
        {

        },
        {

        },
        {},
        {},
        {}
    ],
    options: {
        loop: false, // 是否启用无限轮播
        keyboard: true, // 是否启用键盘导航
        wheel: true, // 是否启用滚轮导航

        hasNavigation: true,
        hasInfobar: true,
        hasToolbar: true,
        hasIndicator: true,

        /**
         * 是否启用预加载
         *  true -
         *  false -
         */
        preload: false,

        /**
         * 打开/关闭时指定的交互动画类型 及持续时间
         * 可选值：
         *  - false
         *  - "zoom"
         *  - "fade"
         *  - "zoom-in-out"
         */
        animationEffect: "zoom",
        animationDuration: 366,

        /**
         * slides 切换时的过渡效果 及持续时间
         * 可选值：
         *  - false
         *  - "fade"
         *  - "slide"
         *  - "circular"
         *  - "tube"
         *  - "zoom-in-out"
         *  - "rotate"
         */
        transitionEffect: "fade",
        transitionDuration: 366,

        /**
         * 定义 Hash 值，以处理页面刷新的情况
         *  - 设置为 false 时不启用
         */
        hash: null,

        autoStart: false, // 是否自动播放
        speed: 3000, // 自动播放间隔

        thumbs: {
            hasNavbar: true, // 是否显示略缩图
            pageCount: 10, // 每页显示的数量
        },

        fullScreen: false
    },

    index: 0, // 索引
}