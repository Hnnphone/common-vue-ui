<template>
    <div id="mapWrap">
        <div id="container"></div>

        <div class="info">
            <h4 id='status'></h4><hr>
            <p id='result'></p><hr>
            <p >由于众多浏览器已不再支持非安全域的定位请求，为保位成功率和精度，请升级您的站点到HTTPS。</p>
        </div>
    </div>
</template>

<script>
    const x_pi = 3.14159265358979324 * 3000.0 / 180.0;

    function baidu2mars(baidu_point) {
        var mars_point = {lon: 0, lat: 0};
        var x = baidu_point.lon - 0.0065;
        var y = baidu_point.lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        mars_point.lon = z * Math.cos(theta);
        mars_point.lat = z * Math.sin(theta);
        return mars_point;
    }

    function mars2baidu(mars_point) {
        var baidu_point = {lon: 0, lat: 0};
        var x = mars_point.lon;
        var y = mars_point.lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        baidu_point.lon = z * Math.cos(theta) + 0.0065;
        baidu_point.lat = z * Math.sin(theta) + 0.006;
        return baidu_point;
    }

    export default {
        mounted() {
            this.$nextTick(() => {
                /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

                const pos = {
                    lon: 116.391037,
                    lat: 39.969712,
                };
                console.log(baidu2mars(pos));

                var map = new AMap.Map('container', {
                    resizeEnable: true
                });
                AMap.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：5s
                        buttonPosition:'RB',    //定位按钮的停靠位置
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition(function(status,result){
                        if(status=='complete'){
                            onComplete(result)
                        }else{
                            onError(result)
                        }
                    });
                });
                //解析定位结果
                function onComplete(data) {
                    document.getElementById('status').innerHTML='定位成功'
                    var str = [];
                    str.push('定位结果：' + data.position);
                    str.push('定位类别：' + data.location_type);
                    if(data.accuracy){
                        str.push('精度：' + data.accuracy + ' 米');
                    }//如为IP精确定位结果则没有精度信息
                    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
                    document.getElementById('result').innerHTML = str.join('<br>');
                }
                //解析定位错误信息
                function onError(data) {
                    document.getElementById('status').innerHTML='定位失败'
                    document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message;
                }

                /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            })
        }
    }
</script>

<style lang="stylus" scoped>
    #container
        width:1200px;
        height: 600px;
</style>