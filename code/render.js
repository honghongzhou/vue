// vnode = render.call(vm._renderProxy, vm.$createElement)

let obj = {
    name: 'Lisa',
    age: 12
}

let obj1 = {
    name: 'Mike',
    getInfo: function (sex) {
        console.log(this.name, this.age, sex)
    }
}

obj1.getInfo()  //Mike undefined
obj1.getInfo.call(obj, 'male')  //Lisa 12 male