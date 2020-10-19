// 这里模拟了vue构建的一个简单的流程
//1. getAllBuilds()返回相应配置的对象数组
// let obj = {
//   param1: {
//       name: 'Li',
//       age: 12
//   },
//   param2: {
//       name: 'Za',
//       age: 14
//   }
// }
// function getConfig (name) {
//   let config = obj[name]
//   return {
//       name: config.name,
//       age: config.age
//   }
// }
// let builds = Object.keys(obj).map(getConfig)
// console.log(builds)
// [
//   {name: 'Li', age: 12},
//   {name: 'Za', age: 14}
// ]


// 2 build(builds)

function build (builds) {
    let build = 0
    const total = builds.length
    const next = () => {
        buildEntry(builds[build]).then(() => {
            build ++
            if(build < total) {
                next()
            }
        }).catch(err => {
            console.log(err)
        })
    }
    next()
}
function buildEntry (config) {
    return new Promise ((resolve, reject) => {
        console.log(config)
        console.log('根据配置使用rollup进行打包')
        resolve()
    })
}

build([{name: 'Lili'}, {name: 'Xj'}])