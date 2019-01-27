import FileSaver from "file-saver";
// 导出excel
/**
 *
 * str: 格式实例'时间,币种,类型,金额数量\n2018-02-03,btc,提币,1\n2018-02-03,btc,提币,1'
 *  **/
export default function exportExcel(str,fileName){
  let exportContent = "\uFEFF";
  let blob = new Blob([exportContent + str], {
    type: "text/plain;charset=utf-8"
  });
  FileSaver.saveAs(blob, fileName);
}