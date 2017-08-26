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
        createdAt: new Date(),
        done: false  //添加done属性
      })
      this.newTodo = ''  //输入后变为空
    },
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是ES5新加的 API
      this.todoList.splice(index,1)
    }
  },
  create:function(){
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList) // JSON 文档: 
      window.localStorage.setItem('myTodos', dataString) // localStorage文档
    }
    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []
  }
})