# vue源码解析
## vue中的Runtime Only和Runtime + Compiler
* Runtime Only：使用Runtim Only版本的vue.js的时候，通常需要借助webpack的vue-loader工具把.vue文件转换成javascript。因为是在编译阶段做的，所以它只包含vue.js代码，因此代码体积比较轻量。
*  Runtime Compiler：如果我们没有对代码做预编译，然而我们又使用了template属性，并传入一个字符串，则需要在客户端编译模板。   
## vue中为什么用function而不用ES6中的Class去实现
* 我们可以看到很多的 xxxMixin 函数的调用，并把vue作为参数传入，它们的功能都是给vue的prototype上扩展一些方法，vue按功能把这些扩展分散到多个模块中实现，而不是在一个模块中实现所有，这种方法是 Class 难以实现的。这么做的好处是非常方便代码的管理和维护。
## vue 的一个核心 数据驱动
* 数据驱动是指视图是由数据驱动生成，我们对视图的修改不会直接操作DOM，而是修改数据。
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
