import {
  createBrowserHistory
} from 'history' //浏览器环境。它们与history和location的web API进行交互，因此当前location与浏览器地址栏中展示的是相同的
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'  //引入中间件
import thunkMiddleware from 'redux-thunk' //查看通过系统的每个动作，如果它是一个函数，它会调用该函数.引入其中间件

import createRootReducer from './reducers'

export const history = createBrowserHistory()

export default function configuresStore (preloadedState) { //之前的路径状态
  const composeEnhancer = compose
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware

      )
    )
  )
  return store
}
