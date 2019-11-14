
/**
 * 跳转不同样式
 */
import '../common/style/app.scss'
const { Link } = ReactRouterDOM

const App = (props) => {
    console.log(props)
    return (
        <header className="">
            <ul>
                <li><Link to="/pickerCN">中文分页</Link></li>
                <li><Link to="/pickerEN">箭头分页</Link></li>
            </ul>
        </header>
    )
}

export default App
