# react-page-picker

## Picture

![preview-dark](https://github.com/z58362026/react-page-picker/blob/master/src/resource/WX20191114-162617@2x.png?raw=true)

## Example

```

/**
 * 学生列表
 */
import '../common/style/app.scss'
import api from '@api/test'
// import Picker from '../compontents/react-picker-cn'
// import loadable from '@loadable/component'
const { useState, useEffect, lazy, Suspense } = React
const Picker = lazy(() => import('../compontents/react-picker-cn'))
const cacheList = new Map()
const App = () => {
    const [pageNo, setPageNo] = useState(1)
    const pageSize = 20
    const [list, setList] = useState([])
    const pageCallback = (page) => {
        setPageNo(page)
    }
    const [pageOptions, setPageOptions] = useState(
        {
            current: pageNo,
            pageSize,
            tplSize: 12
        })
    useEffect(() => {
        if (cacheList.has(pageNo)) {
            const data = cacheList.get(pageNo)
            setList(data.list)
            return
        }
        api.testData(pageNo, pageSize).then((res) => {
            console.log(res)
            setList(res.data.data.list)
            cacheList.set(pageNo, res.data.data)
            if (!pageOptions.count) {
                pageOptions.count = res.data.data.count
                setPageOptions(Object.assign({}, pageOptions))
            }
        })
    }, [pageNo])
    return (
        <div className="student_content">
            <ul>
                <li>
                    <span>学号</span>
                    <span>姓名</span>
                    <span>性别</span>
                    <span>年龄</span>
                </li>
                {
                    list.map(item =>
                        <li key={item.studentId}>
                            <span>{item.studentId}</span>
                            <span>{item.name}</span>
                            <span>{item.sex}</span>
                            <span>{item.age}</span>
                        </li>
                    )
                }
            </ul>
            <Suspense fallback={<div>loading</div>}>
                <Picker pageCallback={pageCallback} options={pageOptions} />
            </Suspense>
        </div>
    )
}
export default App

```

## Options

| Name     | Type   | Default  | Description                         |
| -------- | ------ | -------- | ----------------------------------- |
| current  | Number | 1        | Initialize home page number         |
| prevTpl  | String | `上一页` | The previous page                   |
| nextTpl  | String | `下一页` | The next page                       |
| firstTpl | String | `首页`   | Home page                           |
| lastTpl  | String | `尾页`   | back                                |
| pageSize | Number | 10       | The default length of the page data |
| tplSize  | Number | 10       | Page number default length          |
| count    | Number | 100      | Total number of page arrays         |

## Event

pageCallback: 回调函数

    page : 必选，当前点击页数
    error: 错误信息
