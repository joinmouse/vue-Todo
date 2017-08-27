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
  el: '#app',
  data: {
    actionType: 'signUp',
    formData: {
      username: '',
      email: '',
      password: ''
    },
    newTodo: '',
    todoList: [],
    currentUser: null   //LeanCloud 文档说 AV.User.current() 可以获取当前登录的用户
  },
  created: function(){
    window.onbeforeunload = ()=>{

      window.localStorage.setItem('myTodos', dataString)
      //获取newTodo未发布内容
      let oneditString = JSON.stringify(this.newTodo)
      window.localStorage.setItem('typeTodo', oneditString)

    }

    //检查用户是否登录
    this.currentUser = this.getCurrentUser();

    //获取 User 的 AllTodos
    this.fetchTodos() // 将原来写的的一堆代码取一个名字叫做 fetchTodos

    //本地保存newTodo未发布内容
    let uncompleteDataString = window.localStorage.getItem('typeTodo')
    let uncompleteData = JSON.parse(uncompleteDataString)
    this.newTodo = uncompleteData || []
  },

  methods: {

    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false //添加一个 done 属性
      });
      this.newTodo = ''; //输入完成之后清空newTodo
      this.saveOrUpdateTodos()  //// 不能再用 this.saveTodos() 了
    },

    saveOrUpdateTodos: function(){
      if(this.todoList.id){
        this.updateTodos()
      }else {
        this.saveTodos()
      }
    },

    saveTodos: function(){
      let dataString = JSON.stringify(this.todoList)
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();

      //添加访问控制
      var acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(), true) //只有这个 user 能读
      acl.setWriteAccess(AV.User.current(), true) //只有这个 user 能写

      avTodos.set('content', dataString);
      avTodos.setACL(acl) //设置访问控制
      avTodos.save().then((todo) => {
        //保存成功后，执行其他逻辑
        this.todoList.id = todo.id //一定要把 id 挂到 this.todoList 上，否则下次就不会调用 updateTodos 了
        console.log('保存成功');
      },function(error){
        alert('保存失败');
      });
    },

    updateTodos: function(){
      //先看文档 https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
      let dataString = JSON.stringify(this.todoList) //JSON 在序列化这个有 id 的数组的时候，会得出怎样的结果？
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(() => {
        console.log('更新成功')
      })

    },

    fetchTodos: function(){
      if(this.currentUser) {
        var query = new AV.Query('AllTodos');
        query.find().then((todos) => {
          let avAllTodos = todos[0] //理论上 AllTodos 只有一个，所以我们取结果的第一项
          let id = avAllTodos.id
          this.todoList = JSON.parse(avAllTodos.attributes.content)
          this.todoList.id = id //为什么给 todoList 这个数组设置 id？因为数组也是对象啊

        }, function (error) {
          console.error(error)
        })
      }
    },

    //删除功能
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是 ES 5 新加的 API
      this.todoList.splice(index,1)
      this.saveOrUpdateTodos()  //// 不能再用 this.saveTodos() 了
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
      if (/^\w+@[\w-]+\.\w+(\.\w+)?$/.test(this.formData.email)) {
        if (/\w{3,}/.test(this.formData.username)) {
          if (/\w{6,}/.test(this.formData.password)) {
            user.signUp().then((loginedUser)=> { //将 function 改成箭头函数，方便使用 this
              this.currentUser = this.getCurrentUser()  //获取当前登录用户
            }, (error)=> {
              alert('注册失败，请检查')
              console.log(error)
            });

          } else {
            alert("密码不能小于6个字符")
          }

        } else {
          alert("用户名必须大于3个字符")
        }
      } else{
        alert("邮箱格式不正确")
      }

    },

    //登录
    login: function(){
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser)=> {
        this.currentUser = this.getCurrentUser()  //获取当前登录用户
        this.fetchTodos()  //登录成功后读取 todos
      }, (error)=> {
        console.log(error)
      });
    },

    //获取当前登录用户
    getCurrentUser: function(){
      //首先要判断用户是否登录
      let current = AV.User.current()
      if (current){
        let {id, createdAt, attributes: {username}} = AV.User.current();
        // 我的《ES 6 新特性列表》里面有链接：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        return {id, username, createdAt} // 看文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#ECMAScript_6%E6%96%B0%E6%A0%87%E8%AE%B0
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

  }
})