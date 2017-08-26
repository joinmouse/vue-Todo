//import xxx from 'path' => 默认导入模块
import Vue from 'vue'

var app = new Vue({
  el:'#app',
  data: {
    newTodo: '',      //newTodo作为input的值
    todoList: []      //todoList数组作为所有待办事项的容器
  },
  //验证当JS的值发生改变的时候，input.value 就会变
  //v-model的双向绑定
  created: function(){ 
    let i = 0;
    setInterval(()=>{
      this.newTodo = i
      i=i+1
    },1000)
  }
})