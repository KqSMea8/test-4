import KDepth from "./kdepth";
import Theme from "./theme";

export default class Plotter {

    constructor() {
        this._canvas=null;
        this._context=null;
        this._overlayCanvas=null;
        this._overlayContext=null;

        this.asks=[];
        this.bids=[];
        this.asks_min=[];
        this.asks_max=[];
        this.bids_min=[];
        this.bids_max=[];
        this.maxStrXW=0;
        this.maxStrYW=0;

        this.chartWidth=0;
        this.chartHeight=0;
        this.scaleLength=0;
        this.oX=0;
        this.oY=0;
        this.ratioStrX=0;
        this.ratioStrY=0;
        this.strX0=0;
        this.strY0=0;
        this.strX1=0;
        this.strY1=0;

        this.rangeX = 0.8;   // 数据过滤：[中间价*(1-rangeX),中间价*(1+rangeX)]
        this.gapX = 5 * KDepth.instance.dpr;   //数据过滤: 买和卖中间gapX像素数据过滤掉

        this.initOverlay=false;

        if(!Plotter.instance){
            Plotter.instance=this;
        }
    }

    bindCanvas(canvas) {
        canvas.setAttribute("width",KDepth.instance.width * KDepth.instance.dpr);
        canvas.setAttribute("height",KDepth.instance.height * KDepth.instance.dpr);
        canvas.style.width = KDepth.instance.width + "px";
        canvas.style.height = KDepth.instance.height + "px";
        this._canvas=canvas;
        this._context=canvas.getContext("2d");
    }

    bindOverlayCanvas(canvas){
        canvas.setAttribute("width",KDepth.instance.width * KDepth.instance.dpr);
        canvas.setAttribute("height",KDepth.instance.height * KDepth.instance.dpr);
        canvas.style.width = KDepth.instance.width + "px";
        canvas.style.height = KDepth.instance.height + "px";
        this._overlayCanvas=canvas;
        this._overlayContext=canvas.getContext("2d");
    }

    /*********************************************
     * Methods
     *********************************************/

    formatFloat(v, fractionDigits){
        let text = v.toFixed(fractionDigits);
        if(fractionDigits<=0) return text;
        for (let i = text.length - 1; i >= 0; i--) {
            if (text[i] === '.')
                return text.substring(0, i);
            if (text[i] !== '0')
                return text.substring(0, i + 1);
        }
    };

    drawDashLine(x1, y1, x2, y2, step = 2){
        let ctx=this._context;
        const x = x2 - x1,
            y = y2 - y1,
            count = Math.floor(Math.sqrt(x * x + y * y) / step),
            xv = Math.round(x/count),
            yv = Math.round(y/count);
        ctx.beginPath();
        ctx.lineWidth = KDepth.instance.dpr;
        for (let i = 0; i < count; i ++) {
            if (i % 2 === 0) {
                ctx.moveTo(x1, y1);
            } else {
                ctx.lineTo(x1, y1);
            }
            x1 += xv;
            y1 += yv;
        }
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    draw() {
        if (this.asks.length < 1 || this.bids.length < 1) return;
        let ctx=this._context;
        let canvas = this._canvas;
        let padding={
            left: 20 * KDepth.instance.dpr,
            right: 20 * KDepth.instance.dpr,
            top: 30 * KDepth.instance.dpr,
            bottom: 20 * KDepth.instance.dpr,
        };
        let verAxisWidth=Math.floor(this.maxStrYW);
        let horAxisHeight=12 * KDepth.instance.dpr;
        let scaleLength=3 * KDepth.instance.dpr;
        let chartWidth=canvas.width-verAxisWidth-(padding.left+padding.right);
        let chartHeight=canvas.height-horAxisHeight-(padding.top+padding.bottom);
        let scaleXNum=Math.floor(chartWidth/(this.maxStrXW + 40 * KDepth.instance.dpr));//横轴刻度
        let scaleYNum=Math.floor(chartHeight/ (50* KDepth.instance.dpr));//纵轴刻度

        let oX=padding.left+verAxisWidth;
        let oY=padding.top+chartHeight;

        let strX0=Math.min(this.asks_min[0],this.bids_min[0]);
        let strX1=Math.max(this.asks_max[0],this.bids_max[0]);
        strX0 -= (strX1-strX0)*0.01;
        strX1 += (strX1-strX0)*0.01;
        let strY0=0;
        let strY1=Math.max(this.asks_max[2],this.bids_max[2]);
        strY1 += strY1*0.01;
        let ratioStrX=(strX1-strX0)/chartWidth;
        let ratioStrY=(strY1-strY0)/chartHeight;


        this.chartWidth=chartWidth;
        this.chartHeight=chartHeight;
        this.scaleLength=scaleLength;
        this.oX=oX;
        this.oY=oY;
        this.ratioStrX=ratioStrX;
        this.ratioStrY=ratioStrY;
        this.strX0=strX0;
        this.strY0=strY0;
        this.strX1=strX1;
        this.strY1=strY1;

        //坐标轴
        ctx.strokeStyle=Theme._color["axisLine"];
        ctx.beginPath();
        ctx.lineWidth = KDepth.instance.dpr;
        ctx.moveTo(oX+0.5,oY+0.5);
        ctx.lineTo(oX+chartWidth+0.5,oY+0.5);
        ctx.moveTo(oX+0.5,oY+0.5);
        ctx.lineTo(oX+0.5,oY-chartHeight+0.5);
        ctx.stroke();

        let gapH=Math.floor(chartHeight/scaleYNum);
        let gapW=Math.floor(chartWidth/scaleXNum);

        //网格线
        ctx.strokeStyle=Theme._color["gridLine"];
        ctx.beginPath();
        ctx.lineWidth = KDepth.instance.dpr;
        for(let i=1;i<=scaleXNum;i++){
            this.drawDashLine(oX+i*gapW+0.5, oY+0.5, oX+i*gapW+0.5, oY-chartHeight+0.5)
        }
        for(let i=1;i<=scaleYNum;i++){
            this.drawDashLine(oX+0.5, oY-i*gapH+0.5, oX+chartWidth+0.5, oY-i*gapH+0.5)
        }
        ctx.stroke();

        //刻度线
        ctx.strokeStyle=Theme._color["axisLine"];
        ctx.beginPath();
        ctx.lineWidth = KDepth.instance.dpr;
        for(let i=1;i<=scaleXNum;i++){
            if(i===scaleXNum) break;//移除最后的刻度
            ctx.moveTo(oX+i*gapW+0.5, oY+0.5);
            ctx.lineTo(oX+i*gapW+0.5, oY+scaleLength+0.5);
        }
        for(let i=1;i<=scaleYNum;i++){
            ctx.moveTo(oX+0.5, oY-i*gapH+0.5);
            ctx.lineTo(oX-scaleLength+0.5, oY-i*gapH+0.5);
        }
        ctx.stroke();

        //刻度线文本
        ctx.fillStyle=Theme._color["scaleFontColor"];
        ctx.font=Theme._fonts;
        for(let i=1;i<=scaleXNum;i++){
            if(i===scaleXNum) break;//移除最后的刻度
            let str=this.formatFloat(strX0+i*gapW*ratioStrX,6);
            let strW=ctx.measureText(str).width;
            ctx.fillText(str, oX+i*gapW-strW/2, oY + scaleLength + 17 * KDepth.instance.dpr);
        }
        for(let i=1;i<=scaleYNum;i++){
            let str=this.formatFloat(strY0+i*gapH*ratioStrY,1);
            let strW=ctx.measureText(str).width;
            ctx.fillText(str, oX-scaleLength-strW - 7 * KDepth.instance.dpr, oY-i*gapH+ 6 * KDepth.instance.dpr)
        }
        let str=this.formatFloat(strY0,0);
        let strW=ctx.measureText(str).width;
        ctx.fillText(str, oX-scaleLength-strW- 5 * KDepth.instance.dpr, oY + 6 * KDepth.instance.dpr);


        let bids=this.bids;
        let asks=this.asks;

        //画图过滤 gapX
        let gapX = this.gapX;
        let bid0X = (bids[bids.length-1][0]-strX0)/ratioStrX + oX;
        let ask0X = (asks[0][0]-strX0)/ratioStrX + oX;
        let maxBidsX = (bid0X + ask0X)/2 - gapX/2;
        let minAsksX = (bid0X + ask0X)/2 + gapX/2;

        //画图数据
        let drawBids = [];
        this.drawBids = drawBids;
        if(bids[0][1] > 0) {
            drawBids.push([oX,oY-(bids[0][2]-strY0)/ratioStrY]);
            for(let i=0;i<bids.length - 1;i++){
                drawBids.push([oX+(bids[i][0]-strX0)/ratioStrX, oY-(bids[i][2]-strY0)/ratioStrY]);
                //drawBids.push([oX+(bids[i][0]-strX0)/ratioStrX, oY-(bids[i+1][2]-strY0)/ratioStrY]);
            }
            drawBids.push([oX+(bids[bids.length-1][0]-strX0)/ratioStrX, oY-(bids[bids.length-1][2]-strY0)/ratioStrY]);
            drawBids.push([oX+(bids[bids.length-1][0]-strX0)/ratioStrX, oY]);
        }

        let drawAsks = [];
        this.drawAsks = drawAsks;
        if(asks[0][1] > 0) {
            drawAsks.push([oX+(asks[0][0]-strX0)/ratioStrX, oY]);
            for(let i=0;i<asks.length - 1;i++){
                drawAsks.push([oX+(asks[i][0]-strX0)/ratioStrX, oY-(asks[i][2]-strY0)/ratioStrY]);
                //drawAsks.push([oX+(asks[i+1][0]-strX0)/ratioStrX, oY-(asks[i][2]-strY0)/ratioStrY]);
            }
            drawAsks.push([oX+(asks[asks.length-1][0]-strX0)/ratioStrX, oY-(asks[asks.length-1][2]-strY0)/ratioStrY]);
            drawAsks.push([oX+(strX1-strX0)/ratioStrX, oY-(asks[asks.length-1][2]-strY0)/ratioStrY]);
        }
        // console.log([].concat(drawBids),[].concat(drawAsks))

        //画深度图，二次贝塞尔曲线
        //买单
        if(drawBids.length){
            ctx.beginPath();
            ctx.lineWidth=2 * KDepth.instance.dpr;
            ctx.strokeStyle=Theme._color["depthLine1"];
            ctx.fillStyle=Theme._color["depthLine1Fill"];
            ctx.moveTo(drawBids[0][0],drawBids[0][1]);
            ctx.lineTo(drawBids[1][0],drawBids[1][1]);
            for(let i=2;i<=drawBids.length-1;i++){
                // if(i=== drawBids.length-2) console.log(drawBids[i])
                ctx.lineTo(drawBids[i-1][0],drawBids[i][1]);
                ctx.lineTo(drawBids[i][0],drawBids[i][1]);
                // let nowX = drawBids[i][0];
                // let nowY = drawBids[i][1];
                // let cx,cy;
                // if(i===drawBids.length-1){
                //     cx = nowX;
                //     cy = nowY;
                // }else{
                //     cx = (drawBids[i][0]+drawBids[i+1][0])/2;
                //     cy = (drawBids[i][1]+drawBids[i+1][1])/2;
                // }
                // nowX = Math.min(nowX,maxBidsX);
                // cx = Math.min(cx,maxBidsX);
                // ctx.quadraticCurveTo(nowX, nowY, cx, cy);
            }
            ctx.stroke();
            ctx.strokeStyle="transparent";
            ctx.lineTo(oX,oY);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        // 卖单
        if(drawAsks.length){
            ctx.beginPath();
            ctx.lineWidth=2 * KDepth.instance.dpr;
            ctx.strokeStyle=Theme._color["depthLine2"];
            ctx.fillStyle=Theme._color["depthLine2Fill"];
            ctx.moveTo(drawAsks[0][0],drawAsks[0][1]);
            ctx.lineTo(drawAsks[1][0],drawAsks[1][1]);
            for(let i=2;i<drawAsks.length;i++){
                // if(i=== 1) console.log(drawAsks[i])
                ctx.lineTo(drawAsks[i][0],drawAsks[i-1][1]);
                ctx.lineTo(drawAsks[i][0],drawAsks[i][1]);
                // let nowX = drawAsks[i][0];
                // let nowY = drawAsks[i][1];
                // let cx,cy;
                // if(i===drawAsks.length-1){
                //     cx = nowX;
                //     cy = nowY;
                // }else{
                //     cx = (drawAsks[i][0]+drawAsks[i+1][0])/2;
                //     cy = (drawAsks[i][1]+drawAsks[i+1][1])/2;
                // }
                // nowX = Math.max(nowX,minAsksX);
                // cx = Math.max(cx,minAsksX);
                // ctx.quadraticCurveTo(nowX, nowY, cx, cy);
            }
            ctx.stroke();
            ctx.strokeStyle="transparent";
            ctx.lineTo(oX+(strX1-strX0)/ratioStrX, oY);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        /*
        //柱状图
        ctx.fillStyle=Theme._color["barFill1"];
        for(let i=0;i<bids.length-1;i++){
            let bx=Math.round(oX+(bids[i][0]-strX0)/ratioStrX);
            let by=Math.round(oY-(bids[i][1]-strY0)/ratioStrY);
            let bw=1;
            let bh=oY-by;
            ctx.fillRect(bx,by,bw,bh);
        }
        ctx.fillStyle=Theme._color["barFill2"];
        for(let i=0;i<asks.length-1;i++){
            let bx=Math.round(oX+(asks[i][0]-strX0)/ratioStrX);
            let by=Math.round(oY-(asks[i][1]-strY0)/ratioStrY);
            let bw=1;
            let bh=oY-by;
            ctx.fillRect(bx,by,bw,bh);
        }
        */

        // ======================================================================================
        // draw overlay

        if(this.initOverlay) return;
        this.initOverlay = true;

        this._overlayCanvas.addEventListener("mousemove", event => {

            let oCanvas=this._overlayCanvas;
            let oCtx=this._overlayContext;

            oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);

            let x = Math.round(event.clientX - oCanvas.getBoundingClientRect().left) * KDepth.instance.dpr;
            let y = Math.round(event.clientY - oCanvas.getBoundingClientRect().top) * KDepth.instance.dpr;
            // console.log(x, y)

            let chartWidth=this.chartWidth;
            let chartHeight=this.chartHeight;
            let oX=this.oX;
            let oY=this.oY;
            let ratioStrX=this.ratioStrX;
            let ratioStrY=this.ratioStrY;
            let strX0=this.strX0;
            let strY0=this.strY0;
            let strX1=this.strX1;
            let strY1=this.strY1;
            let scaleLength=this.scaleLength;

            let bids=this.bids;
            let asks=this.asks;

            if (x < oX || x > oX + chartWidth || y > oY || y < oY - chartHeight) {
                oCanvas.style.cursor = "default";
                return;
            }
            oCanvas.style.cursor = "none";

            //测量线
            oCtx.beginPath();
            oCtx.lineWidth = KDepth.instance.dpr;
            oCtx.strokeStyle = "#aaa";

            oCtx.moveTo(x + 0.5, oY + 0.5);
            oCtx.lineTo(x + 0.5, oY - chartHeight + 0.5);
            oCtx.stroke();

            //测量线文本
            let strX = (x - oX) * ratioStrX + strX0 > 0 ? (x - oX) * ratioStrX + strX0 : 0
            let strY = (oY - y) * ratioStrY + strY0;
            let axisY;

            //信息文本
            let strInfos = [];
            let strPrice = strX;
            let strVol = 0;
            let strAccu = 0;
            // console.log(strX, this.drawBids, this.drawAsks)
            if (strX <= this.bids_max[0] && this.drawBids.length > 1) {
                if(KDepth.instance.lang==="zh-cn"){
                    strInfos = ["购买价格: ", "购买量: ", "累计购买量: "];
                }else if(KDepth.instance.lang==="en-us"){
                    strInfos = ["Buy Price: ", "Buy Volume: ", "Accumulative Buy Volume: "];
                }else if(KDepth.instance.lang==="zh-tw"){
                    strInfos = ["購買價格: ", "購買量: ", "累計購買量: "];
                }
                for (let i = bids.length - 1; i >= 0; i--) {
                    if (bids[i][0]>=strX && bids[i][0]-strX<ratioStrX * 2) {
                        strPrice = bids[i][0];
                        strVol = bids[i][1];
                    }
                    if(bids[i][0]>= strX){
                        strAccu = bids[i][2];
                        strY = strAccu;
                        axisY = this.drawBids[i+1][1]
                    }
                }
                oCtx.fillText(strInfos[0] + this.formatFloat(Number(strPrice), 6) + "  " + strInfos[1] + this.formatFloat(strVol, 4) + "  "
                    + strInfos[2] + this.formatFloat(strAccu, 4), oX + 20 * KDepth.instance.dpr + 60, oY - chartHeight + 16 * KDepth.instance.dpr);
            } else if(strX >= this.asks_min[0] && this.drawAsks.length > 1) {
                if(KDepth.instance.lang==="zh-cn"){
                    strInfos = ["出售价格: ", "出售量: ", "累计出售量: "];
                }else if(KDepth.instance.lang==="en-us"){
                    strInfos = ["Sell Price: ", "Sell Volume: ", "Accumulative Sell Volume: "];
                }else if(KDepth.instance.lang==="zh-tw"){
                    strInfos = ["出售價格: ", "出售量: ", "累計出售量: "];
                }
                for (let i = 0; i < asks.length; i++) {
                    if (asks[i][0]<=strX && strX-asks[i][0]<ratioStrX * 2) {
                        strPrice = asks[i][0];
                        strVol = asks[i][1];
                    }
                    if(asks[i][0]<=strX){
                        strAccu = asks[i][2];
                        strY = strAccu;
                        axisY = this.drawAsks[i+1][1]
                    }
                }
                oCtx.fillText(strInfos[0] + this.formatFloat(Number(strPrice), 6) + "  " + strInfos[1] + this.formatFloat(strVol, 4) + "  "
                    + strInfos[2] + this.formatFloat(strAccu, 4), oX + 20* KDepth.instance.dpr + 60, oY - chartHeight + 16* KDepth.instance.dpr);
            }


            oCtx.beginPath();
            oCtx.moveTo(oX + 0.5, axisY + 0.5);
            oCtx.lineTo(oX + chartWidth + 0.5, axisY);
            oCtx.stroke();

            let strX_Tip = this.formatFloat(Number(strPrice),6);
            let strY_Tip = this.formatFloat(strY,2);
            let strXW = oCtx.measureText(strX_Tip).width;
            let strYW = oCtx.measureText(strY_Tip).width;
            oCtx.fillStyle=Theme._color["background"];
            oCtx.fillRect(x-strXW/2- 10 * KDepth.instance.dpr, oY+scaleLength, strXW + 20 * KDepth.instance.dpr,22 * KDepth.instance.dpr);  //padding:0 10px
            // oCtx.fillRect(oX-scaleLength-strYW-7* KDepth.instance.dpr + 30 , y-10* KDepth.instance.dpr, strYW + 30,22* KDepth.instance.dpr);     //padding: 5px 0,font-size:12px
            oCtx.fillRect(oX , axisY-10* KDepth.instance.dpr, strYW + 30,22* KDepth.instance.dpr);     //padding: 5px 0,font-size:12px
            oCtx.fillStyle = Theme._color["infoFontColor"];
            oCtx.font = Theme._fonts;
            oCtx.fillText(strX_Tip, x - strXW / 2, oY + scaleLength + 17* KDepth.instance.dpr);
            // oCtx.fillText(strY_Tip, oX - scaleLength - strYW - 7* KDepth.instance.dpr + 40, y + 6* KDepth.instance.dpr);
            oCtx.fillText(strY_Tip, oX + 15, axisY + 6* KDepth.instance.dpr);
        });

        this._overlayCanvas.addEventListener("mouseout",event=>{
            let oCanvas = this._overlayCanvas;
            let oCtx = this._overlayContext;
            oCtx.clearRect(0,0,oCanvas.width,oCanvas.height);
        });
    }

    onSize(w,h){
        let ctx=this._context;
        let canvas=this._canvas;
        let oCanvas=this._overlayCanvas;
        let oCtx=this._overlayContext;

        canvas.setAttribute("width",w * KDepth.instance.dpr);
        canvas.setAttribute("height",h * KDepth.instance.dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        oCanvas.setAttribute("width",w * KDepth.instance.dpr);
        oCanvas.setAttribute("height",h * KDepth.instance.dpr);
        oCanvas.style.width = w + "px";
        oCanvas.style.height = h + "px";

        ctx.fillStyle=Theme._color["background"];
        ctx.fillRect(0,0,canvas.width,canvas.height);
        oCtx.fillStyle="transparent";
        oCtx.fillRect(0,0,oCanvas.width,oCanvas.height);
        this.draw();
    }

    setData(data){
        // console.log(data)
        let asks=data.asks;
        let bids=data.bids;

        //价格排序
        asks.length > 1 && asks.sort((a,b)=>{
            return a[0]-b[0];
        });
        bids.length > 1 && bids.sort((a,b)=>{
            return a[0]-b[0];
        });

        //数据过滤rangeX
        // let mX = asks[0][0];
        // let rangeX = this.rangeX;
        // for(let i=0;i<bids.length;i++){
        //     if(bids[i][0]>mX*(1+rangeX) || bids[i][0]<mX*(1-rangeX)){
        //         bids.splice(i,1);
        //         i--;
        //     }
        // }
        // for(let i=0;i<asks.length;i++){
        //     if(asks[i][0]>mX*(1+rangeX) || asks[i][0]<mX*(1-rangeX)){
        //         asks.splice(i,1);
        //         i--;
        //     }
        // }
        if(bids.length<1){
            bids=[[0,0]];
        }
        if(asks.length<1){
            asks=[[0,0]];
        }

        //计算累计量,[价格，成交量，累计成交量]
        bids[bids.length-1][2]=bids[bids.length-1][1];
        for(let i=bids.length-1;i>0;i--){
            bids[i-1][2]=bids[i-1][1]+bids[i][2];
        }
        asks[0][2]=asks[0][1];
        for(let i=1;i<asks.length;i++){
            asks[i][2]=asks[i][1]+asks[i-1][2];
        }

        //计算最值
        let asks_min=asks[0].slice(0);
        let asks_max=asks[0].slice(0);
        for(let i=0;i<asks.length;i++) {
            asks[i][0] < asks_min[0] && (asks_min[0] = asks[i][0]);
            asks[i][1] < asks_min[1] && (asks_min[1] = asks[i][1]);
            asks[i][2] < asks_min[2] && (asks_min[2] = asks[i][2]);
            asks[i][0] > asks_max[0] && (asks_max[0] = asks[i][0]);
            asks[i][1] > asks_max[1] && (asks_max[1] = asks[i][1]);
            asks[i][2] > asks_max[2] && (asks_max[2] = asks[i][2]);
        }
        let bids_min=bids[0].slice(0);
        let bids_max=bids[0].slice(0);
        for(let i=0;i<bids.length;i++) {
            bids[i][0] < bids_min[0] && (bids_min[0] = bids[i][0]);
            bids[i][1] < bids_min[1] && (bids_min[1] = bids[i][1]);
            bids[i][2] < bids_min[2] && (bids_min[2] = bids[i][2]);
            bids[i][0] > bids_max[0] && (bids_max[0] = bids[i][0]);
            bids[i][1] > bids_max[1] && (bids_max[1] = bids[i][1]);
            bids[i][2] > bids_max[2] && (bids_max[2] = bids[i][2]);
        }

        //计算文字最大宽度,x轴2位小数,y轴0位小数
        let ctx=this._context;
        ctx.font = Theme._fonts;
        let maxStrXW=0;
        let maxStrYW=0;
        for(let i=0;i<asks.length;i++){
            let xw=ctx.measureText(this.formatFloat(asks[i][0],4)).width;
            xw>maxStrXW && (maxStrXW=xw);
            let yw=ctx.measureText(this.formatFloat(asks[i][2],0)).width;
            yw>maxStrYW && (maxStrYW=yw);
        }
        for(let i=0;i<bids.length;i++){
            let xw=ctx.measureText(this.formatFloat(bids[i][0],4)).width;
            xw>maxStrXW && (maxStrXW=xw);
            let yw=ctx.measureText(this.formatFloat(bids[i][2],0)).width;
            yw>maxStrYW && (maxStrYW=yw);
        }

        //console.log(asks,bids,"=====================");

        //
        this.asks=asks;
        this.bids=bids;
        this.asks_min=asks_min;
        this.asks_max=asks_max;
        this.bids_min=bids_min;
        this.bids_max=bids_max;
        this.maxStrXW=maxStrXW;
        this.maxStrYW=maxStrYW;

        this.onSize(KDepth.instance.width,KDepth.instance.height);
    }

}
Plotter.instance = null;