import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import masonryReducer from './masonryReducer'
import blogReducer from './blogReducer'

const rootReducer = (history) => combineReducers({
  masonry: masonryReducer,
  blog: blogReducer,
  router: connectRouter(history)
})

export default rootReducer