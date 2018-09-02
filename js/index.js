$(function(){
    //检查登陆状态
    checklogin();

    //4. 让图表展示出来
    //4-1： 实现柱状图
    var barchart = echarts.init(document.querySelector(".charts .bar"));

    option = {
        title: {
            text: '销售数据'
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
        },
        yAxis: {
            type: 'value'
        },
        legend: {
            data:['销量']
        },
        series: [{
            name: '销量',
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    barchart.setOption(option);

    //4-2： 实现饼图
    var pipechart = echarts.init(document.querySelector(".charts .pipe"));

    option = {
        title : {
            text: '热门品牌销售',
            subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['阿迪','耐克','回力','李宁','解放']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'阿迪'},
                    {value:310, name:'耐克'},
                    {value:234, name:'回力'},
                    {value:135, name:'李宁'},
                    {value:1548, name:'解放'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    
    // 使用刚指定的配置项和数据显示图表。
    pipechart.setOption(option);


})