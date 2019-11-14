const pro = require('./pro')

module.exports = Object.assign({}, pro, {
    name: 'test',
    docker: 'test',
    host: {
        cdn: 'local.yqxiu.cn'
    }
})
