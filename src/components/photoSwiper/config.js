
export default {
    slides: [
        /*
            {
                src: 'bigImageUrl'
                thumbnail: 'thumbnailImageUrl'
            }
         */
        {
            src: 'https://source.unsplash.com/juHayWuaaoQ/1500x1000',
            thumbnail: 'https://source.unsplash.com/juHayWuaaoQ/240x160'
        },
        {
            src: 'https://source.unsplash.com/eWFdaPRFjwE/1500x1000',
            thumbnail: 'https://source.unsplash.com/eWFdaPRFjwE/240x160'
        },
        {
            src: 'https://source.unsplash.com/i2KibvLYjqk/1500x1000',
            thumbnail: 'https://source.unsplash.com/i2KibvLYjqk/240x160'
        },
        {
            src: 'https://source.unsplash.com/RFgO9B_OR4g/1500x1000',
            thumbnail: 'https://source.unsplash.com/RFgO9B_OR4g/240x160'
        },
        {
            src: 'https://source.unsplash.com/7bwQXzbF6KE/1500x1000',
            thumbnail: 'https://source.unsplash.com/7bwQXzbF6KE/240x160'
        },
        {
            src: 'https://source.unsplash.com/NhU0nUR7920/1500x1000',
            thumbnail: 'https://source.unsplash.com/NhU0nUR7920/240x160'
        },
        {
            src: 'https://source.unsplash.com/ndjyaOp0fOc/1500x1000',
            thumbnail: 'https://source.unsplash.com/ndjyaOp0fOc/240x160'
        },
        {
            src: 'https://source.unsplash.com/A-fubu9QJxE/1500x1000',
            thumbnail: 'https://source.unsplash.com/A-fubu9QJxE/240x160'
        },
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

    userInfo: {
        avatar: "https://source.unsplash.com/IvfoDk30JnI/20x20",
        name: "韩先生"
    }
}