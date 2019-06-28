import {_parseHtml, _extend, _isPlainObject, _isEmptyObject, _isFunction, _isNumeric, setEventListener} from "./tools.js"

export const Guestures = function (instance) {

    // Initial Guestures and set EventListener
    this.init = (stage) => {
        var THIS = this;

        this.instance = stage;
        this.root = stage.data.root;

        // add touchstart/mousedown event handler...
        ["mousedown"].forEach((item) => {
            THIS.root.addEventListener(item, THIS.ontouchstart.bind(THIS));
        });
    };

    this.ontouchstart = (e) => {
        var THIS = this,
            instance = THIS.instance,
            data = instance.data,
            current = data.current;

        // 忽略右键点击
        if (e.button === 2) return;

        // Check if element is scrollable and try to prevent default behavior (scrolling)
        if (!(THIS.isMobile && THIS.isScrollable)) {
            e.preventDefault();
        }

        THIS.realPoints = THIS.startPoints = THIS.getPointerXY(e);

        if (!THIS.startPoints.length) return;

        THIS.$content = current.$content;

        THIS.isPanning = false;
        THIS.isSwiping = false;
        THIS.canDrag = THIS.instance._canDragging();

        //THIS.startTime = new Date().getTime();
        THIS.distanceX = THIS.distanceY = THIS.distance = 0;

        THIS.canvasWidth = Math.round(THIS.root.clientWidth);
        THIS.canvasHeight = Math.round(THIS.root.clientHeight);

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
                THIS.onSwipe();
            } else if (THIS.isPanning) {
                THIS.onPan();
            }
        }
    };

    this.ontouchend = (e) => {
        var THIS = this;

        ["mousemove", "mouseup", "mouseleave"].forEach((item) => {
            THIS[item].destroy();
        });
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
            THIS.setTranslate(THIS.$content, THIS.contentLastPos);
        });
    };
    this.endPanning = () => {};


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
    var THIS = this;

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

    if (currentWidth > canvasWidth) {
        newOffsetX = currentOffsetX + distanceX;
    } else {
        newOffsetX = currentOffsetX;
    }

    newOffsetY = currentOffsetY + distanceY;

    // 按形成距离等比例减速
    minTranslateX = Math.max(0, canvasWidth * 0.5 - currentWidth * 0.5);
    minTranslateY = Math.max(0, canvasHeight * 0.5 - currentHeight * 0.5);

    maxTranslateX = Math.min(canvasWidth - currentWidth, canvasWidth * 0.5 - currentWidth * 0.5);
    maxTranslateY = Math.min(canvasHeight - currentHeight, canvasHeight * 0.5 - currentHeight * 0.5);

    //  👉
    if (distanceX > 0 && newOffsetX > minTranslateX) {
        newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
    }

    //  👈
    if (distanceX < 0 && newOffsetX < maxTranslateX) {
        newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
    }

    //  👇
    if (distanceY > 0 && newOffsetY > minTranslateY) {
        newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
    }

    //  👆
    if (distanceY < 0 && newOffsetY < maxTranslateY) {
        newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, 0.8) || 0;
    }

    return {
        top: newOffsetY,
        left: newOffsetX
    };
};
Guestures.prototype.limitPosition = function (newOffsetX, newOffsetY, newWidth, newHeight) {
    var THIS = this;

    var canvasWidth = THIS.canvasWidth;
    var canvasHeight = THIS.canvasHeight;

    if (newWidth > canvasWidth) {
        newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
        newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
    } else {
        // 水平居中
        newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);
    }

    if (newHeight > canvasHeight) {
        newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
        newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
    } else {
        // 垂直居中
        newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);
    }

    return {
        top: newOffsetY,
        left: newOffsetX
    };
};

