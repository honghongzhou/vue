// Vue的本质是一个Function
function Vue (options) {

}

_initMixn (Vue)


// 给vue的原型prototype上扩展方法
function _initMixn (Vue) {
    Vue.prototype.someMethod = function () {
        console.log('通过mixin在Vue上面扩展各种方法')
    }
}

initGlobalAPI(Vue)


// 给vue对象扩展一些静态的全局方法
function initGlobalAPI (Vue) {
    Vue.someStaticMethod = function () {
        console.log('初始化一些vue的全局静态方法。例如：nextTick,set等等')
    }
}