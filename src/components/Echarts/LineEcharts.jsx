import React, { Component } from 'react';
import * as echarts from 'echarts';

export default class LineEcharts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 挂载完成之后，因为React初始化echarts时长宽可能会获取到顶层，所以延迟200去生成，不影响视觉效果
  componentDidMount() {
    setTimeout(() => {
      this.initEchart(this.props.data);
    }, 200);
  }

  // 更新props以后调用
  componentWillReceiveProps(newProps) {
    this.initEchart(newProps.data);
  }

  initEchart = (data) => {
    let myEcharts = echarts.init(this.echartsBox);
    let option = {
      title: {
        text: this.props.title || '',
        left: 'center',
        top: '0',
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            show: false,
          },
        },
        formatter: '{b}<br/>交易数：{c}',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
      },
      xAxis: {
        data: data.x,
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        name: this.props.yname,
        nameGap: 15,
        position: 'left',
        axisTick: {
          inside: true,
        },
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [
        {
          name: '交易数',
          type: 'line',
          data: data.y,
          smooth: false,
          lineStyle: {
            color: '#6C53B1',
            width: 2,
          },
          itemStyle: {
            color: '#6C53B1',
            borderColor: '#6C53B1',
          },
          areaStyle: {
            //配置渐变色
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#9F4CFC' }, //顶端颜色
                { offset: 0.5, color: '#b074f3' }, //中间颜色
                { offset: 1, color: '#e8f7f4' }, //底部颜色
              ]),
            },
          },
        },
      ],
    };
    myEcharts.setOption(option);
    myEcharts.on('finished', () => {
      // myEcharts.resize();
    });
  };

  render() {
    return (
      <div
        ref={(c) => {
          this.echartsBox = c;
        }}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
}
