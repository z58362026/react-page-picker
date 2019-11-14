import './react-picker-cn.scss'
const { useState, useReducer, useEffect, useCallback } = React
// 默认数据
const defaultOptions = {
    callback: null, // 回调函数
    current: 1, // 当前页
    prevTpl: '上一页',
    nextTpl: '下一页',
    firstTpl: '首页',
    lastTpl: '尾页',
    pageSize: 10, // 每页数量
    tplSize: 10, // bar数量,
    count: 1000 // 总数
}
// 回调
let callback = null
/**
 * 分页容器
 * @param {*} props
 */
const Picker = (props) => {
    const options = Object.assign({}, defaultOptions, props.options)

    if (props.pageCallback) {
        callback = props.pageCallback
    }
    return (
        <Element options={options}/>
    )
}
Picker.propTypes = {
    options: PropTypes.object,
    pageCallback: PropTypes.func
}
export default Picker

function reducer(state, action) {
    switch (action.type) {
        case 'prevTpl':
            return { current: Math.max(action.page, state.current - 1) }
        // case 'firstTpl':
        //     return { current: action.page }
        // case 'lastTpl':
        //     return { current: action.page }
        case 'goTpl':
            if (!/^[1-9]\d*|0$/.test(action.page)) {
                callback && callback(state.current, { msg: '输入合法数字', state: 'fail' })
                return { current: state.current }
            }
            if (!action.page) {
                callback && callback(state.current, { msg: '输入页数不存在', state: 'fail' })
                return { current: state.current }
            }
            if (action.page > action.endPage) {
                callback && callback(state.current, { msg: '输入页数过长', state: 'fail' })
                return { current: state.current }
            }
            if (action.page < 1) {
                callback && callback(state.current, { msg: '输入页数过短', state: 'fail' })
                return { current: state.current }
            }
            return { current: action.page >> 0 }
        case 'nextTpl':
            return { current: Math.min(action.page, state.current + 1) }
        default:
            return { current: action.page }
    }
}
/**
 * 生成一个新的可视化数组序列
 * @param {当前页} current
 * @param {页的数组} pages
 * @param {结束页} endPage
 * @param {页的长度} pageLen
 */
const createPages = (current, pages, endPage, pageLen) => {
    const half = pageLen / 2 >> 0
    const lang = Math.min(half, 3) // 临界点兼容处理
    const first = pages[0] // 当前数组第一个
    const maxFirst = Math.max(1, first - lang) // 结果数组第一个，兼容处理
    const last = pages[pages.length - 1] // 当前数组最后一个
    const minLast = Math.min(endPage, last + lang) // 结果数组最后以为，兼容处理
    let startPage = first
    // 不同情况下，结果数组第一位取值不一样
    switch (current) {
        case 1:
            startPage = 1
            break
        case endPage:
            startPage = 1 + endPage - pageLen
            break
        case first:
            startPage = maxFirst
            break
        case last:
            startPage = 1 + minLast - pageLen
            break
    }
    // 跳转生成分页数组
    if (!pages.includes(current)) {
        startPage = Math.min(Math.max(current - half, 1), endPage - pageLen + 1)
    }
    return Array.from(new Array(pageLen), (item, index) => index + startPage)
}
/**
 * 页面元素
 * @param {*} props
 */
const Element = (props) => {
    const op = props.options
    const endPage = Math.ceil(op.count / op.pageSize) // 结束页面
    const pageLen = Math.min(endPage, op.tplSize) // 数组长度
    const [state, dispatch] = useReducer(reducer, { current: op.current }) // 当前页面
    const [pages, usePages] = useState([]) // 翻页数组
    const [goPage, setGo] = useState(1)
    const onChange = (e) => {
        setGo(e.target.value)
    }
    const styleHandler = useCallback(
        (page, styles) => {
            return state.current === page ? styles : ''
        },
        [state.current]
    )
    useEffect(() => {
        usePages(createPages(state.current, pages, endPage, pageLen))
        callback && callback(state.current)
    }, [state.current])

    return (
        <div className="picker-content">
            <ul className="picker-page">
                <li className={styleHandler(1, 'noActive')} onClick={() => dispatch({ type: 'prevTpl', page: 1 })}>{op.prevTpl}</li>
                <li className={styleHandler(1, 'noActive')} onClick={() => dispatch({ type: 'firstTpl', page: 1 })}>{op.firstTpl}</li>
                {pages.map(page =>
                    <li className={['picker-item-short', styleHandler(page, 'active')].join(' ')} onClick={() => dispatch({ type: 'number', page })} key={page.toString()}>{page}</li>
                )}
                <li className={styleHandler(endPage, 'noActive')} onClick={() => dispatch({ type: 'lastTpl', page: endPage })} >{op.lastTpl}</li>
                <li className={styleHandler(endPage, 'noActive')} onClick={() => dispatch({ type: 'nextTpl', page: endPage })}>{op.nextTpl}</li>
            </ul>
            <ul className="picker-go">
                <li className="">
                    <input type="text" onChange={onChange}/>
                </li>
                <li className="picker-item-go picker-item-big">
                    <span onClick={() => dispatch({ type: 'goTpl', page: goPage, endPage })}>跳转</span>
                </li>
            </ul>
        </div>)
}
Element.propTypes = {
    options: PropTypes.object,
    count: PropTypes.number,
    pageSize: PropTypes.number
}
