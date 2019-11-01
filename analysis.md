# vue源码解析
## vue 中的 Runtime Only 和 Runtime + Compiler
* Runtime Only：使用Runtim Only版本的vue.js的时候，通常需要借助webpack的vue-loader工具把.vue文件转换成javascript。因为是在编译阶段做的，所以它只包含vue.js代码，因此代码体积比较轻量。
*  Runtime Compiler：如果我们没有对代码做预编译，然而我们又使用了template属性，并传入一个字符串，则需要在客户端编译模板。   