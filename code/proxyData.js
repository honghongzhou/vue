
// 访问 this.name 等同于访问 this.data.name 
let obj = {
    data: {
        name: 'Lili',
        age: 12
    }
}
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: function () {},
    set: function () {}
}

function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
        return obj[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
        obj[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}   
function initData () {
    let keys = Object.keys(obj.data)
    let i = keys.length
    while(i--) {
        const key = keys[i]
        proxy(obj, 'data', key)
    }
}


initData()

console.log(obj.name)  //Lili

obj.name = 'Jhon'  

console.log(obj.name) //Jhon