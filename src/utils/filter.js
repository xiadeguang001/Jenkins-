import Vue from "vue";
import * as dayjs from "dayjs";

Vue.filter('NumberFormat', function (value) {
  if (!value && value!=0) {
    return ''
  }
  let datas = value.toString().split('.')
  let intPartFormat = datas[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断
  if(datas.length > 1){
    intPartFormat = intPartFormat + "." + datas[1]
    intPartFormat = parseFloat(intPartFormat).toFixed(2)
  }
  return intPartFormat
})

Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

/** 字符串超长截取省略号显示 */
Vue.filter('ellipsis', function (value, vlength = 25) {
  if(!value){
    return "";
  }
  var lengthCompare = vlength*2;
  console.log('vlength: '+ vlength);
  if (GetCharLength(value) > lengthCompare) {
    // return value.slice(0, lengthCompare) + '...'
    return reBytesStr(value, lengthCompare) + '...'
  }
  return value
})


function GetCharLength(str){
  var iLength = 0;  //记录字符的字节数
    for(var i = 0;i<str.length;i++){//遍历字符串中的每个字符
        if(str.charCodeAt(i) >255){   //如果当前字符的编码大于255
            iLength += 2;    //所占字节数加2
         }else{
             iLength += 1;   //否则所占字节数加1
         }
     }
     
  return iLength;   //返回字符所占字节数
}

function reBytesStr(str, len) {
  if ((!str && typeof(str) != 'undefined')) {return '';}
  var num = 0;
  var str1 = str;
  var str2 = '';
  if(str1!=null && str1!= undefined){
    for (var i = 0,lens = str1.length; i < lens; i++) {
        num += ((str1.charCodeAt(i) > 255) ? 2 : 1);
        if (num > len) {
            break;
        } else {
            str2 = str1.substring(0, i + 1);
        }
    }
  }
  return str2;
}