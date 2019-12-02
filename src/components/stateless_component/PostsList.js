import React from 'react'
import PropTypes from 'prop-types'
import PostDigest from '../stateless_component/PostDigest'
// import withVirtualScroll from '../container_component/withVirtualScroll'
const PostsList = (props) => {
    const list = props.timeline.map(post_id => {
      if (!props.posts.entities[post_id]) return null
      const {
        author,
        user_id,
        avatar,
        title,
        content,
        created_at,
        updated_at
      } = props.posts.entities[post_id];  //上级传下来的posts(原state的blog中的)的entries条目中包含了所有的数据
      console.log('content', content)
      let b = content
      try {
        b = JSON.parse(content).blocks[0].text
      } catch(e) {
        // console.log(e)
      }
      return (
        <li
          key={post_id}
          className={`post-${post_id}`}>
          <PostDigest
            avatar={avatar}
            post_id={post_id}
            author={author}
            user_id={user_id} 
            title={title} 
            content={b} 
            created_at={created_at}
            updated_at={updated_at}/>
        </li>
      )
    })
    console.log('postslist',list,props.timeline) // -4 从Home 中过来的
  return (
    <ul>
      { list }
    </ul>
  ) 
}

PostsList.propTypes = {
  timeline: PropTypes.array.isRequired,
  posts: PropTypes.object.isRequired,
}

export default PostsList