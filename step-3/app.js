//import xxx from 'path' => 默认导入模块
import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'FH1m2mhIwPfYcOXTmjll4rC2-gzGzoHsz';
var APP_KEY = 'H2c4tWeqKad4r7HD59UCwtM8';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});


var app = new Vue({
  el:'#app',
  data: {
    actionType: 'signUp',
    formData: {
      username: '',
      emial: '',
      password: '',
    },
    currentUser: null,  ///LeanCloud文档: AV.User.current() 可以获取当前登录的用户
    newTodo: '',      //newTodo作为input的值
    todoList: []      //todoList数组作为所有待办事项的容器
  },
  methods: {
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        done: false  //添加done属性
      })
      this.newTodo = ''  //输入后变为空
      this.saveOrUpdateTodos()
    },
    saveOrUpdateTodos: function(){
      if(this.todoList.id){
        this.updateTodos()
      }else{
        this.saveTodos()
      }
    },
    updateTodos: function(){
      //JSON 在序列化这个有 id 的数组的时候，会得出怎样的结果？
      let dataString = JSON.stringify(this.todoList)  
      let avTodos = AV.Object.createWithoutData('AllTodos',this.todoList.id)
      avTodos.set('content',dataString)
      avTodos.save().then(()=>{
        console.log('更新成功')
      })
    },


    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是ES5新加的 API
      this.todoList.splice(index,1)
    }
  },
  create:function(){
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList)   // JSON文档
      window.localStorage.setItem('myTodos', dataString) // localStorage文档
    }
    //检查用户是否登录
    this.currentUser = this.getCurrentUser();

    //获取User的Todos
    this.fetchTodos()
    
    ////本地保存newTodo未发布内容
    let uncompleteDataString = window.localStorage.getItem('typeTodo')
    let uncompleteData = JSON.parse(uncompleteDataString)
    this.newTodo = uncompleteData || []
  }
})