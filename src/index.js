import './common/style/common.scss'
import Route from './routes/route'

ReactDOM.render(<Route />, document.getElementById('app'))

if (module.hot) {
    // 实现热更新
    module.hot.accept()
}
