module.exports = {
  entry: './app.js',      //入口
  output: {               //出口
    filename: 'bundle.js'
  },
  module: {               //Loaders配置
    loaders:[
      {
        test: /\.js[x]?$/,    //一个用来匹配loaders所处理文件的拓展名的正则表达式
        exclude: /node_modules/,   //手动添加必须处理的文件（文件夹）
        loader: 'babel-loader?presets[]=es2015&presets[]=react'  //loader的名称
      },
    ]
  },
  resolve: {    //Resolve is used to find “import” and “require” references that are not immediately available in the current path.
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}