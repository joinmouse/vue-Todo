import Vue from 'vue'
import AV from 'leancloud-storage'

let APP_ID = 'FH1m2mhIwPfYcOXTmjll4rC2-gzGzoHsz'
let APP_KEY = 'H2c4tWeqKad4r7HD59UCwtM8'
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

var app = new Vue({
  el: '#app',
  data: {
    actionType: 'signUp',
    formData: {
      username: '',
      password: ''
    },
    newTodo: '',
    todoList: []
  },
  created () {
    window.onbeforeunload = () => {
      let dataString = JSON.stringify(this.todoList)
      window.localStorage.setItem('myTodo', dataString)
    }
    let oldDataString = window.localStorage.getItem('myTodo')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []
  },
  methods: {
    addTodo () {
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false
      })
      this.newTodo = ''
    },
    removeTodo () {
      let index = this.todoList.indexOf()
      this.todoList.splice(index,1)
    },
    signUp () {
      let user = new AV.User()
      user.setUsername(this.formData.username)
      user.setPassword(this.formData.password)
      user.signUp().then(function (loginedUser) {
        //console.log(loginedUser)
      }, (function(error) {
      }))
    }
  }
})