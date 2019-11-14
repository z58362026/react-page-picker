import pickerCN from '@pages/react-picker-cn'
import pickerEN from '@pages/react-picker-en'
import defaultHtml from '@pages/defaultHtml'
import App from '@pages/index'
// const { Route, MemoryRouter, Switch, HashRouter, hashRouter } = ReactRouter
const { BrowserRouter, Route, Link, Switch, HashRouter } = ReactRouterDOM

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
