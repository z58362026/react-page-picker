
/**
 * 学生列表
 */
import '../common/style/app.scss'
import api from '@api/test'
import Picker from '../compontents/react-picker-cn'
const { useState, useEffect } = React
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
            <Picker pageCallback={pageCallback} options={pageOptions}></Picker>
        </div>
    )
}
export default App
