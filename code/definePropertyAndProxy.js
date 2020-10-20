// vue3.0 响应式数据摒弃了Object.defineProperty 使用了Proxy来代替

// Object.defineProperty有一个缺陷，无法监听数组下标的变化，导致直接给数组的下标设置值，不能实时响应。
// Object.defineProperty不能劫持通过下标进行修改
let obj = {
    list: [1,3]
}
Object.defineProperty(obj, 'names', {
    value: '["Lili", "Jhon"]',
    enumerable: true,
    writable: true,
})
obj.names[2] = 'Mike'
console.log(obj.names)  // ["Lili", "Jhon"]
console.log(obj.names.push)
obj.list.push(4)
console.log(obj.list)  // [1,3,4]


// Proxy：劫持整个对象，返回整个对象， proxy是用来操作对象的，目的是为了扩展对象的能力。proxy的拦截操作有13种。
let person = {
    name: "Lili",
    list: [1,2,3]
}
let obj1 = new Proxy(person, {
    get: function (target, propKey, receiver) {
        if(propKey in target) {
            return target[propKey]
        }
        throw new Error('prop name does not exist')
    },
    set: function (target, propKey, value, receiver) {
        console.log('value',value)
        target[propKey] = value
    }
})
obj1.name = "Oj"
obj1.list[3] = 4
console.log(person) // {name: 'Oj', list: [1,2,3,4]}
// console.log(obj1.age)  //prop name does not exist

// target:要拦截的对象  handler：要拦截的行为
// let proxy = new Proxy(target, handler)

