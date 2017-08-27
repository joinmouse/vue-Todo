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
    saveTodos: function(){
      let dataString = JSON.stringify(this.todoList)
      let AVTodos = AV.Object.extend('AllTodos');
      let avTodos = new AVTodos();

      //添加访问控制
      let acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(), true)   //只有这个 user 能读
      acl.setWriteAccess(AV.User.current(), true)  //只有这个 user 能写

      avTodos.set('content', dataString)
      avTodos.setACL(acl)    //设置访问控制
      avTodos.save().then((todo)=>{
        this.todoList.id = todo.id   //一定要把 id 挂到 this.todoList 上，否则下次就不会调用 updateTodos 了
        console.log('保存成功');
      },function(error){
        alert('保存失败')
      });
    },

    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是ES5新加的 API
      this.todoList.splice(index,1)
    },

    fetchTodos: function(){
      if(this.currentUser){
        let query = new AV.Query('AllTodos');
        query.find().then((todos)=>{
          let avAllTodos = todo[0]   //理论上 AllTodos 只有一个，所以我们取结果的第一项
          let id = avAllTodos.id
          this.todoList = JSON.parse(avAllTodos.attributes.content)
          this.todoList.id = id      //为什么给 todoList 这个数组设置 id？因为数组也是对象啊
        },function(error){
          console.log('error')
        })
        
      }
    },

    //注册
    signUp: function(){
      // 新建 AVUser 对象实例
      let user = new AV.User();
      // 设置用户名
      user.setUsername(this.formData.username);
      // 设置邮箱
      user.setEmail(this.formData.email);
      // 设置密码
      user.setPassword(this.formData.password);

      //正则判断用户注册信息
      if(/^\w+@[\w-]+\.\w+(\.\w)+?$/.tset(this.formData.email)){
        if(/\w{3,}/.test(this.formData.username)){
          if(/\w{6,}/.test(this.formData.password)){
            user.signUp().then((loginedUser)=>{   //function使用箭头函数，方便使用this
              this.currentUser = this.getCurrentUser  //获取当前登录用户
            },(error)=>{
              alert('注册失败')
              console.log(error)
            });
          } else {
            alert('密码不少于6个字符')
          }
        } else {
          alert('用户名必须大于三个字符')
        }
      } else {
        alert("邮箱格式不正确")
      }
    },

    //登录
    login: function(){
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser)=> {
        this.currentUser = this.getCurrentUser()  //获取当前登录用户
        this.fetchTodos()   //登录成功后读取todos
      },(error) => {
        console.log('error')
      });
    },

    //获取当前登录用户
    getCurrentUser: function(){
      //判断用户是否登录
      let current = AV.User.current()
      if (current){
        let {id, createdAt, attributes: {username}} = AV.User.current();
        return {id,username}
      } else {
        return null
      }
    },

    //退出登录
    logout: function(){
      AV.User.logOut()
      this.currentUser = null
      window.location.reload()
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