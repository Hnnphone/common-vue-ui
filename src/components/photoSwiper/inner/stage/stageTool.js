import {_parseHtml, _extend, _isPlainObject, _isEmptyObject, _isFunction, _isNumeric} from "./tools.js"
import { Guestures } from "./guestures.js"

const stage = {
    data: {},

    // 初始化 dom、opts
    init(vm, currIndex, root, group, opts) {
        var self = this.data = {};

        self.vm = vm;
        self.root = root;
        self.group = group;
        self.opts = opts;
        self.slides = {};
        self.ratios = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5]; // 缩放比

        this.addEvents(self);
        this.swipe(currIndex);
    },

    // 添加事件
    addEvents(data) {
        let $root = data.root,
            prevTime = new Date().getTime(),
            keyboard = data.opts && data.opts.keyboard,
            wheel = data.opts && data.opts.wheel;

        window.addEventListener("resize", () => {
            // modified All Slide...
            Object.keys(data.slides).forEach((key) => {
                const slide = data.slides[key];
                this.updateSlide(slide);
            });

            data.ratiosIndex = 7;
            data.angle= 0;
        });

        //keyboard
        if(keyboard && $root) {
            document.addEventListener("keydown", (e) => {
                const keyCode = e.keyCode || e.which;

                // Backspace and Esc keys
                if (keyCode === 8 || keyCode === 27) {
                    e.preventDefault();

                    data.vm.$parent._close();

                    return;
                }

                // Left arrow and Up arrow
                if (keyCode === 37 || keyCode === 38) {
                    e.preventDefault();

                    data.vm.$parent._previous();

                    return;
                }

                // Right arrow and Down arrow
                if (keyCode === 39 || keyCode === 40) {
                    e.preventDefault();

                    data.vm.$parent._next();

                    return;
                }
            });
        }

        //wheel
        if(wheel && $root) {
            ["mousewheel", "DOMMouseScroll", "wheel", "MozMousePixelScroll"].forEach((item) => {
                $root.addEventListener(item, (e) => {
                    let currTime = new Date().getTime(),
                        pos = this.currentIndex;

                    if (data.group.length < 2) {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();

                    if (currTime - prevTime < 250) {
                        return;
                    }
                    prevTime = currTime;

                    data.vm.$parent[(-e.deltaY || -e.deltaX || e.wheelDelta || -e.detail) < 0 ? "_next" : "_previous"]();
                });
            });
        }

        //Guestures
        data.Guestures = new Guestures(this);
    },

    // 切换图片
    swipe(pos) {
        var self = this.data;

        self.ratiosIndex = 7;
        self.angle = 0;

        if (self.isDragging) return;

        // execute...
        const groupLen = self.group.length;
        let current,
            loop = self.opts.loop,
            previous;

        pos = parseInt(pos, 10);
        if (!loop && (pos < 0 || pos >= groupLen)) {
            return false;
        }

        const firstRun = _isEmptyObject(self.slides);

        // Create slides
        previous = self.current;
        self.prevPos = self.currentPos;

        current = this.createSlide(pos);
        // Should loop?
        if (groupLen > 1) {
            if (loop || current.pos < groupLen - 1) {
                this.createSlide(pos + 1);
            }
            if (loop || current.pos > 0) {
                this.createSlide(pos - 1);
            }
        }

        self.current = current;
        self.currentPos = current.pos;

        // Make sure current slide is visible
        current.$slide.classList.add("stage-slide--current");

        if (firstRun) {
            this.loadSlide(current);
            this.preload();

            return;
        }

        if (previous.pos !== current.pos) {
            previous.isComplete = false;
        }

        previous.$slide.classList.remove("stage-slide--current");

        if (current.isLoaded) {
            this.revealContent(current);
        } else {
            this.loadSlide(current);
        }
        this.preload();
    },

    createSlide(pos) {
        var self = this.data;

        let $slide, index;

        index = pos % self.group.length;
        index = index < 0 ? self.group.length + index : index;

        if ((!self.slides[pos]) && self.group[index]) {
            $slide = _parseHtml('<div class="stage-slide"></div>');
            self.root.appendChild($slide);

            self.slides[pos] = _extend(true, {}, self.group[index], {
                pos: pos,
                $slide: $slide,
                isLoaded: false
            });

            this.updateSlide(self.slides[pos]);
        }

        return self.slides[pos];
    },

    loadSlide(slide) {
        let $content;

        if (slide.isLoading || slide.isLoaded) {
            return;
        }
        slide.isLoading = true;

        // Check if need to show loading icon
        setTimeout(() => {
            const $img = slide.$image;

            if (slide.isLoading && !$img.complete) {
                this.showLoading(slide);
            }
        }, 50);

        // This will be wrapper containing both ghost and actual image
        $content = _parseHtml('<div class="slide-content"></div>');
        $content.classList.add("slide-is-hidden");
        slide.$slide.appendChild($content);
        slide.$content = $content;

        this.setImage(slide);
    },

    setImage(slide) {
        const $img = document.createElement("img");

        $img.onload = () => {
            this.resolveImageSlideSize(slide, $img.naturalWidth, $img.naturalHeight);
            this.afterLoad(slide);
        };

        $img.setAttribute("src", slide.src);

        slide.$content.appendChild($img);
        slide.$image = $img;
    },

    preload() {
        var self = this.data;

        let prev, next;

        // 预加载
        if (self.opts.preload && self.group.length < 2) {
            return;
        }
        next = self.slides[self.currentPos + 1];
        prev = self.slides[self.currentPos - 1];

        if (prev) {
            this.loadSlide(prev);
        }
        if (next) {
            this.loadSlide(next);
        }
    },

    showLoading(slide) {
        var self = this.data;

        slide = slide || self.current;

        if (slide && !slide.$spinner) {
            const $spinner = _parseHtml('<div class="loading"></div>');
            $spinner.style.display = "block";
            $spinner.style.opacity = "1";
            slide.$slide.appendChild($spinner);

            slide.$spinner = $spinner;
        }
    },

    hideLoading(slide) {
        var self = this.data;

        slide = slide || self.current;

        if (slide && slide.$spinner) {
            slide.$spinner.remove();

            delete slide.$spinner;
        }
    },

    resolveImageSlideSize(slide, imgWidth, imgHeight) {
        var self = this.data;

        let optWidth = parseInt(self.opts.width, 10),
            optHeight = parseInt(self.opts.height, 10);

        // Sets the default values from the image
        slide.width = imgWidth;
        slide.height = imgHeight;

        // Not done anything for the time being
        // Priority Height
        if (optWidth > 0) {
            slide.width = optWidth;
            slide.height = Math.floor((optWidth * imgHeight) / imgWidth);
        }

        if (optHeight > 0) {
            slide.width = Math.floor((optHeight * imgWidth) / imgHeight);
            slide.height = optHeight;
        }
    },

    afterLoad(slide) {
        var self = this.data;

        slide.isLoading = false;
        slide.isLoaded = true;

        this.hideLoading(slide);

        // Disable right click
        slide.$content.addEventListener("contextmenu", (e) => {
            if (e.button === 2) {
                e.preventDefault();
            }
            return true;
        });

        if (slide.pos === self.currentPos) {
            // Update cursor style
            self.root.classList.add("stage-can-swipe", "stage-can-pan");
        }

        this.revealContent(slide);
    },

    // TODO 揭幕
    revealContent(slide) {
        var self = this.data;

        let $slide = slide.$slide,
            start,
            end,
            effect,
            effectClassName,
            duration;

        effect = self.opts.transitionEffect;
        duration = self.opts.transitionDuration;

        if (slide.pos !== self.currentPos || !duration) {
            effect = false;
        }

        this.updateSlide(slide);

        // Simply show content if no effect
        if (!effect) {
            slide.$content.classList.remove("slide-is-hidden");
            if (slide.pos === self.currentPos) {
                this.complete();
            }
            return;
        }

        slide.$content.classList.remove("slide-is-hidden");
        this.complete();
    },

    complete() {
        var self = this.data;

        let current = self.current,
            slides = {},
            $el;

        if (!current.isLoaded) {
            return;
        }
        if (!current.isComplete) {
            current.isComplete = true;
        }

        // update slides []
        Object.keys(self.slides).forEach((index) => {
            const slide = self.slides[index];
            if (slide.pos >= self.currentPos - 1 && slide.pos <= self.currentPos + 1) {
                slides[slide.pos] = slide;
            } else if (slide) {
                slide.$slide.remove();
            }
        });

        self.slides = slides;
    },

    updateSlide(slide) {
        let width = slide.width,
            height = slide.height;

        // TODO First, prevent caption overlap, if needed
        // ...

        // Then resize content to fit inside the slide
        if (slide.$content && (width || height)) {
            // Important !!
            this.setTranslate(slide.$content, this.getFitPos(slide));
        }
    },

    getFitPos(slide) {
        var self = this.data;

        let $root = self.root,
            $content = slide.$content,
            width = slide.width,
            height = slide.height,
            canvasWidth,
            canvasHeight,
            minRatio,
            rez = {};

        if (!slide.isLoaded || !$content) return false;

        // Recalculate
        $content.initialArea = {};

        canvasWidth = this.getTranslate($root).width;
        canvasHeight = this.getTranslate($root).height;

        if (!width || !height) {
            width = canvasWidth;
            height = canvasHeight;
        }

        minRatio = Math.min(1, canvasWidth / width, canvasHeight / height);
        width = minRatio * width;
        height = minRatio * height;

        // Adjust width/height to precisely fit into container
        if (width > canvasWidth - 0.5) width = canvasWidth;
        if (height > canvasHeight - 0.5) height = canvasHeight;

        rez.top = $content.initialArea.top = Math.floor((canvasHeight - height) * 0.5);
        rez.left = $content.initialArea.left = Math.floor((canvasWidth - width) * 0.5);

        rez.width = $content.initialArea.width = width;
        rez.height = $content.initialArea.height = height;

        return rez;
    },

    getTranslate($el, isInvert) {
        if (!$el) return false;

        // 注意宽高的问题
        const domRect = $el.getBoundingClientRect();
        return {
            top: domRect.top || 0,
            left: domRect.left || 0,
            width: isInvert ? domRect.height : domRect.width,
            height: isInvert ? domRect.width : domRect.height,
        };
    },

    setTranslate($el, props) {
        $el.style.transform = "";//reset transform

        let str = "";

        if (!$el || !props) return;

        if (props.translateX !== undefined || props.translateY !== undefined) {
            str = `${props.translateX === undefined ? 0 : props.translateX}px, ${props.translateY === undefined ? 0 : props.translateY}px`;
            str = `translate(${str})`;
        }
        if (props.scaleX !== undefined && props.scaleY !== undefined) {
            str += `scale(${props.scaleX}, ${props.scaleY})`;
        } else if (props.scale !== undefined) {
            str += `scale(${props.scale})`;
        }
        if (props.rotate !== undefined) {
            str += `rotate(${props.rotate}deg)`;
        }

        if (str.length) {
            $el.style.transform = str;
        }

        if (props.height !== undefined) {
            $el.style.height = `${props.height}px`;
        }
        if (props.width !== undefined) {
            $el.style.width = `${props.width}px`;
        }
        if (props.left !== undefined) {
            $el.style.left = `${props.left}px`;
        }
        if (props.top !== undefined) {
            $el.style.top = `${props.top}px`;
        }

        return $el;
    },

    // 过渡
    animate($el, to, callback) {
        let $parent = $el.parentNode,
            from = $el.initialArea,
            currRect = this.getTranslate($el, $el.isInvert),
            ratio,
            angle,
            pan,
            transitionendFlag;

        $parent.classList.remove("stage-slide--animating");

        // Do you need to reset the width and height ?
        transitionendFlag = true;
        $el.addEventListener("transitionend", (e) => {
            // 避免多次执行
            if (e.target === e.currentTarget && transitionendFlag) {
                transitionendFlag = false;
                $el.isAnim = false;
                $parent.classList.remove("stage-slide--animating");

                if (to.scale !== undefined || to.rotate !== undefined || to.translateX !== undefined && to.translateY !== undefined) {
                    if (to.scale !== undefined) {
                        this.setTranslate($el, {
                            top: from.top - (from.height * to.scale - from.height) * 0.5,
                            left: from.left - (from.width * to.scale - from.width) * 0.5,
                            width: from.width * to.scale,
                            height: from.height * to.scale,
                            rotate: angle,
                        });
                    }
                    if (to.rotate !== undefined) {
                        this.setTranslate($el, {
                            rotate: angle % 360
                        });
                        $el.rotateAngel = angle % 360; // 保存
                    }
                }

                callback && callback();
            }
        });

        if (to.scale !== undefined || to.rotate !== undefined || to.translateX !== undefined && to.translateY !== undefined) {
            angle = to.rotate === undefined ? $el.rotateAngel: to.rotate;

            pan = {
                X: to.translateX,
                Y: to.translateY,
            };

            if (to.scale !== undefined) {
                //compute by width
                ratio = from.width * to.scale / currRect.width;
            }

            $parent.classList.add("stage-slide--animating");
            $el.isAnim = true;

            this.setTranslate($el, {
                scale: ratio,
                rotate: angle,
                left: pan.X,
                top: pan.Y
            });
        }
    },

    // 缩放
    _scaleTo(TYPE) {
        let self = this.data,
            $content = self.current.$content,
            ratios = self.ratios,
            ratiosIndex = self.ratiosIndex;

        if ($content.isAnim || !self.current.isComplete) return;

        if (TYPE === "IN" && ratiosIndex < ratios.length - 1) {
            this.animate($content, {
                scale: ratios[++ratiosIndex],
            });
            self.ratiosIndex++;
        } else if (TYPE === "OUT" && ratiosIndex > 0) {
            this.animate($content, {
                scale: ratios[--ratiosIndex],
            });
            self.ratiosIndex--;
        }
    },

    // 旋转
    _whirlTo(TYPE) {
        let self = this.data,
            $content = self.current.$content,
            angel;

        $content.isInvert = self.angle / 90 % 2 === 0;

        if ($content.isAnim || !self.current.isComplete) return;

        if (TYPE === "CCW") {
            angel = self.angle = self.angle % 360 - 90;
            this.animate($content, {
                rotate: angel % 360 === 0 && angel !== 0 ? -360 : angel % 360
            });
        } else if (TYPE === "CW") {
            angel = self.angle = self.angle % 360 + 90;
            this.animate($content, {
                rotate: angel % 360 === 0 && angel !== 0 ? +360 : angel % 360
            });
        }
        //self.ratiosIndex = 7;
    },

    // Check if image dimensions exceed parent element
    _canDragging(nextWidth, nextHeight) {
        let self = this.data,
            current = self.current,
            pos = null,
            rez = false;

        if (current.isComplete || (nextWidth && nextHeight)) {
            rez = current.$content && current.$content.initialArea;

            if (nextWidth !== undefined && nextHeight !== undefined) {
                pos = {
                    width: nextWidth,
                    height: nextHeight
                };
            } else if (current.isComplete) {
                pos = this.getTranslate(current.$content);
            }

            if (pos && rez) {
                rez = pos.width - rez.width > 1.5 || pos.height - rez.height > 1.5;
            }
        }

        return rez;
    },
};

export default stage;