---
typora-root-url: res\assets
---



## SVG 相关知识总结



### 一、SVG 简介

#### (一)、 svg 简介

##### 1.1 svg 是什么？

答：一种使用 XML 规范描述的矢量文件。它是由 W3C 联盟进行开发的，严格来说是一种开放标准的图形语言。如果拿它和 HTML 比较的话，你可以认为 svg 面向图形，而 HTML 面向文本。

svg [标准指南参考](https://www.w3.org/TR/SVG11/)

svg [的浏览器支持情况](http://caniuse.com/#cats=SVG)
	**√** IE 9+
	**√** Chrome 33.0+
	**√** Firefox 28.0+
	**√** Safari 7.0+



##### 1.2 矢量图和位图

- 位图：基于颜色的描述，如 bmp、png、jpg、gif 等

- 矢量图：基于数学的描述，如 svg、ai 等

  

##### 1.3 简单示例

```html
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
	<!--Face-->
    <circle cx="100" cy="100" r="90" fill="#39F" />
    <!--Eyes-->
    <circle cx="70"  cy="80"  r="20" fill="white" />
    <circle cx="130" cy="80"  r="20" fill="white" />
    <circle cx="65"  cy="75"  r="10" fill="black" />
    <circle cx="125" cy="75"  r="10" fill="black" />
    <!--Smile-->
    <path d="M 50 140 A 60 60 0 0 0 150 140" stroke="white" stroke-width="3" fill="none" />
</svg>
```

**使用方式：**

- 作为一种文件格式可直接使用浏览器打开
- 作为 DOM 元素可直接使用 svg 标签，且能被 HTML 正确解析
- 作为图片可通过 img 标签引用（base64？image/svg+xml）
- 当然，也可以通过 CSS 背景图像引用



那么问题来了，你们知道 canvas 所绘制的图像是位图还是矢量图呢？


**如何处理？**

```javascript
function setSize(width, height) {
    if (window.devicePixelRatio > 1) {
        var scaleBy = window.devicePixelRatio;
        canvas.style.width  = width  + 'px';
        canvas.style.height = height + 'px';
        
        canvas.width  = width  * scaleBy;
        canvas.height = height * scaleBy;
        this.ctx.scale(scaleBy, scaleBy);
    }
}
```



#### (二)、 svg 的基本图形和属性

##### 2.1 基本图形

- \<rect>

- \<circle>

- \<ellipse>

- \<line>

- \<polyline>

- \<polygon>

  

##### 2.2 基本属性

- fill
- stroke
- stroke-width
- transform



了解了这些，我们现在再回到上面的示例，分析代码所表示的含义...



#### (三)、 svg 基本操作 API

##### 3.1 创建图形

```javascript
document.createElementNS(namespace, tagName);
```



##### 3.2 添加图形

```javascript
element.appendChild(childEle);
```



##### 3.3 设置/获取属性

```javascript
element.setAttribute(name, value);
element.getAttribute(name);
```



### 二、SVG 坐标系统

#### (一)、svg 中的世界、视窗和视野

##### 1.1 世界与视野

> 世界是无穷大的，
>
> 视野是观察世界的一个矩形区域

如下图所示，



2D 绘图中很多人会有一个误区，就是我绘图的区域是一个矩形区域。无论新建一个画布还是创建了一个容器，心里都想象里面有一个矩形区域。其实，在 svg 当中，矩形区域只是视野，是我们看到的部分。实际上你能绘制的区域是一个无穷大的世界。

**世界是客观地**，只要定义了世界的内容，那么内容就是确定的。**视野是主观地**，大部分绘图 API 都提供视野的控制方法，在 svg 中，`Viewbox` 属性就是用来控制所谓的视野的。如下图，



在 svg 当中，里面的内容就是对 svg 世界的定义，这个 svg 文件里面有多少个矩形、多少条曲线，在哪里？什么颜色？...，都是在定义世界。而视野，也就是观看世界的矩形区域是哪一个，则使用 `viewBox` 和 `preserveAspectRatio` 属性进行控制的。

```html
<svg xmlns="..."
     width="800" height="600"
     viewBox="0 0 400 300"
     preserveAspectRatio="xMidYMid meet"> <!--保持纵横比-->
	<!--SVG Content-->
</svg>
```



##### 1.2 视窗

在 svg 标签当中还可以指定一个 `width` 和 `height` 的属性，来表示 svg 文件渲染的区域大小，这个大小也可以使用样式表来定义。这个区域大小，我们称之为**视窗**。**视窗**实际上就是浏览器开辟出来用于渲染 svg 内容的一个区域。

在理想情况下，视窗和视野有一样的尺寸，那么浏览器就可以把视野完美地填充到视窗内。可是如果视窗和视野的大小不一致，就存在如何控制这个填充的问题，填充的策略使用 `preserveAspectRatio` 进行指定。

如果你不能很好地理解视窗和视野两者之间的关系，那么你也可以参考在绘制 HTML5 canvas 时，我们对 `canvas.style.width` 和 `canvas.width` 分别设置的处理。



**备注**：svg 内的所有图形在指定长度单位时并非是 px，而是以视野 viewBox 作为参考的，具体一个数值等价于多少个像素数取决于视野默认缩放后与视窗的单位换算。举个例子，

```html
<svg width="800" height="600"
     viewBox="0 0 400 300"
     preserveAspectRatio="xMidYMid meet"> <!--默认-->
    
    <!-- 此时 cx:200 * 800/400 = 400px，cy:150 * 600/300 = 300px，r:150 * 800/400 = 300px -->
    <circle cx="200" cy="150" r="150" fill="springgreen"></circle>
</svg>
```

!! 规则一定是**先填充，后换算。**



#### (二)、图形分组

##### 2.1 锤子的故事

下面我给大家讲一个 **“锤子”** 的故事，故事的开始是这样的...

“
	从前有一个画家，
	他很擅长画锤子，
	先画一个矩形作为锤头，再画一个矩形作为手柄，大功告成。

​	由于种种原因，在某一天他改行当程序员了，
​	老板知道他是画垂直出生的，就说，
​	‘你用程序画一个锤子把。’

​	太简单了，
​	画家提前把本系列文章学习了，于是他算好坐标，上来就使用 svg 干了两个矩形出来。
​	一切看起来都是美好的~~

​	老板又说，
​	‘锤子往右挪 50 像素吧’

​	没问题
​	他把两个矩形的 x 坐标都加了 50，修改了两个矩形标签的 x 值，大功告成。

​	老板还不满意，
​	‘我想要一把绿色的锤子’

​	没问题 2
​	他又把两个矩形的 stroke 属性修改为 green
”



**Template Code**

```html
<svg xmlns="http://www.w3.org/2000/svg">
	<rect x="50" y="50"
          width="100" height="50"
          stroke="red" fill="none">
	</rect>
	<rect x="90" y="100"
          width="20" height="120"
          stroke="red" fill="none">
	</rect>
</svg
```



大家思考一下，真的没有问题吗？老板这次是让画的锤子，那么假如说某天它让画家画一把瑞士军刀，怎么办？

其实，无论是锤子也好，小米也好，瑞士军刀抑或苹果也好，老板都只是要针对图形的整体进行修改，而不是修改其细节。既然逻辑上它们是一个整体，那么，在代码里也应该是有一个整体的概念。有了**整体的概念**，就可以有**整体的操作**。



##### 2.2 图形分组

图形分组主要包含了以下几个概念：

- 使用 `<g>` 标签来创建分组
- 分组具有属性继承性
- 使用 `transform` 属性可以定义坐标变换
- 分组可以嵌套



还是拿充满情怀的锤子来说，画家修改了一下上面的代码，用一个 `<g>` 标签把两个锤子包起来了。然后，把描边和填充属性设置在 `<g>` 标签上。现在，这个代表了锤子的 `<g>` 标签就可以作为一个整体进行操作。

现在，画家紧张地给锤子加了一个 `transform` 属性，锤子往下挪了！哟西！看来成功了。咦？你们有没有注意到这张图里出现了两个坐标系？咳咳，本章重点来了，接下来，让我们开始学习坐标系统！！



#### (三)、坐标系统概述

##### 3.1 笛卡尔直角坐标系

> svg 使用的坐标系统是笛卡尔直角坐标系，但略有不同。



##### 3.2 原点

坐标系统的作用是为图形提供统一的定位基准，为了做到这点，笛卡尔直角坐标系定义了包括一个原点以及两条相互垂直的数轴。基于原点和数轴的定义，又可衍生出角度的含义。

如下图所示，

![](/../../assets/001.png)



##### 3.3 互相垂直的两条数轴

在数学上，`x` 轴水平向右，`y` 轴竖直向上，这是我们所周知的概念。

而相应的，角度的扫描方向，也就是正角的方向，是逆时针的。

![](/../../assets/002.png)



##### 3.4 角度定义

但是由于 svg 的阅读媒介一般是屏幕，出于对人类阅读习惯的考虑，大多数屏幕上使用的笛卡尔坐标系都是 `y` 轴朝下的。这种情况下，角度的正方向是顺时针方向。其实角度的方向在笛卡尔坐标系中是有统一描述的，就是从 `x` 轴正方向到 `y` 轴正方向的直角旋转方向为正方向。

![](/../../assets/003.png)



#### (四)、四个坐标系

在 svg 中，共存在四个坐标系。分别叫`用户坐标系`、`自身坐标系`、`前驱坐标系`以及`参考坐标系`。



##### 4.1 用户坐标系

前面我们说 svg 的世界是无限大的，世界有一个坐标系，这个坐标系就是用户坐标系。我们之前设置的 `viewbox`，也就是视野的大小，说白了就是指观察用户坐标系中的哪个区域。比如说，现在设置 `viewbox` 为 `(0, 0, 200, 150)` 。如下所示 👇

![](/../../assets/004.png)

![](/../../assets/005.png)



用户坐标系是最原始的坐标系，其它产生的坐标系都从用户坐标系开始，所以用户坐标系也可以称之为原始坐标系。



##### 4.2 自身坐标系

什么是自身坐标系呢？自身坐标系就是每个图形或者是分组与生俱来的一个坐标系。假设，我们现在绘制了一个矩形，那么这个矩形就会自身带着一个坐标系，成为这个矩形的自身坐标系。这个坐标系⽤用于给矩形定义自己的形状。比如 `x`， `y` 坐标以及宽高，都是基于自身坐标系进行定义的。如下所示 👇

![](/../../assets/006.png)

![](/../../assets/007-1565942005954.png)



##### 4.3 前驱坐标系

前驱坐标系，就是父容器的坐标系。现在矩形的父容器是 svg 标签，那么它的前驱坐标系也就是世界坐标系。如下所示 👇

![](/../../assets/008.png)



现在我们给矩形加一个坐标变换，大家观察一下就会发现，矩形的坐标和宽高其实是没有改变的，`x` 和 `y` 依然是 0，而宽高依然是 100 * 50。`x`、`y` 和宽高是基于自身坐标系来定义的，定义了是多少就是多少。

![](/../../assets/008-1565942322118.png)



变得是什么？变的是矩形的自身坐标系，它相对于它的前驱坐标系发生了一个变换。分析上面的一个例子，

 “![](/../../assets/009.png)
”



##### 4.4 参考坐标系

参考坐标系，其实是任意的一个坐标系，本质上是我们**选取的**用于观察某个图形情况的坐标系。如下所示 👇

![](/../../assets/010.png)



比如说还是图中的矩形，我选取世界坐标系作为参考坐标系来观察这个矩形的时候，矩形的坐标是多少？没错，就是 50 * 50。宽高是多少？100 * 50。这一点在做图形对齐相关的操作时尤为有用。



#### (五)、坐标变换

##### 5.1 定义

数学上，「坐标变换」是采用一定的数学方法将一个坐标系的坐标变换为另一个坐标系的坐标的过程；

SVG 中，「坐标变换」是对一个坐标系到另一个坐标系的变换的描述。



##### 5.2 线性变换

线性变换的本质就是一个线性变换方程，通过线性变换方程可表示两个坐标系之间的转换。什么是线性变换方程呢？其实就是指原坐标系上的点在经过线性运算之后，得到新坐标系上的每个点。具体可表示为：

![](/../../assets/011.png)



假设我们现在有图形变换，

![](/../../assets/012.png)

那么则有：
$$
X' = 1 \times x + 0 \times y + 10
$$
$$
Y' = 0 \times x + 1 \times y + 10
$$



举几个常用的线性变换的例子

- 平移
- 旋转
  ![](/../../assets/013.png)
- 缩放



##### 5.3 线性变换列表

单个线性变换矩阵，可以表示所有的线性变换。但是，一般情况下，我们去描述一个线性变换可能更愿意分开一步步来描述。比如说，先旋转 `30` 度，再平移 `(10，10)` ，那么已然可以有一个变换矩阵可以表示这个线性变换列表的结果，那就是每一步变换矩阵的乘积。见下，
$$
M = M_n \times M_{n-1} \times \cdots \times M_2 \times M_1 \times M_0
$$
需要注意，最后面的变换，需要乘在前面

![](/../../assets/014.png)

![](/../../assets/015.png)



##### 5.4 transform 属性

这部分就跟 CSS3 transform 很类似了，就不再多做介绍，顺便一提关于 `matrix()` 函数的写法：

```css
transform: matrix(<a>, <b>, <c>, <d>, <e>, <f>);
```



#### (六)、坐标观察

刚刚的例子里头，提到了观察某个坐标系中的元素在参考坐标系中的坐标。这种行为，可以称为坐标观察。坐标观察还可以解决很多问题，比如，交互的时候，我希望知道我点击的鼠标位置在指定的坐标系中是哪个位置。

svg 所有元素都提供了四个方法来配合坐标观察。

- `getBBox()`
          获得当前元素所占的矩形区域
- `getCTM()`
          获得视窗坐标系到当前元素自身坐标系的变换矩阵
- `getScreenCTM()`
          获得浏览器坐标系到当前元素自身坐标系的变换矩阵
- `getTransformToElement()`
          获得从指定元素的自身坐标系到当前元素的自身坐标系的变换矩阵



### 三、SVG 色彩

#### (一)、RGB & HSL

##### 1.1 简介

`RGB` 和 `HSL` 都是 CSS3 支持的颜色表示方法。下面就二者的特点进行分别说明：

`RGB` 如下所示，

![](/../../assets/016.png)

优势：显示器容易解析

劣势：不符合人类描述颜色的习惯



举个例子，

![](/../../assets/017.png)



`HSL` 如下所示，

![](/../../assets/018.png)

`HSL` 的三个分量分别表示颜色、饱和度和亮度。格式：`hsl(h, s%, l%)`，取值范围分别为：`h[0, 259]`，`s,l[0, 100]`

`HSL` 的优势：符合人类描述颜色的习惯。



还是刚刚的示例，如果我们使用 `HSL` 描述的话那么应该是这样的：

![](/../../assets/019.png)



##### 1.2 互相转换的原理

[示例](http://paletton.com/)



#### (二)、线性渐变和径向渐变

使用渐变色可以让我们的 svg 图形表现得更加丰满，渐变分为线性渐变、径向渐变和圆锥渐变。



##### 2.1 线性渐变

![](/../../assets/020.png)

**示例，**

```html
<svg xmlns="http://www.w3.org/2000/svg">
	<defs>
        <linearGradient id="linear" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
        	<stop offset="0"   stop-color="#1497FC"></stop>
            <stop offset="0.5" stop-color="#A469BE"></stop>
            <stop offset="1"   stop-color="#FF8C00"></stop>
        </linearGradient>
    </defs>
    
    <rect x="100" y="100" fill="url(#linear)" width="200" height="200"></rect>
</svg>
```



##### 2.2 径向渐变

![](/../../assets/021.png)

**示例，**

```html
<svg xmlns="http://www.w3.org/2000/svg">
	<defs>
        <radiaGradient id="radia" cx="0.5" cy="0.5" r="0.5" fx="0.6" fy="0.3">
        	<stop offset="0"   stop-color="#1497FC"></stop>
            <stop offset="0.5" stop-color="#A469BE"></stop>
            <stop offset="1"   stop-color="#FF8C00"></stop>
        </radiaGradient>
    </defs>
    
    <rect x="100" y="100" fill="url(#radia)" width="200" height="200"></rect>
</svg>
```



#### (三)、笔刷

笔刷标签使用 `<pattern>` 元素表示，使用此标签可以让预定义图形能够以固定间隔在 `x` 轴和 `y` 轴上重复（或平铺）从而覆盖要涂色的区域。

**示例，**

```html
<svg xmlns="http://www.w3.org/2000/svg">
	<defs>
        <pattern id="patt" x="0" y="0" width="0.2" height="0.2" patternUnits="" patternContentUnits="">
            <circle cx="10" cy="10" r="5" fill="red"></circle>
            <polygon points="30 10 60 50 0 50" fill="green"></polygon>
        </pattern>
    </defs>
    
    <rect x="100" y="100" width="800" height="300" fill="url(#patt)" stroke="blue"></rect>
</svg>
```



### 四、SVG 路径

#### (一)、path 概述

`path` 是 2D 绘图中一个很重要也很强大的工具，且通常在理论上都是作为高级技能进行操作的。

`path` 规范：

[https://www.w3.org/TR/SVG11/paths.html](https://www.w3.org/TR/SVG11/paths.html)

`path` 是由**命令**及其**参数组**组成的字符串，如：

```html
<path d="M153 464 C153 334 151 334 151 334 C151 339 153 344 156 344 C164 344 171 339 171 334 C171 322 164 314 156 314 C142 314 131 322 131 334 C131 350 142 364 156 364 C175 364 191 350 191 334 C191 311 175 294 156 294 C131 294 111 311 111 334 C111 361 131 384 156 384 C186 384 211 361 211 334 C211 300 186 274 156 274" fill="white" stroke="red" stroke-width="2"></path>
```

复杂一点儿：[tiger.svg](http://codinginparadise.org/projects/svgweb/samples/svg-files/tiger.svg)

这里需要强调一下，在指定 `path` 参数的时候最好使用空格隔开每一组参数，一组参数中的 `x,y` 使用逗号作区分。



`path` 命令汇总：

| 命令                       | 含义                                       |
| -------------------------- | ------------------------------------------ |
| `M/m (x,y)+`               | 移动当前位置                               |
| `L/l (x,y)+`               | 从当前位置绘制线段到指定位置               |
| `H/h (x)+`                 | 从当前位置绘制水平线到达指定的 x 坐标      |
| `V/v (x)+`                 | 从当前位置绘制竖直线到达指定的 y 坐标      |
| `Z/z`                      | 闭合当前路径                               |
| `Q/q (x1,y1,x,y)+`         | 从当前位置绘制二次贝塞尔曲线到指定位置     |
| `T/t (x,y)+`               | 从当前位置光滑绘制二次贝塞尔曲线到指定位置 |
| `C/c (x1,y1,x2,y2,x,y)+`   | 从当前位置绘制三次贝塞尔曲线到指定位置     |
| `S/s (x2,y2,x,y)+`         | 从当前位置光滑绘制三次贝塞尔曲线到指定位置 |
| `A/a(rx,ry,xr,laf,sf,x,y)` | 从当前位置绘制弧线到指定位置               |

**命令的基本规律：**

- 命令是区分大小写的，大写表示坐标参数为绝对位置，小写则为相对位置（相对于当前点坐标）
- 最后的参数表示最终要到达的位置
- 上一个命令结束的位置就是下一个命令开始的位置
- 命令可以重复参数表示重复执行同一条命令



#### (二)、移动和直线命令

##### `M`

移动画笔，后面如果有重复参数，会当作是 L 命令处理。



##### `L`

##### `H`

##### `V`



#### (三)、弧线命令

弧线是使用比较多，也最复杂的命令，其参数如下：

- `rx `   - 弧线所在椭圆的 x 半轴长
- `ry`   - 弧线所在椭圆的 y 半轴长
- `xr`   - 弧线所在椭圆的长轴相对于坐标系的旋转角度
- `laf` - 是否选择弧长较长的那一段弧
- `sf`   - 是否选择逆时针方向的那一段弧
- `x,y` - 弧的终点位置



**详情见下图所示，**

`xr` 单位使用角度表示而非弧度

![](/../../assets/022.png)

![](/../../assets/023.png)



`laf` 和 `sf` 的 `0,1` 四种组合：

![](/../../assets/024.png)



#### (四)、贝塞尔曲线命令

略...



### 五、SVG 文本

#### (一)、`<text>` 和 `<tspan>`

```html
<svg xmlns="http://www.w3.org/2000/svg" width="1366" height="768" >
    <defs>
        <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path stroke="#F0F0F0" fill="none" d="M0,0 H20 V20"></path>
        </pattern>
    </defs>

    <rect width="1366" height="768" fill="url(#grid)"></rect>
    <text x="100" y="100">三人行 - K12 智能教育平台</text>
</svg>
```



#### (二)、垂直居中问题

```html
<text text-anchor="">中国智造</text>
<text dominant-baseline="">中国智造</text>
```



#### (三)、`<textpath>`

通过路径指定文本的排列方向

```html
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
	<path id="txtPath" d="M100,200 Q200,100 300,200 T500,200" stroke="rgb(0,255,0)" fill="none"></path>
    
    <text style="font-size:24px;" text-anchor="middle">
    	<textPath dominant-baseline="central" startOffset="50%" xlink:href="#txtPath">
        	<tspan>这个文字先</tspan>
        	<tspan fill="blue">上去</tspan>
            <tspan>，又</tspan>
            <tspan fill="red">下来</tspan>
            <tspan>了。</tspan>
        </textPath>
    </text>
</svg>
```



切线和法线方向的偏移

![](/../../assets/025.png)



#### (四)、`<a>` 链接

- 可以添加到任意的图形上
- xlink:href 指定连接地址
- xlink:title 指定连接提示
- target 指定打开目标



### 六、SVG 引用

这一章节，我们以绘制一幅图像练习为切入点分别说明以下三个相关标签属性 [【效果图链接】](C:\Users\srt\Desktop\道友请留步\common-vue-ui\src\components\widget\svg\res\svgLab\starsky.html) 。初始化模板如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>少年的星空</title>
    <style type="text/css">
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #001122;
            line-height: 0;
            font-size: 0;
        }
    </style>
</head>
<body>
	<!-- 将坐标原点定位到屏幕中间 -->
    <svg width="100%" height="100%" viewBox="-400 -300 800 600" preserveAspectRatio="xMidYMid slice"></svg>

<script type="text/javascript"></script>
</body>
</html>
```



#### (一)、引用

👉 示例，绘制满天的繁星 - `<use xlink:href="#id">`

**Html** 部分，

```html
<defs>
    <polygon id="star" points="0 -10 2 -2 10 0 2 2 0 10 -2 2 -10 0 -2 -2" fill="white"></polygon>
</defs>

<g id="real">
    <!-- 星星 -->
    <g id="star-group"></g>
</g>
```



**Js** 部分，

#### (二)、裁切

👉 示例，绘制灯塔的光线 - `<clipPath>`

```html
<!-- 灯塔 -->
<g id="light-tower" transform="translate(250, 0)">
    <defs>
        <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#999"></stop>
            <stop offset="1" stop-color="#333"></stop>
        </linearGradient>
        <radialGradient id="light" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="rgba(255, 255, 255, 0.8)"></stop>
            <stop offset="1" stop-color="rgba(255, 255, 255, 0)"></stop>
        </radialGradient>

        <clipPath id="light-clip">
            <polygon points="0 0 -400 -15 -400 15" fill="rgba(255, 0, 0, 0.5)">
                <animateTransform 
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0"
                        to="360"
                        dur="10s"
                        repeatCount="indefinite">
                </animateTransform>
            </polygon>
            <circle cx="0" cy="0" r="2"></circle>
        </clipPath>
    </defs>
    <polygon points="0 0 5 50 -5 50" fill="url(#tower)"></polygon>
    <ellipse cx="0" cy="0" rx="300" ry="100" fill="url(#light)" clip-path="url(#light-clip)"></ellipse>
</g>
```



#### (三)、蒙版

👉示例，绘制月牙及倒影 - `<mask>`

**月牙**

```html
<!-- 月牙 -->
<g id="moon-group">
    <mask id="moon-mask">
        <circle cx="-250" cy="-100" r="80" fill="white"></circle>
        <circle cx="-210" cy="-140" r="80" fill="black"></circle>
    </mask>
    <circle cx="-250" cy="-100" r="80" fill="yellow" mask="url(#moon-mask)"></circle>
</g>
```



**倒影**

```html
<!-- 地平线 -->
<line x1="-400" y1="50" x2="400" y2="50" stroke="white"></line>

<!-- 倒影 -->
<g id="reflect" transform="translate(0 50)" mask="url(#fading)">
    <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="rgba(255, 255, 255, 0.3)"></stop>
            <stop offset="0.5" stop-color="rgba(255, 255, 255, 0)"></stop>
        </linearGradient>

        <mask id="fading">
            <rect x="-400" y="0" width="800" height="300" fill="url(#fade)"></rect>
        </mask>
    </defs>

    <use xlink:href="#real" transform="scale(1, -1) translate(0 -50)" />
</g>
```



### 七、SVG 动画

**前言，**

不论你使用 `CSS3` 抑或是 `Flash` 制作动画，还是本章所提到的 `SVG` 动画，说白了它们就底层的机理都是相通的。何谓相通？其实就是无论哪种动画，想要描述它，你必须得提供**六要素**。用一句话描述就是，**动画最基本的一点就是能够随一定的时间间隔而变化**。如下图所示：

![](/../../assets/026.png)



#### (一)、使用动画标签

- `<animate>` 属性动画
- `<animateTransform>` 矩阵变形动画
- `<animateMotion>` 轨迹运动动画



#### (二)、使用 stroke 系列属性

**参考：**[理解 SVG stroke-dasharray 和 stroke-dashoffset 属性](https://juejin.im/post/5c8db3175188257e252a49da)

**示例：**

`2.1 HTML Code`

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>霓虹灯 LOGO</title>
</head>
<body>
	<div class="wrapper">
		<svg width="100%" height="100">
			<text text-anchor="middle" x="50%" y="50%" class="text text-1">www.3ren.cn by FE</text>
            <text text-anchor="middle" x="50%" y="50%" class="text text-2">www.3ren.cn by FE</text>
			<text text-anchor="middle" x="50%" y="50%" class="text text-3">www.3ren.cn by FE</text>
			<text text-anchor="middle" x="50%" y="50%" class="text text-4">www.3ren.cn by FE</text>
		</svg> 
	</div>
</body>
</html>
```



`2.2 CSS Code`

```css
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    background: #2c3e50;
}
.wrapper {
    margin-top: 80px;
}
.text {
    font-size: 64px;
    font-weight: bold;
    text-transform: uppercase;
    fill: none;
    stroke-width: 2px;
    stroke-dasharray: 90 310;
    animation: stroke 6s infinite linear;
}
.text-1 {
    stroke: #3498db;
    text-shadow: 0 0 5px #3498db;
    animation-delay: -1.5s;
}
.text-2 {
    stroke: #f39c12;
    text-shadow: 0 0 5px #f39c12;
    animation-delay: -3s;
}
.text-3 {
    stroke: #e74c3c;
    text-shadow: 0 0 5px #e74c3c;
    animation-delay: -4.5s;
}
.text-4 {
    stroke: #9b59b6;
    text-shadow: 0 0 5px #9b59b6;
    animation-delay: -6s;
}

/* 描边儿动画 */
@keyframes stroke {
	100% {
    	stroke-dashoffset: -400;
	}
}
```



**END...**

