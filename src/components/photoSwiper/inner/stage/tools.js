/**
 * TODO 将 HTML 字符串解析为对应的 DOM
 */
export function _parseHtml(htmlString) {
    let tempDOM = document.createElement('DIV');
    tempDOM.innerHTML = htmlString;

    return tempDOM.childNodes[0];
}

/**
 * TODO 扩展一个对象的属性或方法
 */
export function _extend() {
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
export function _isPlainObject(obj) {
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
export function _isEmptyObject(obj) {
    for (var key in obj) {
        return false
    }
    return true
}

/**
 * TODO 判断是否是一个函数
 */
export function _isFunction(obj) {
    return obj && typeof obj === 'function'
}

/**
 * TODO 判断一个值是否可以作为数字使用
 */
export function _isNumeric(value, useStringAsNumber = true) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return true;
    }

    return useStringAsNumber && typeof value === 'string' && value !== '' && !isNaN(value - 0);
}

/**
 * TODO 处理事件句柄为匿名函数时无法移除监听的问题
 */
export function setEventListener(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('缺少参数');
    }

    if (!_isFunction(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (target !== undefined && target instanceof HTMLElement && target.nodeType === 1) {
        return listenNode(target, type, callback);
    }

    throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
}

function listenNode(node, type, callback) {
    node.addEventListener(type, callback);
    return {
        destroy() {
            node.removeEventListener(type, callback);
        },
    };
}
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, node => {
        node.addEventListener(type, callback);
    });

    return {
        destroy() {
            Array.prototype.forEach.call(nodeList, node => {
                node.removeEventListener(type, callback);
            });
        },
    };
}
