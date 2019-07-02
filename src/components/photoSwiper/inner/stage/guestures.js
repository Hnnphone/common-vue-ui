import {_parseHtml, _extend, _isPlainObject, _isEmptyObject, _isFunction, _isNumeric, setEventListener} from "./tools.js"

export const Guestures = function (instance) {

    // Initial Guestures and set EventListener
    this.init = (stage) => {
        var THIS = this;

        THIS.instance = stage;
        THIS.root = stage.data.root;

        // add touchstart/mousedown event handler...
        ["mousedown"].forEach((item) => {
            THIS.root.addEventListener(item, THIS.ontouchstart.bind(THIS));
        });
    };

    this.ontouchstart = (e) => {
        var THIS = this,
            instance = THIS.instance,
            root = THIS.root,
            data = instance.data,
            current = data.current,
            $slide = current.$slide,
            $content = current.$content;

        // 忽略右键点击
        if (e.button === 2) return;

        // Check if element is scrollable and try to prevent default behavior (scrolling)
        if (!(THIS.isMobile && THIS.isScrollable)) {
            e.preventDefault();
        }

        THIS.realPoints = THIS.startPoints = THIS.getPointerXY(e);

        if (!THIS.startPoints.length) return;

        THIS.$content = $content;
        THIS.opts = data.opts.touch;

        THIS.isPanning = false;
        THIS.isSwiping = false;
        THIS.canDrag = THIS.instance._canDragging();

        THIS.startTime = new Date().getTime();
        THIS.distanceX = THIS.distanceY = THIS.distance = 0;

        THIS.canvasWidth = Math.round(THIS.root.clientWidth);
        THIS.canvasHeight = Math.round(THIS.root.clientHeight);

        THIS.contentLastPos = null;
        THIS.contentStartPos = THIS.instance.getTranslate($content) || {
            top: 0,
            left: 0
        };

        if ($content.isInvert) {
            THIS.realLeft = parseFloat(THIS.$content.style.left);
            THIS.realTop = parseFloat(THIS.$content.style.top);
        }

        THIS.sliderStartPos = THIS.instance.getTranslate($slide);
        THIS.stagePos = THIS.instance.getTranslate(root);

        THIS.sliderStartPos.top -= THIS.stagePos.top;
        THIS.sliderStartPos.left -= THIS.stagePos.left;

        THIS.contentStartPos.top -= THIS.stagePos.top;
        THIS.contentStartPos.left -= THIS.stagePos.left;

        // One finger or mouse click - swipe or pan an image
        if (THIS.startPoints.length === 1) {
            if (THIS.canDrag) {
                THIS.isPanning = true;
            } else {
                THIS.isSwiping = true;
            }

            THIS.root.classList.add("stage-is-grabbing");
        }

        // TODO Two fingers - zoom image
        if (THIS.startPoints.length === 2) {}

        ["mousemove"].forEach((item) => {
            THIS[item] = setEventListener(THIS.root, item, THIS.ontouchmove.bind(THIS));
        });
        ["mouseup", "mouseleave"].forEach((item) => {
            THIS[item] = setEventListener(THIS.root, item, THIS.ontouchend.bind(THIS));
        });
    };

    this.ontouchmove = (e) => {
        var THIS = this;

        THIS.newPoints = THIS.getPointerXY(e);

        if (!(THIS.isSwiping && THIS.isSwiping === true)) {
            e.preventDefault();
        }

        THIS.distanceX = THIS.getDistance(THIS.newPoints[0], THIS.startPoints[0], "x");
        THIS.distanceY = THIS.getDistance(THIS.newPoints[0], THIS.startPoints[0], "y");

        THIS.distance  = THIS.getDistance(THIS.newPoints[0], THIS.startPoints[0]);

        // Skip false ontouchmove events (Chrome)
        if (THIS.distance > 0) {
            if (THIS.isSwiping) {
                //THIS.onSwipe();
            } else if (THIS.isPanning) {
                THIS.onPan();
            }
        }
    };

    this.ontouchend = (e) => {
        var THIS = this,
            swiping = THIS.isSwiping,
            panning = THIS.isPanning;

        THIS.endPoints = THIS.getPointerXY(e);
        THIS.dMs = Math.max(new Date().getTime() - THIS.startTime, 1);

        THIS.root.classList.remove("stage-is-grabbing");

        if (THIS.requestId) {
            window.cancelAnimationFrame(THIS.requestId);
            THIS.requestId = null;
        }

        THIS.isSwiping = false;
        THIS.isPanning = false;
        THIS.instance.isDragging = false;

        // Speed in px/ms
        THIS.velocityX = (THIS.distanceX / THIS.dMs) * 0.5;
        THIS.velocityY = (THIS.distanceY / THIS.dMs) * 0.5;

        if (swiping) {
            THIS.endSwiping();
        } else if (panning) {
            THIS.endPanning();
        }

        ["mousemove", "mouseup", "mouseleave"].forEach((item) => {
            THIS[item].destroy();
        });

        return;
    };

    this.onSwipe = () => {};
    this.endSwiping = () => {};

    this.onPan = () => {
        var THIS = this;

        // 处理意外滑动，pc = 5, mobile = 10
        if (THIS.getDistance(THIS.newPoints[0], THIS.realPoints[0]) < 5) {
            THIS.startPoints = THIS.newPoints;
            return;
        }

        THIS.contentLastPos = THIS.limitMovement();

        // 下一次 FPS 刷新时更新 pos
        if (THIS.requestId) {
            window.cancelAnimationFrame(THIS.requestId);
        }
        THIS.requestId = requestAnimationFrame(() => {
            THIS.instance.setTranslate(THIS.$content, {
                top: THIS.contentLastPos.top,
                left: THIS.contentLastPos.left,
                rotate: THIS.$content.rotateAngel
            });
        });
    };
    this.endPanning = () => {
        var THIS = this,
            newOffsetX,
            newOffsetY,
            newPos;
        
        if (!THIS.contentLastPos) return;

        if (THIS.opts.momentum === false || THIS.dMs > 350) {
            newOffsetX = THIS.contentLastPos.left;
            newOffsetY = THIS.contentLastPos.top;
        } else {
            // Continue movement
            newOffsetX = THIS.contentLastPos.left + THIS.velocityX * 500;
            newOffsetY = THIS.contentLastPos.top + THIS.velocityY * 500;
        }

        newPos = THIS.limitPosition(newOffsetX, newOffsetY, THIS.contentStartPos.width, THIS.contentStartPos.height);

        newPos.width = THIS.contentStartPos.width;
        newPos.height = THIS.contentStartPos.height;

        THIS.instance.animate(THIS.$content, newPos);
    };

    this.init(instance);
};

// 获取坐标点及滑动距离
Guestures.prototype.getPointerXY = function(e) {
    var result = [];

    e = e || window.e;
    e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];

    for (var key in e) {
        if (e[key].pageX) {
            result.push({
                x: e[key].pageX,
                y: e[key].pageY
            });
        } else if (e[key].clientX) {
            result.push({
                x: e[key].clientX,
                y: e[key].clientY
            });
        }
    }
    return result;
};
Guestures.prototype.getDistance = function (point2, point1, what) {
    if (!point1 || !point2) {
        return 0;
    }

    if (what === "x") {
        return point2.x - point1.x;
    } else if (what === "y") {
        return point2.y - point1.y;
    }

    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// 拖拽边界的处理
Guestures.prototype.limitMovement = function () {
    var THIS = this,
        isInvert = THIS.$content.isInvert;

    var canvasWidth = THIS.canvasWidth;
    var canvasHeight = THIS.canvasHeight;

    var distanceX = THIS.distanceX;
    var distanceY = THIS.distanceY;

    var contentStartPos = THIS.contentStartPos;

    var currentOffsetX = contentStartPos.left;
    var currentOffsetY = contentStartPos.top;

    var currentWidth = contentStartPos.width;
    var currentHeight = contentStartPos.height;

    var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY, newOffsetX, newOffsetY;

    // Slow down proportionally to traveled distance
    minTranslateX = Math.max(0, canvasWidth * 0.5 - currentWidth * 0.5);
    minTranslateY = Math.max(0, canvasHeight * 0.5 - currentHeight * 0.5);

    maxTranslateX = Math.min(canvasWidth - currentWidth, canvasWidth * 0.5 - currentWidth * 0.5);
    maxTranslateY = Math.min(canvasHeight - currentHeight, canvasHeight * 0.5 - currentHeight * 0.5);

    // 反转状态下
    if (isInvert) {
        var realLeft = THIS.realLeft;
        var realTop = THIS.realTop;

        THIS.minX = minTranslateX = -currentOffsetX + realLeft;
        THIS.minY = minTranslateY = -currentOffsetY + realTop;

        THIS.maxX = maxTranslateX = currentOffsetX + realLeft;
        THIS.maxY = maxTranslateY = currentOffsetY + realTop;

        currentOffsetX = realLeft;
        currentOffsetY = realTop;
    }

    if (currentWidth > canvasWidth) {
        newOffsetX = currentOffsetX + distanceX;
    } else {
        distanceX = 0;
        newOffsetX = currentOffsetX;
    }

    newOffsetY = currentOffsetY + distanceY;

    //  👉
    if (distanceX > 0 && newOffsetX > minTranslateX + 0.5) {
        newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
    }

    //  👈
    if (distanceX < 0 && newOffsetX < maxTranslateX - 0.5) {
        newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
    }

    //  👇
    if (distanceY > 0 && newOffsetY > minTranslateY + 0.5) {
        newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
    }

    //  👆
    if (distanceY < 0 && newOffsetY < maxTranslateY - 0.5) {
        newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, 0.8) || 0;
    }

    return {
        top: newOffsetY,
        left: newOffsetX
    };
};
Guestures.prototype.limitPosition = function (newOffsetX, newOffsetY, newWidth, newHeight) {
    var THIS = this,
        isInvert = THIS.$content.isInvert;

    var canvasWidth = THIS.canvasWidth;
    var canvasHeight = THIS.canvasHeight;

    var minX = THIS.minX,
        minY = THIS.minY,
        maxX = THIS.maxX,
        maxY = THIS.maxY;

    if (newWidth > canvasWidth && !isInvert) {
        newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
        newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
    } else if (isInvert) {
        // 反转状态
        newOffsetX = newOffsetX > minX ? minX : newOffsetX;
        newOffsetX = newOffsetX < maxX ? maxX : newOffsetX;

        if (newWidth <= canvasWidth) {
            newOffsetX = THIS.realLeft;
        }
    } else {
        // 水平居中
        newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);
    }

    if (newHeight > canvasHeight && !isInvert) {
        newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
        newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
    } else if (isInvert) {
        // 反转状态
        newOffsetY = newOffsetY > minY ? minY : newOffsetY;
        newOffsetY = newOffsetY < maxY ? maxY : newOffsetY;

        if (newHeight <= canvasHeight) {
            newOffsetY = THIS.realTop;
        }
    } else {
        // 垂直居中
        newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);
    }

    return {
        translateY: newOffsetY,
        translateX: newOffsetX
    };
};

