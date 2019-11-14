/**
 * 此缓存只能支持pageSize不是动态可变的
 */
const cachePage = new Map()
let cacheSize = null

module.exports = {
    'GET /api/list': (req, res) => {
        let { pageNo, pageSize } = req.query
        const count = 362
        if (pageNo < 0 || pageNo > Math.ceil(362 / pageSize)) {
            return res.json({
                code: 10001,
                success: false,
                message: '非法数字'
            })
        }
        // 清空缓存列表
        if (cacheSize !== pageSize) {
            cachePage.clear()
            cacheSize = pageSize
        }
        // 获取新列表
        const startPage = (pageNo - 1) * pageSize
        let list = null
        if (cachePage.has(pageNo)) {
            list = cachePage.get(pageNo)
        } else {
            pageSize = Math.min(count - pageSize * (pageNo - 1), pageSize)
            list = Array.from(new Array(Number(pageSize)), (item, index) => {
                return {
                    studentId: index + 1 + startPage,
                    name: ['李雷', '韩梅梅', '胡军', '刘娜', '明明', '许冰', '李子真'][Math.random() * 7 >> 0],
                    age: (Math.random() * 3 >> 0) + 20,
                    sex: ['男', '女'][Math.random() * 2 >> 0]
                }
            })
            cachePage.set(pageNo, list)
        }
        const end = Math.ceil(362 / pageSize) === pageNo
        return res.json({
            code: 200,
            success: true,
            data: {
                list,
                count,
                end
            }
        })
    }
}
