//import xxx from 'path' => 默认导入模块
import bar from './bar'
import Vue from 'vue'

//调用导入的bar模块函数
bar();

var app = new Vue({
  el:'#app',
  data: {
    message: 'hello world !'
  }
})