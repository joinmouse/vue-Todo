//import xxx from 'path' => 默认导入模块
import Vue from 'vue'

var app = new Vue({
  el:'#app',
  data: {
    newTodo: '',      //newTodo作为input的值
    todoList: []      //todoList数组作为所有待办事项的容器
  },
  methods: {
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date()
      })
      this.newTodo = ''  //输入后变为空
    }
  }
})