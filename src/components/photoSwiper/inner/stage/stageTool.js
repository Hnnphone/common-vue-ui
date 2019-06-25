const stage = {
    data: {},

    // 初始化
    init(vm, currIndex, root, group, opts) {
        var self = this.data = {};

        self.vm = vm;
        self.root = root;
        self.group = group;
        self.opts = opts;
        self.slides = {};

        this.addEvents(self);
        this.swipe(currIndex);
    },

    addEvents(instance) {
        let prevTime = new Date().getTime(),
            keyboard = instance.opts && instance.opts.keyboard,
            wheel = instance.opts && instance.opts.wheel;

        window.addEventListener("resize", () => {
            // modified All Slide...
            Object.keys(instance.slides).forEach((index) => {
                const slide = instance.slides[index];
                this.updateSlide(slide);
            });
        });

        //keyboard
        if(keyboard && instance.root) {
            document.addEventListener("keydown", (e) => {
                const keyCode = e.keyCode || e.which;

                // Backspace and Esc keys
                if (keyCode === 8 || keyCode === 27) {
                    e.preventDefault();

                    instance.vm.$parent._close();

                    return;
                }

                // Left arrow and Up arrow
                if (keyCode === 37 || keyCode === 38) {
                    e.preventDefault();

                    instance.vm.$parent._previous();

                    return;
                }

                // Right arrow and Down arrow
                if (keyCode === 39 || keyCode === 40) {
                    e.preventDefault();

                    instance.vm.$parent._next();

                    return;
                }
            });
        }

        //wheel
        if(wheel && instance.root) {
            ["mousewheel", "DOMMouseScroll", "wheel", "MozMousePixelScroll"].forEach((item) => {
                instance.root.addEventListener(item, (e) => {
                    let currTime = new Date().getTime(),
                        pos = this.currentIndex;

                    if (instance.group.length < 2) {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();

                    if (currTime - prevTime < 250) {
                        return;
                    }
                    prevTime = currTime;

                    instance.vm.$parent[(-e.deltaY || -e.deltaX || e.wheelDelta || -e.detail) < 0 ? "_next" : "_previous"]();
                });
            });
        }
    },

    // 切换
    swipe(pos) {
        var self = this.data;

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

        let maxWidth = parseInt(self.opts.width, 10),
            maxHeight = parseInt(self.opts.height, 10);

        // Sets the default values from the image
        slide.width = imgWidth;
        slide.height = imgHeight;

        if (maxWidth > 0) {
            slide.width = maxWidth;
            slide.height = Math.floor((maxWidth * imgHeight) / imgWidth);
        }

        if (maxHeight > 0) {
            slide.width = Math.floor((maxHeight * imgWidth) / imgHeight);
            slide.height = maxHeight;
        }
    },

    afterLoad(slide) {
        slide.isLoading = false;
        slide.isLoaded = true;

        this.hideLoading(slide);

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
        var self = this.data;

        let $content = slide.$content,
            width = slide.width || self.opts.width,
            height = slide.height || self.opts.height;

        // TODO First, prevent caption overlap, if needed
        // ...

        // Then resize content to fit inside the slide
        if ($content && (width || height)) {
            this.setTranslate($content, this.getFitPos(slide));
        }
    },

    getFitPos(slide) {
        var self = this.data;

        let $content = slide.$content,
            width = slide.width || self.opts.width,
            height = slide.height || self.opts.height,
            maxWidth,
            maxHeight,
            minRatio,
            aspectRatio,
            rez = {};

        if (!slide.isLoaded || !$content) {
            return false;
        }

        maxWidth = this.getTranslate(self.root).width;
        maxHeight = this.getTranslate(self.root).height;

        if (!width || !height) {
            width = maxWidth;
            height = maxHeight;
        }

        minRatio = Math.min(1, maxWidth / width, maxHeight / height);
        width = minRatio * width;
        height = minRatio * height;

        // Adjust width/height to precisely fit into container
        if (width > maxWidth - 0.5) {
            width = maxWidth;
        }

        if (height > maxHeight - 0.5) {
            height = maxHeight;
        }

        rez.top = Math.floor((maxHeight - height) * 0.5);
        rez.left = Math.floor((maxWidth - width) * 0.5);

        rez.width = width;
        rez.height = height;

        return rez;
    },

    setTranslate($el, props) {
        let str = "";

        if (!$el || !props) {
            return;
        }

        if (props.left !== undefined || props.top !== undefined) {
            str = `${props.left === undefined ? $el.position().left : props.left}px, ${props.top === undefined ? $el.position().top : props.top}px`;
            str = `translate(${str})`;
        }
        if (props.scaleX !== undefined && props.scaleY !== undefined) {
            str += `scale(${props.scaleX}, ${props.scaleY})`;
        } else if (props.scaleX !== undefined) {
            str += `scale(${props.scaleX})`;
        }
        if (props.rotate !== undefined) {
            str += `rotate(${props.rotate}deg)`;
        }

        if (str.length) {
            $el.style.transform = str;
        }

        if (props.width !== undefined) {
            $el.style.width = `${props.width}px`;
        }

        if (props.height !== undefined) {
            $el.style.height = `${props.height}px`;
        }

        return $el;
    },

    getTranslate($el) {
        let domRect;
        if (!$el) {
            return false;
        }

        // 注意宽高的问题
        domRect = $el.getBoundingClientRect();
        return {
            top: domRect.top || 0,
            left: domRect.left || 0,
            width: domRect.width,
            height: domRect.height,
        };
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------//
    // Add Some Event Handler...
    // onScale(ratio) {
    //     var self = this.data;
    //     this.stop();
    //     // 缓存，记忆
    //     self.ratio = ratio;
    //
    //     let current = self.current,
    //         $slide = current.$slide,
    //         $content = current.$content;
    //
    //     if(!current.isLoaded || !$content) {
    //         return;
    //     }
    //     $slide.classList.add("slide-is--scaling");
    //
    //     this.setTransformMatrix($content);
    // },
    // onRotate(degree) {
    //     var self = this.data;
    //     this.stop();
    //     // 缓存，记忆
    //     self.degree = degree;
    //
    //     let current = self.current,
    //         $slide = current.$slide,
    //         $content = current.$content;
    //
    //     if(!current.isLoaded || !$content) {
    //         return;
    //     }
    //
    //     $slide.classList.add("slide-is--rotating");
    //
    //     this.setTransformMatrix($content);
    // },
    //
    // setTransformMatrix($el) {
    //     let self = this.data,
    //         posX,
    //         posY,
    //         ratio = self.ratio || 1,
    //         degree = self.degree || 0;
    //
    //     if (self.ratio !== 1 && !self.degree) {
    //         self.isDrag = true;
    //     }
    //
    //     // matrix(1, 0, 0, 1, x, y)
    //     let matrix = document.defaultView.getComputedStyle($el, null).transform;
    //     let result = matrix.replace(/[^0-9e.\-,]/g,'').split(',');
    //
    //     posX = result[4];
    //     posY = result[5];
    //
    //     this.setTranslate($el, {
    //         left: posX,
    //         top: posY,
    //         scaleX: ratio,
    //         scaleY: ratio,
    //         rotate: degree,
    //     })
    // },
    //
    // stop() {
    //     var self = this.data;
    //     if(self.current && self.current.$slide) {
    //         self.current.$slide.classList.remove("slide-is--scaling", "slide-is--rotating")
    //     }
    // },
};

//--------------------------------------------------------------------------------------------------------------------------//
//TODO Guestures
function Guestures() {}

Guestures.prototype.ontouchstart = (e) => {};
Guestures.prototype.ontouchmove = (e) => {};
Guestures.prototype.ontouchend = (e) => {};

Guestures.prototype.onSwipe = (e) => {};
Guestures.prototype.endSwiping = (e) => {};

Guestures.prototype.onPan = (e) => {};
Guestures.prototype.endPanning = (e) => {};

Guestures.prototype.onZoom = (e) => {};
Guestures.prototype.endZooming = (e) => {};

Guestures.prototype.limitMovement = (e) => {};
Guestures.prototype.limitPosition = (e) => {};

//--------------------------------------------------------------------------------------------------------------------------//
/**
 * TODO 将 HTML 字符串解析为对应的 DOM
 */
function _parseHtml(htmlString) {
    let tempDOM = document.createElement('DIV');
    tempDOM.innerHTML = htmlString;

    return tempDOM.childNodes[0];
}

/**
 * TODO 扩展一个对象的属性或方法
 */
function _extend() {
    /**
     * @variable target 被扩展的对象
     * @variable length 参数的数量
     * @variable deep   是否深度操作
     */
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // 根据参数选择采用浅复制 or 深复制
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};

        // 将 i 赋值为2，跳过前两个参数
        i = 2;
    }
    if (length === i) {
        --i;
        return
    }
    // target 不是对象则把 target 设置为空对象。
    if (typeof target !== "object") {
        target = {};
    }

    // 开始遍历需要被扩展到 target 上的参数
    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];

                if (target === copy) {
                    continue;
                }

                // 当用户想要深度操作时，递归合并
                if (deep && copy && (_isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    // 如果是数组
                    if (copyIsArray) {
                        // 将 copyIsArray 重置为 false，为下次遍历做准备
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && _isPlainObject(src) ? src : {};
                    }
                    // 递归调用 extend 方法，继续进行深度遍历
                    target[name] = _extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // 原对象被改变，因此如果不想改变原对象，target 可传入 {}
    return target;
}

/**
 * TODO 通过字面量方式或者 new Object() 方式创建的对象，经检测将返回 true
 */
function _isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;

    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }

    return Object.getPrototypeOf(obj) === proto;
}

/**
 * TODO 判断是否是一个空对象
 */
function _isEmptyObject(obj) {
    for (var key in obj) {
        return false
    }
    return true
}

export default stage;