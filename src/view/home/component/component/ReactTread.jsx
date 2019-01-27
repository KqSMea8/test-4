import React from 'react';

class ReactTrend extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            ratio: 3, // 宽高比例
            // trends: ["0.00150120", "0.00150110", "0.00150150", "0.00150440", "0.00150650", "0.00150390", "0.00150510", "0.00150300", "0.00150240", "0.00150480", "0.00150190", "0.00150220", "0.00150330", "0.00150680", "0.00150920", "0.00150280", "0.00150220", "0.00150200", "0.00150060", "0.00150000", "0.00150650", "0.00150730", "0.00150830", "0.00151220"],      // 数据节点
            trends: [],      // 数据节点
            stroke: "rgba(244,220,174,1)",           // 线颜色
            strokeWidth: 0.5,                 // 线宽
            fillColor: 'rgba(253,247,236,1)', //填充色
        };
        // console.log(this.props)
    }

  // componentWillUpdate(...parmas) {
  //   console.log(333, ...parmas)
  // }

    render() {
        let obj =  Object.assign(this.state, this.props || {});
        this.pramas = {
            trends: obj.trends,
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth,
            fillColor: obj.fillColor
        }
        let trends=this.pramas.trends;
        if(trends.length<2) return (
            <span style={{display: 'none'}}/>
        );

        let ratio = this.state.ratio;
        let viewHeight=100 / ratio;
        let viewBox = "0 0 100 " + viewHeight;

        let dx = 100 / (trends.length - 1);
        let max = trends[0];
        let min = trends[0];
        for(let i=1;i<trends.length;i++){
            trends[i] > max ? max = trends[i] : null;
            trends[i] < min ? min = trends[i] : null;
        }

        let path = "M0," + viewHeight,
            pathLine = ''
        trends.forEach((e,i)=>{
            let x = i * dx;

            let y;
            if(max===min){
                y=viewHeight/2;
            }else{
                y = viewHeight - (e - min) / (max - min) * viewHeight;
            }

            if(i<=0){
                pathLine += "M"+x + "," + y + " ";
            }else{
                pathLine += "L"+x + "," + y + " ";
            }
            path += "L"+x + "," + y + " ";
        });

        path += "L"+ 100 + "," + viewHeight + " ";

        // console.log('path', path)

        return (<svg className="kline-trend" viewBox={viewBox} preserveAspectRatio="none">
                    <path d={path} stroke="none" fill={this.pramas.fillColor}/>
                    <path d={pathLine} stroke={this.pramas.stroke} strokeWidth={this.pramas.strokeWidth} fill="none"/>
                </svg>
        );
    }

}

export default ReactTrend;