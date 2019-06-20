const stage = {
    builder: null,

    // 初始化
    _init(currIndex, root, group, opts) {
        this.builder = new this._builder();

        this.builder.currIndex = currIndex;
        this.builder.root = root;
        this.builder.group = group;
        this.builder.opts = opts;

        this.builder.isOpen = true;
        this.builder.swipe(currIndex);
    },

    _swipe(pos) {
        if (this.builder) {
            this.builder.swipe(pos);
        }
    },

    _builder: function() {
        this.isOpen = false;
        this.slides = {};

        // 切换
        this.swipe = (pos) => {
            if (!this.isOpen) {
                return false;
            }

            // execute...
            const groupLen = this.group.length;
            let current, loop, previous;

            pos = parseInt(pos, 10);
            if (!loop && (pos < 0 || pos >= groupLen)) {
                return false;
            }

            const firstRun = !Object.keys(this.slides).length;

            // Create slides
            previous = this.current;
            this.prevIndex = this.currIndex;
            this.prevPos = this.currPos;

            current = this.createSlide(pos);
            // Should loop?
            if (groupLen > 1) {
                if (loop || current.index < groupLen - 1) {
                    this.createSlide(pos + 1);
                }
                if (loop || current.index > 0) {
                    this.createSlide(pos - 1);
                }
            }

            this.current = current;
            this.currIndex = current.index;
            this.currPos = current.pos;

            // Make sure current slide is visible
            current.$slide.classList.add("stage-slide--current");

            if(firstRun) {
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
        };

        this.createSlide = (pos) => {
            let $slide, index;

            index = pos % this.group.length;
            index = index < 0 ? this.group.length + index : index;

            if (!this.slides[pos] && this.group[index]) {
                $slide = _parseHtml('<div class="stage-slide"></div>');
                this.root.appendChild($slide);

                this.slides[pos] = _extend(true, {}, this.group[index], {
                    index: pos,
                    pos: pos,
                    $slide: $slide,
                    isLoaded: false
                });

                //this.updateSlide(this.slides[pos]);
            }

            return this.slides[pos];
        };

        this.loadSlide = (slide) => {
            if (slide.isLoading || slide.isLoaded) {
                return;
            }
            slide.isLoading = true;

            this.setImage(slide);
        };

        this.setImage = (slide) => {
            let $ghost, $content;

            // Check if need to show loading icon
            setTimeout(() => {
                const $img = slide.$image;

                if (this.isOpen && slide.isLoading && !$img.complete) {
                    this.showLoading(slide);
                }
            }, 50);

            // This will be wrapper containing both ghost and actual image
            $content = _parseHtml('<div class="slide-content"></div>');
            slide.$slide.appendChild($content);
            slide.$content = $content;

            this.setBigImage(slide);
        };

        this.setBigImage = (slide) => {
            const $img = document.createElement("img");

            $img.onload = () => {
                this.afterLoad(slide);
            };

            $img.setAttribute("src", slide.src);
            slide.$content.appendChild($img);

            slide.$image = $img;
        };

        this.preload = () => {
            let prev, next;

            if (this.opts.preload && this.group.length < 2) {
                return;
            }
            next = this.slides[this.currPos + 1];
            prev = this.slides[this.currPos - 1];

            if (prev) {
                this.loadSlide(prev);
            }
            if (next) {
                this.loadSlide(next);
            }
        };

        this.showLoading = (slide) => {
            slide = slide || this.current;

            if (slide && !slide.$spinner) {
                const $spinner = _parseHtml('<div class="loading"></div>');
                $spinner.style.display = "block";
                $spinner.style.opacity = "1";
                slide.$slide.appendChild($spinner);

                slide.$spinner = $spinner;
            }
        };

        this.hideLoading = (slide) => {
            slide = slide || self.current;

            if (slide && slide.$spinner) {
                slide.$spinner.remove();

                delete slide.$spinner;
            }
        };

        this.afterLoad = (slide) => {
            slide.isLoading = false;
            slide.isLoaded = true;

            this.hideLoading(slide);

            this.revealContent(slide);
        };

        this.revealContent = (slide) => {
            let $slide = slide.$slide,
                start,
                end,
                effect,
                effectClassName,
                duration;

            effect = this.opts.transitionEffect;
            duration = this.opts.transitionDuration;

            if (slide.pos !== this.currPos || !duration) {
                effect = false;
            }

            if (!effect) {
                if (slide.pos === this.currPos) {
                    this.complete();
                }
                return;
            }

            this.complete();
        };

        this.complete = () => {
            let current = this.current,
                slides = {},
                $el;

            if (!current.isLoaded) {
                return;
            }
            if (!current.isComplete) {
                current.isComplete = true;
            }

            Object.keys(this.slides).forEach((index) => {
                const slide = this.slides[index];
                if (slide.pos >= this.currPos - 1 && slide.pos <= this.currPos + 1) {
                    slides[slide.pos] = slide;
                } else if (slide) {
                    slide.$slide.remove();
                }
            });

            this.slides = slides;
        };
    },
};

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
    for ( ; i < length; i++ ) {
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

export default stage;