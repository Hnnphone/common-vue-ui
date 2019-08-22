<template>
    <div id="progressWrap">
        <canvas ref="circle" id="circle"></canvas>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                percent: 0.9, // 百分比 required
                size: 100, // 尺寸 we need only one dimension
                startAngle: -Math.PI, // 弧度 radians
                thickness: "auto", // 厚度 this.size/14
                fill: {
                    gradient: ["#FF0000", "#0000FF"]
                },
                emptyFill: "rgba(0, 0, 0, .1)",
                lineCap: "round", // Arc line cap: `"butt"`, `"round"` or `"square"`
                radius: 0.0, // 半径 this.size/2
                arcFill: null,
                lastFrameValue: 0.0,

                firstRun: true
            }
        },

        mounted() {
            this.$nextTick(() => {
                if (this.firstRun) {
                    this.init();
                    this.firstRun = false;
                }
            });
        },

        methods: {
            init() {
                this.radius = this.size / 2;

                this.initWidget();
                this.initFill();
                this.draw();
            },

            initWidget() {
                var canvas = this.$refs.circle;
                canvas.width = this.size;
                canvas.height = this.size;
                this.ctx = canvas.getContext('2d');

                // window.devicePixelRatio ?
                if (window.devicePixelRatio > 1) {
                    var scaleBy = window.devicePixelRatio;
                    canvas.style.width = canvas.style.height = this.size + 'px';
                    canvas.width = canvas.height = this.size * scaleBy;
                    this.ctx.scale(scaleBy, scaleBy);
                }
            },

            initFill() {
                var context = this.ctx,
                    fill = this.fill,
                    size = this.size;

                if (typeof fill == "string") {
                    fill = {color: fill};
                }

                if (fill.color) {
                    this.arcFill = fill.color;
                }

                if (fill.gradient) {
                    var gr = fill.gradient;

                    if (gr.length === 1) {
                        this.arcFill = gr[0];
                    } else if (gr.length > 1) {
                        var ga = fill.gradientAngle || 0,
                            gd = fill.gradientDirection || [
                                size / 2 * (1 - Math.cos(ga)), // x0
                                size / 2 * (1 + Math.sin(ga)), // y0
                                size / 2 * (1 + Math.cos(ga)), // x1
                                size / 2 * (1 - Math.sin(ga))  // y1
                            ];

                        var lg = context.createLinearGradient.apply(context, gd);

                        for (var i = 0; i < gr.length; i++) {
                            var color = gr[i],
                                pos = i / (gr.length - 1);

                            if (color instanceof Array) {
                                pos = color[1];
                                color = color[0];
                            }

                            lg.addColorStop(pos, color);
                        }

                        this.arcFill = lg;
                    }
                }

                // image ?
            },

            draw() {
                if (this.animation) {

                } else {
                    this.drawFrame(this.percent);
                }
            },

            drawFrame(v) {
                this.lastFrameValue = v;
                this.ctx.clearRect(0, 0, this.size, this.size);
                this.drawEmptyArc(v);
                this.drawArc(v);
            },

            drawEmptyArc(v) {
                var context = this.ctx,
                    r = this.radius,
                    t = typeof this.thickness == "number" ? this.thickness : this.size / 14,
                    a = this.startAngle;

                if (v < 1) {
                    context.save();
                    context.beginPath();

                    if (v <= 0) {
                        context.arc(r, r, r - t / 2, 0, Math.PI * 2);
                    } else {
                        if (!this.reverse) {
                            context.arc(r, r, r - t / 2, a + Math.PI * 2 * v, a);
                        } else {
                            context.arc(r, r, r - t / 2, a, a - Math.PI * 2 * v);
                        }
                    }

                    context.lineWidth = t;
                    context.strokeStyle = this.emptyFill;
                    context.stroke();
                    context.restore();
                }
            },

            drawArc(v) {
                if (v === 0) return;

                var context = this.ctx,
                    r = this.radius,
                    t = typeof this.thickness == "number" ? this.thickness : this.size / 14,
                    a = this.startAngle;

                context.save();
                context.beginPath();

                if (!this.reverse) {
                    context.arc(r, r, r - t / 2, a, a + Math.PI * 2 * v);
                } else {
                    context.arc(r, r, r - t / 2, a - Math.PI * 2 * v, a);
                }

                context.lineWidth = t;
                context.lineCap = this.lineCap;
                context.strokeStyle = this.arcFill;
                context.stroke();
                context.restore();
            },
        }
    }
</script>

<style lang="stylus" scoped>
    #circle
        vertical-align: middle
        transform: rotate(90deg);
</style>