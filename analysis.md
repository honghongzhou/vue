# vue源码解析(2.5)
## flow
* 目的：在babel编译的时候就发现由于类型引起的bug（ES6编译成js）
* facebook出品得javascript静态类型检查工具
* flow的两种工作方式 1. 类型推断  2. 类型注释
* .flowconfig
## 源码目录
* compiler:     编译相关(编译 模板解析成ast树)
* core:         核心代码(内置组件、全局 API 封装，Vue 实例化、观察者、虚拟DOM、⼯具函数)
* platforms:    不同平台的支持 (web  weex客户端)
* server:       服务端渲染
* sfc:          .vue文件解析(将.vue文件解析成一个js对象)
* shared:       共享文件
## 源码的构建
* 基于roolup,相关配置在script目录下
* run build 构建的入口文件 script/build.js
* roolup 和 webpack 的区别：roolup 和 webpack 都是一个构建工具，但是webpack会更加的强大，webpack会把图片，js等静态资源都会编译成javascript，但是roolup更适合一种javascript库的编译，只处理js部分，因此更加轻量。（构建的代码：package.json）
## vue中的Runtime Only和Runtime + Compiler
* Runtime Only：使用Runtim Only版本的vue.js的时候，通常需要借助webpack的vue-loader工具把.vue文件转换成javascript。因为是在编译阶段做的，所以它只包含vue.js代码，因此代码体积比较轻量。
* Runtime Compiler：如果我们没有对代码做预编译，然而我们又使用了template属性，并传入一个字符串，则需要在客户端编译模板。   
## vue中为什么用function而不用ES6中的Class去实现
* 我们可以看到很多的 xxxMixin 函数的调用，并把vue作为参数传入，它们的功能都是给vue的prototype上扩展一些方法，vue按功能把这些扩展分散到多个模块中实现，而不是在一个模块中实现所有，这种方法是 Class 难以实现的。这么做的好处是非常方便代码的管理和维护。
## vue 的一个核心 数据驱动
* 数据驱动是指视图是由数据驱动生成，我们对视图的修改不会直接操作DOM，而是修改数据。
* 这里包含两块：1.模板和数据渲染成最终的dom 2.数据更新驱动视图变化
* 模板和数据渲染成最终的DOM
```
    <div id="app">
        {{ message }}
    </div>

```
```
    var app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!'
        }
    })
```
> 1. new Vue 初始化一个vue的实例，然后进行init （为什么我们可以通过this.a访问data上的a,因为在initState初始化的时候，对数据使用了proxy进行了代理）
> 2. init初始化生命周期,data,methods,watch等等，之后如果检测到el，就使用$mount进行挂载 （entry-runtime-with-compiler.js）
> 3. vue实例挂载的实现，在$mount中，如果没有定义render方法，则会把el或者template通过compileToFunctions转换成render，最后调用原型上的$mount进行挂在
> 4. 原型上的$mount主要是通过vm._render()生成vnode，再通过vm._update()内部使用patch()进行渲染
> 5. render函数（src/core/instance/render.js）(从$options拿到render函数->render.call(执行上下文，参数)->$createElement在initRender中，initRender在init初始化->vm._renderProxy也在init方法中，生产环境中就是vm,开发环境es6的proxy->hasProxy判断浏览器支不支持proxy)
> 6. createElment
> 7. update lifecycle.js中
## 模板和数据如何最终渲染成最终的DOM
## nodeType
## Virtual DOM
```
    var div = document.createElement('div')
    var str = ''
    for(var key in div) {
        str+=key+' '
    }
```
* 可以看出真正的DOM是非常庞大的，因为浏览器的标准把它设计的非常复杂，当我们频繁的去做DOM的更新的时候，会产生性能问题。
* virtual dom就是用原生的js对象去描述一个dom节点，所以它比创建一个dom的代价要低很多。在vue.js中，virtual dom用VNode这样一个class去定义的。
## 响应式对象
## vm是什么
## proxy
## _createElement data参数不允许是响应式的
## createEmptyVNode 注释节点 注释vnode
## render方法生成vnode，如何将一个字符串或者是vue的指令解析成js
## 组件化
## 生命周期
> lifecycle.js callhook init.js lifecycle.js patch.js(invokeInsertHook)
## 编译
> 1. 编译入口函数的位置 （enrty-runtime-with-compiler.js compileToFunctions）
    
