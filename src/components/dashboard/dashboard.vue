<style scoped>
    #echart{
        width: 100%;height:400px; float: left;margin-top: 50px
    }
</style>

<template>
    <div id="app">
        <Card>
            <Row>
                <Col :sm="12" :lg="{ span: 8, offset: 3 }">
                    <div style="max-width: 600px">
                        <div id="echart"></div>
                    </div>
                </Col>
                <Col :sm="12" :lg="{ span: 11, offset: 1 }">
                    <div style="max-width: 600px">
                        <Tabs :value="tagName" @on-click="handleClick">
                            <TabPane label="今日" name="day"  ></TabPane>
                            <TabPane label="本周" name="week" ></TabPane>
                            <TabPane label="本月" name="month"></TabPane>
                            <TabPane label="今年" name="year" ></TabPane>
                        </Tabs>
                        <Table stripe :columns="columns" :data="tableData"></Table>
                        <Page style="float: right;margin-top: 10px" :total="totalPage" @on-change="changePage"/>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import {getDashboardViews,getDashboardArticles} from "../../api/apis";

    export default {
        name: "app",
        data() {
            return {
                date:'day',
                tagName:'day',
                xAxis_data:[],
                series_data:[],
                interval:0,
                columns:[
                    {type:'index',align: 'center'},
                    {title: '文章标题', key: 'title'},
                    {title: '浏览数', key: 'viewTotal'},
                    {title: '用户量', key: 'userTotal'},
                ],
                tableData:[],
                page:1,
                totalPage:0,
            }
        },
        methods:{
            handleClick(name){
                let _this = this;
                _this.date = name;
                _this.tagName = name;
                _this.totalPage = 0;
                _this.tableData = [];
                _this.getEchartsData();
                _this.getTableData();
            },
            getEchartsData(){
                let _this = this;
                //ecahrt loading
                let myChart = _this.$echarts.init(document.getElementById("echart"));
                myChart.showLoading();
                getDashboardViews({
                    "type":_this.date
                }).then(res=>{
                    _this.series_data=[];
                    _this.xAxis_data=[];
                    switch (_this.date) {
                        case 'day':
                            res.data.data.forEach((item,index)=>{
                                _this.xAxis_data.push(new Date(item.createTime).getHours()+1);
                                _this.series_data.push(item.viewTotal);
                            })
                            _this.interval =2;
                            break;
                        case 'week':
                            res.data.data.forEach((item,index)=>{
                                _this.series_data.push(item.viewTotal);
                            });
                            _this.xAxis_data.push('周一');
                            _this.xAxis_data.push('周二');
                            _this. xAxis_data.push('周三');
                            _this.xAxis_data.push('周四');
                            _this.xAxis_data.push('周五');
                            _this.xAxis_data.push('周六');
                            _this.xAxis_data.push('周日');
                            _this.interval =0;
                            break;
                        case 'month':
                            res.data.data.forEach((item,index)=>{
                                _this.xAxis_data.push(new Date(item.createTime).getDate());
                                _this.series_data.push(item.viewTotal);
                            });
                            _this.interval = 2;
                            break;
                        case 'year':
                            res.data.data.forEach((item,index)=>{
                                _this.xAxis_data.push(new Date(item.createTime).getMonth()+1);
                                _this.series_data.push(item.viewTotal);
                            });
                            _this.interval = 0;
                            break;
                    }

                })
            },
            drawChart() {
                var _this = this;
                // 基于准备好的dom，初始化echarts实例
                let myChart = _this.$echarts.init(document.getElementById("echart"));
                // 指定图表的配置项和数据
                let  option = {
                    xAxis: {
                        type:'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval: _this.interval,
                        },
                        data: _this.xAxis_data,
                    },
                    tooltip : {
                        trigger: 'axis',
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        type: 'line',
                        symbol: 'none',
                        data: _this.series_data,
                        lineStyle: {
                            normal:{
                                color: '#87CEEB',
                            }
                        }
                    }]
                };
                // 隐藏 ecahrt loading
                myChart.hideLoading();
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },

            getTableData(){
                let _this = this;
                getDashboardArticles({
                    page:_this.page,
                    size:10,
                    type:_this.date,
                }).then(res=>{
                    if( !res.data.data === undefined || res.data.data.length > 0){
                        _this.totalPage = res.data.data[0].totalPage * 10;
                        _this.tableData  = res.data.data;
                    }
                })

            },

            changePage(index){
                let _this = this;
                _this.page = index;
                _this.getTableData();

            }

        },
        mounted() {
            this.getEchartsData();
            this.getTableData();
            setTimeout(() => {
                this.drawChart();
            }, 300)
        },

        updated() {
            setTimeout(() => {
                this.drawChart();
            }, 300)
        }
    };
</script>


