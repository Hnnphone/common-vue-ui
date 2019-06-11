<template>
    <div id="photoSwiper-container">
        <div id="photoSwiper-bg"></div>

        <div id="Player">
            <div id="Player-Layer">
                <div id="Player-progress"></div>

                <div id="Player-inner">
                    <div id="Player-infobar">
                        <span id="avatar" style="background: url(https://source.unsplash.com/IvfoDk30JnI/20x20)"></span>
                        <span id="userName">韩先生</span>
                    </div>

                    <div id="Player-toolbar">
                        <button id="toolbar-zoomIn" class="iconfont iconsrt-enlarge1"></button>
                        <button id="toolbar-zoomOut" class="iconfont iconsrt-narrow1"></button>
                        <button id="toolbar-rotate-acw" class="iconfont iconsrt-anti-clockwise1"></button>
                        <button id="toolbar-rotate-cw" class="iconfont iconsrt-clockwise1"></button>
                        <button id="toolbar-play" style="display: none"></button>
                    </div>

                    <div id="Player-navigation">
                        <button id="navigation-Prev" class="iconfont iconsrt-back1"></button>
                        <button id="navigation-Next" class="iconfont iconsrt-forward1"></button>
                    </div>

                    <div id="Player-stage">
                        <ul class="Stage-List">
                            <li class="Stage-content Stage-content-current">
                                <img src="https://source.unsplash.com/IvfoDk30JnI/2500x1000" alt="">
                            </li>
                            <li class="Stage-content">
                                <img src="https://source.unsplash.com/juHayWuaaoQ/1500x1000" alt="">
                            </li>
                            <li class="Stage-content">
                                <img src="https://source.unsplash.com/eWFdaPRFjwE//1500x1000" alt="">
                            </li>
                        </ul>
                    </div>

                    <div id="Player-indicator">
                        <span>2</span>/<span>35</span>
                    </div>
                    <div id="Player-caption"></div><!-- 标题预留 -->
                </div>

                <div id="Player-navbar">
                    <button class="pagePrev iconfont iconsrt-back1"></button>
                    <button class="pageNext iconfont iconsrt-forward1"></button>
                    <div class="thumbs-list">
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/IvfoDk30JnI/240x160)"
                           class="thumbs-item-active"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/juHayWuaaoQ/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/eWFdaPRFjwE/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/i2KibvLYjqk/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/RFgO9B_OR4g/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/7bwQXzbF6KE/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/NhU0nUR7920/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/juHayWuaaoQ/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/eWFdaPRFjwE/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/i2KibvLYjqk/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/RFgO9B_OR4g/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/7bwQXzbF6KE/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/NhU0nUR7920/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/juHayWuaaoQ/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/eWFdaPRFjwE/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/i2KibvLYjqk/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/RFgO9B_OR4g/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/7bwQXzbF6KE/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/NhU0nUR7920/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/IvfoDk30JnI/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/juHayWuaaoQ/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/eWFdaPRFjwE/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/i2KibvLYjqk/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/RFgO9B_OR4g/240x160)"></a>
                        <a href="javascript:;"
                           style="background-image:url(https://source.unsplash.com/7bwQXzbF6KE/240x160)"></a>
                    </div>
                </div>
            </div>

            <button id="Player-close" class="iconfont iconsrt-close1"></button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "photoSwiper"
    }

</script>

<style lang="stylus" scoped>
    @import "mixins.styl"

    #photoSwiper-container
        full-screen(fixed, 9999)
        touch-action: manipulation;

        #photoSwiper-bg
            full-screen(absolute, 1001)
            background-color: rgba(7, 17, 26, 0.4)

        #Player
            full-screen(absolute, 2001)
            width: 87.5%
            height: 83%
            background-color: #000
            min-width: 750px
            max-width: 1314px
            min-height: 400px
            max-height: 710px
            margin: auto

            #Player-Layer
                position: relative
                width: 100%
                height: 100%
                overflow: hidden

                #Player-progress
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

                #Player-inner
                    full-screen(absolute, 2799)

                    #Player-infobar
                    #Player-toolbar
                    #Player-indicator
                        position: absolute
                        z-index: 9999
                        direction: ltr
                        opacity: 0
                        cursor: pointer
                        visibility: hidden
                        transition: opacity .25s ease, visibility 0s ease .25s

                    #Player-infobar
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

                    #Player-toolbar
                        top: 20px
                        right: 60px

                        button
                            width: 40px
                            height: 40px
                            border: 0
                            border-radius: 50%
                            font-size: 20px
                            color: #FFF
                            background-color: rgba(85, 85, 85, 0.4)
                            margin-left: 6px
                            cursor: pointer

                    #Player-navigation
                        #navigation-Prev
                        #navigation-Next
                            z-index: 9999
                            width: 90px
                            height: 90px
                            position: absolute
                            top: 50%
                            margin-top: -45px;
                            border: 0
                            border-radius: 50%
                            color: #FFF
                            font-size: 72px
                            font-weight: bold
                            text-shadow: 0 0 1px #B4B3B4
                            background-color: rgba(85, 85, 85, 0.4)
                            opacity: 0
                            visibility: hidden
                            transition: opacity .25s ease, visibility 0s ease .25s
                            cursor: pointer

                        #navigation-Prev
                            left: 150px
                            padding-right: 14px

                        #navigation-Next
                            right: 150px
                            padding-left: 14px

                    #Player-stage
                        full-screen(absolute)
                        .Stage-content
                            full-screen(absolute)
                            display: none
                            img
                                max-height: 100%
                                max-width: 100%
                                outline: none
                                border: 0
                                position: absolute
                                top: 50%
                                left: 50%
                                transform: translate(-50%, -50%)
                            &.Stage-content-current
                                display: block
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

                #Player-navbar
                    height: 80px
                    full-screen(absolute, 2899)
                    top: auto
                    bottom: -80px
                    background-color: #313131
                    padding: 10px 0
                    box-sizing: border-box
                    transition: bottom .8s cubic-bezier(0.68, -0.55, 0.265, 1.55)

                    button
                        background-color: transparent
                        display: inline-block;
                        width: 30px
                        height: 100%
                        cursor: pointer;
                        border: 0
                        color: #FFF
                        font-size: 18px
                        float: left

                        &.pageNext
                            float: right

                    .thumbs-list
                        margin: 0 30px;
                        height: 100%
                        white-space: nowrap
                        overflow: hidden
                        text-align: center

                        a
                            display: inline-block
                            height: 60px
                            width: 60px
                            margin: 0 1px
                            backface-visibility: hidden
                            background-clip: content-box
                            background-position: 50%
                            background-repeat: no-repeat
                            background-size: cover
                            position: relative

                            &:before
                                content: ''
                                display: block
                                full-screen(absolute)
                                background-color: #000
                                opacity: .8

                            &:hover:before
                                opacity: 0
                                transition: opacity .3s

                            &.thumbs-item-active:before
                                opacity: 0

                &:hover
                    #Player-navbar
                        bottom: 0 !important

                    #Player-toolbar
                    #Player-indicator
                        opacity: 1 !important
                        visibility: visible !important
                    #Player-navigation
                        #navigation-Prev
                        #navigation-Next
                            opacity: 1 !important
                            visibility: visible !important

            #Player-close
                position: absolute
                z-index: 2999
                width: 60px
                height: 60px
                border: 0
                top: -30px
                right: -30px
                border-radius: 50%
                font-size: 40px
                color: #FFF
                cursor: pointer
                background-color: #313131

</style>