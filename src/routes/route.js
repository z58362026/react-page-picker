import pickerEN from '@pages/react-picker-en'
import pickerCN from '@pages/react-picker-cn'
import App from '@pages/index'
const { Route, Switch, HashRouter } = ReactRouterDOM

// eslint-disable-next-line react/display-name
export default () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={App}></Route>
            <Route path="/pickerEN" component={pickerEN} />
            <Route path="/pickerCN" component={pickerCN} />
        </Switch>
    </HashRouter>
)
