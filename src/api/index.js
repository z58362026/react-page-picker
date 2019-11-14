import qs from 'qs'

const type = 'application/x-www-form-urlencoded'
axios.defaults.headers['Content-Type'] = type
axios.defaults.withCredentials = true

// 在发送请求之前做某件事
axios.interceptors.request.use(config => {
    if (config.method === 'post') {
        // 表单提交需要将对象参数化
        config.data = qs.stringify(config.data)
    }
    if (config.method === 'get') {
        config.params = config.data
    }
    return config
}, err => {
    return Promise.reject(err)
})

// 在发送响应之前做某件事
axios.interceptors.response.use(res => {
    const { data } = res
    // true正常返回，根据code单独处理
    if (data.success) {
        return res
    }

    return Promise.reject(res)
}, err => {
    return Promise.reject(err)
})
