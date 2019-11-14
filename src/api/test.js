export default {
    testData,
    testData1
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
function testData1(pageNo = 1, pageSize = 10) {
    const data = {
        // pageNo,
        // pageSize
    }
    return axios.get('/api', {
        data
    }).then(res => {
        return res
    })
}
