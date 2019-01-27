let Theme={
    _color:{
        background: "#191f2e",      // 背景
        axisLine: "#999",             // 坐标轴
        gridLine: "#333",              //网格线
        depthLine1: "#2bb789",          //买-深度线
        depthLine1Fill: "rgba(12,159,204,0.3)",         //买-深度线透明填充
        depthLine2: "#d84747",                          //卖-深度线
        depthLine2Fill: "rgba(216,47,47,0.3)",      //卖-深度线透明填充
        scaleFontColor: "#999",                     // 坐标轴文本
        //barFill1: "#2bb789",                        //买-柱状线
        //barFill2: "#d84747",                        //卖-柱状线
        infoFontColor: "rgb(43, 183, 137)",       //左上方-鼠标提示文本
    },
    _fonts: Math.max(window.devicePixelRatio,1) * 12 +"px Tahoma",                               //字体
};

export default Theme;