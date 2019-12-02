import React, {Component} from 'react'
import {connect} from 'react-redux'
import PostsList from '../stateless_component/PostsList'
import Comet from './Comet'
import { 
  handleQueryHomePosts,
  handleQueryNewPublish,
  initLastFetch
} from '../../actions/blog'

class Home extends Component {
  constructor (props) {
    super(props)
    this._handleQueryNewPublish = this.props.handleQueryNewPublish.bind(null, this.props.handleQueryHomePosts)
  }
  
  
  componentDidMount () {
    
    //--------------------------------------------
    const timeline = this.props.homeTimeline.timeline  //将
    console.log('1111')   // -3-4 调用此行
    if (timeline.length === 0) {
      console.log('222')
      this.props.handleQueryHomePosts()
    } else {
      console.log('debugger home 条目') // - -3-5 走到此行
      const posts = this.props.posts
      const top = timeline[0]
      const bottom = timeline[timeline.length-1]
      this.props.initLastFetch(posts.entities[top].created_at, posts.entities[bottom].created_at)
    }
  }

  render () {
    const {
      timeline,
      loading,
      isLoadingDirection
    } = this.props.homeTimeline
    console.log('homeTimeLine', this.props.homeTimeline)  // - 2 每次取出所有的条目， 接下来调用 Postslist 返回 array6 -2-1 postslist 返回array 8  -3-1再次调用postlist -4-2再次render 并调用postslist
    return (
      <div className='Home'>
        <Comet
          handleQueryNewPublish={this._handleQueryNewPublish}/>
        <PostsList
          isLoadingDirection={isLoadingDirection}
          loading={loading}
          handleQueryRequest={this.props.handleQueryHomePosts}
          itemHeight={250}
          timeline={timeline}
          posts={this.props.posts}  //把state中取出的posts赋给posts传给PostsList组件
        />
      </div>
    )
  }
} 

const mapStateToProps = (state) => {
  console.log('state', state) // - 1 访问Home网址后  编译  先于render调用  -2-1 Postslist 中返回数据6  -3-1 更新state   -4-1 从-3-5 回到此行
  return ({ 
  homeTimeline: state.blog.homeTimeline,
  posts: state.blog.entities.posts,  //从state上取出posts
})}
const mapDispatchToProps = (dispatch) => ({
  handleQueryHomePosts: (...args) => dispatch(handleQueryHomePosts(...args)),  //Home  get新增条目请求返回到这里，转blog.js handleQueryNewPublish return (pulishCount = 1)
  handleQueryNewPublish: (...args) => dispatch(handleQueryNewPublish(...args)), //从blog 中的这个函数回来 queryPosts('top'), publish 1
  initLastFetch: (...args) => dispatch(initLastFetch(...args))
})

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home)

export default ConnectedComponent