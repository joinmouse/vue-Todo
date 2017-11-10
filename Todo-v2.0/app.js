import Vue from 'vue'
import AV from 'leancloud-storage'

let APP_ID = '8axnRtGoxCJhEzsvNPEAHnol-gzGzoHsz';
let APP_KEY = '0YH4XkYflb4CUPfA743TGj8G';
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
      password: ''
    },
    newTodo: '',
    todoList: [],
    currentUser: null,
  },
  methods: {
    addTodo() {
      this.todoList.push({
        title: this.newTodo,
        createTime: new Date().Format("yyyy-mm-dd hh:mm:ss"),
        done: false // 添加一个 done 属性
      })
      this.newTodo = ''
    },
    removeTodo (todo){
      let index = this.todoList.indexOf()
      this.todoList.splice(index,1) 
    },
    signUp () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        console.log(this)
        this.currentUser = this.getCurrentUser()
      }, (error) => {
        alert('注册失败')
      });
    },
    login () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
        console.log(this.getCurrentUser)
      }, function (error) {
        alert('登录失败')
      });
    },
    logout () {
      AV.User.logOut()
      this.currentUser = null
      window.location.reload()
    },
    getCurrentUser () {
      let current = AV.User.current()
      if(current) {
        let {id, createdAt, attributes: {username}} = current
        return {id, username, createdAt} 
      } else {
        return null
      }
    },
    saveTodos () {
      let dataString = JSON.stringify(this.todoList)
      var AVTodos = AV.Object.extend('AllTodos')
      var avTodos = new AVTodos()
      //创建一个ACL实例
      var acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(), true)
      acl.setWriteAccess(AV.User,current(), true)

      acTodos.setACL(acl)  //设置访问控制

      avTodos.set('content', dataString);
      avTodos.save().then((todo) => {
        this.todoList.id = todo.id
        console.log(this.todoList);
        console.log('保存成功');
      }, function (error) {
        // 异常处理
        console.log('保存失败');
      });
    },
    updateTodos() {
      let dataString = JSON.stringify(this.todoList)
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(()=>{
        console.log('更新成功')
      })
    },
    saveOrUpdateTodos() {
      if(this.todoList.id){
        this.updateTodos()
      } else {
        this.saveTodos()
      }
    },
    fetchTodos() {
      if(this.currentUser){
        var query = new AV.Query('AllTodos');
        query.find()
            .then((todos) => {
              let avAllTodos = todos[0]  // 因为理论上 AllTodos 只有一个，所以我们取结果的第一项
              let id = avAllTodos.id
              this.todoList = JSON.parse(avAllTodos.attributes.content)
              this.todoList.id = id
              console.log(todos)
            }, function(error){
              console.error(error)
            })
      }
    }
  },
  created() {
    this.currentUser = this.getCurrentUser()
    this.fetchTodos()
    //日期格式化
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  },
  watch: {
    todoList: {
      handler: function () {
        this.saveOrUpdateTodos()
      },
      deep: true
    }
  }
})
