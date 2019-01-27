 /**
   * 复制到剪贴板
   * el: input, 或textarea表单元素
   * return true成功或false
   */

  function selectText(textbox, startIndex, stopIndex) {
    if(textbox.createTextRange) {//ie
        var range = textbox.createTextRange();
        range.collapse(true);
        range.moveStart('character', startIndex);//起始光标
        range.moveEnd('character', stopIndex - startIndex);//结束光标
        range.select();//不兼容苹果
    }else{//firefox/chrome
        textbox.setSelectionRange(startIndex, stopIndex);
        textbox.focus();
    }
  }

  export default function copy(el) {
    let valueLength = el.value.length;
    selectText(el, 0, valueLength);
    try {
      if (document.execCommand("Copy", false, null)) {
        document.execCommand("Copy");
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }