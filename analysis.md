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
* vue构建过程：
1. npm包管理下的package.json， npm run build => node acripts/build.js
2. 从配置文件读取配置，再通过命令行参数对构建配置做过滤，这样就可以构建不同用途的vue.js了。
## vue中的Runtime Only和Runtime + Compiler
* Runtime Only：使用Runtim Only版本的vue.js的时候，通常需要借助webpack的vue-loader工具把.vue文件转换成javascript。因为是在编译阶段做的，所以它只包含vue.js代码，因此代码体积比较轻量。（提前编译）
* Runtime Compiler：如果我们没有对代码做预编译，然而我们又使用了template属性，并传入一个字符串，则需要在客户端编译模板。  （用到时才编译）
*  通常我们的项目中，我们一般用Runtime Only进行开发。使用vue-loader进行提前编译。
## vue的入口
* 分析 runtime + compiler 构建出来的vue.js
* 入口是 \src\platforms\web\entry-runtime-with-compiler.js
## vue中为什么用function而不用ES6中的Class去实现
* 我们可以看到很多的 xxxMixin 函数的调用，并把vue作为参数传入，它们的功能都是给vue的prototype上扩展一些方法，vue按功能把这些扩展分散到多个模块中实现，而不是在一个模块中实现所有，这种方法是 Class 难以实现的。这么做的好处是非常方便代码的管理和维护。
## vue的入口及本质
* 入口：entry-runtime-with-compiler.js（选择的是Runtime + Compiler版本的Vue）
* 本质：一个函数，并且通过mixin给这个函数的原型prototype上扩展了很多的方法，还会initGlobalApi中给vue对象扩展全局的静态方法。
## vue 的一个核心 数据驱动
* 数据驱动是指视图是由数据驱动生成，我们对视图的修改不会直接操作DOM，而是修改数据。
* 这里包含两块：1.模板和数据渲染成最终的dom 2.数据更新驱动视图变化
* 模板和数据渲染成最终的DOM
## new Vue到底发生了什么
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
## Vue实例挂载的实现
> 1. Vue中，我们是通过$mount实例方法来挂在vm的，$mount方法是和平台以及构建方式相关的，因此有很多的$mount方法，我们这次看的是runtime+compiler版本的vue，因此它的$mount方法在web下的entry-runtime-with-compiler.js文件中。
> 2. entry-runtime-width-compiler.js文件中，首先缓存了原型上的$mount方法，然后再重新定义了该方法。首先，限制了Vue不能挂在到body或者是html上；接下来如果没有render方法，则会把template或者是el通过compileToFunctions转换成render方法；最后调用原型上的$mount方法进行挂在。
> 3. 原先原型上的$mount方法，在src\platforms\web\runtime\index.js文件中。
> 4. 原先原型上的$mount会调用mountComponent。mountComponent的核心就是把vm._render方法先生成虚拟的Node，再实例化一个渲染Watcher，在它的回调函数中，调用updateComponent，最终调用vm._update更新DOM
## render
> 1. vw._render最终是通过createElement方法返回vnode，它是一个虚拟的DOM。
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
* vnode的create是通过之前提到的createElement创建的。
## createElement
* crateElement创建VNode过程，每一个VNode都有一个children，每个children也是VNode，这样就形成了一个VNode tree，它很好的描述了我们的DOM tree。
## update
## 响应式原理
* vue中的响应式是应用了ES5中的Object.defineProperty。这也就是为什么vue.js为什么不能兼容IE8以下的浏览器的原因。
## 组件化
## 生命周期
> lifecycle.js callhook init.js lifecycle.js patch.js(invokeInsertHook)
## 编译
> 1. 编译入口函数的位置 （enrty-runtime-with-compiler.js compileToFunctions）
## 响应式原理（数据的变更驱动DOM的变化）
### 响应式对象 (什么是响应式对象，实现响应式对象的一个过程)
> Object.defineProperty(obj,prop,descriptor) vue初始化 initState initProps initData proxy observe Observe defineReactive observe断点调试
> 响应式对象的核心：利用Object.defineProperty给数据添加了getter和setter，目的就是为了让我们访问数据以及写数据的时候能做一些逻辑，getter做的是依赖收集，setter做的是派发更新
### 依赖收集
> 目的：当我们修改数据的时候，可以对相关的依赖派发更新
### 派发更新
> 目的：当数据发生变化的时候，触发setter逻辑，把在依赖过程中订阅的所有的观察者，也就是watcher，触发他们的update过程，这个过程又利用了队列做了一系列的优化，在nextTick后执行所有的watcher的run，最后执行它们的回调函数。
## 变化侦测，模板编译，virtualDOM，整体运行流程等