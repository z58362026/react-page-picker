import './index'
export default {
    testData
}
function testData(pageNo = 1, pageSize = 10) {
    const data = {
        pageNo,
        pageSize
    }
    return axios.get('/api/list', {
        data
    }).then(res => {
        return res
    })
}
