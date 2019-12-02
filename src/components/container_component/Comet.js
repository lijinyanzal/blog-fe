import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { pro_api } from '../../url'

//console

const StyledComet = styled.div`
  width: 100%;
  height: 1.25rem;
  line-height: 1.25rem
  text-align: center;
  background-color: ${props => props.theme.bgc};
  &>div {
    margin: 0 auto;
    color: ${props => props.theme.color};
  }
  &>div:hover {
    text-decoration: underline;
    cursor: grab;
  }
`

class Comet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      publishCount: 0,
      xhr: null,
      turnon: true,
    }
    this.baseUrl = pro_api
    this._handleQueryNewPublish = this._handleQueryNewPublish.bind(this, this.props.handleQueryNewPublish)
  }

  _fetchPublishCount = (timeout = '&t=10') => {//5s后才发请求
    const xhr = new XMLHttpRequest()
    const lastFetch = this.props.homeTimeline.lastFetch.top || Date.now()
    const url = this.baseUrl + `/comet?l=${lastFetch}&n=20` + timeout    //请求条数20，时间4500
    xhr.open('GET', url)
    xhr.timeout = 60e3
    xhr.send(null)

    xhr.onload = this._onload
    xhr.onerror = this._fetchAbort  //是否有错
    xhr.ontimeout = this._fetchAbort //是否超时
    this.setState({
      xhr
    })
  }

  _onload = () => {    
    this.setState((state) => {
      let count = state.publishCount
      if (this.state.xhr.status < 400) {
        count = JSON.parse(state.xhr.responseText).data.publishCount
      }
      return {
        xhr: null,
        publishCount: count  //从xhr中拿到 state.publishCount = 1
      }
    })
  }

  _fetchAbort = () => {
    this.setState((state) => {
      if (state.xhr && state.xhr.readyState !==0)
        state.xhr.abort()
      return {
        xhr: null
      }
    })
  }

  _initPublishCount = () => {
    this.setState({
      publishCount: 0
    })
  }

  _cometSwitch = (turnon) => {
    this.setState({   //被设置为turnon  然后数据就被添加到主页了
      turnon
    })
  }

  _handleQueryNewPublish (queryNewPublish) {
    this._fetchAbort()
    this._initPublishCount()
    this._cometSwitch(false)
    queryNewPublish(this.state.publishCount, this._cometSwitch) //从Home中handleQueryNewPublish属性传下来数据，publish 1
  }

  componentDidMount () {
    this._fetchPublishCount('&t=5000')
  }

  componentDidUpdate () {
    const { xhr, turnon, publishCount} = this.state
    if (xhr === null && turnon === true && publishCount < 20) {
      this._fetchPublishCount()
    }
  }

  componentWillUnmount () {
    this._fetchAbort()
  }

  render () {//条数被click handleQueryNewPublish被触发
    return (
      <StyledComet>
        { this.state.publishCount === 0 
          ? (<div>没有新的推送</div>)
          : (<div onClick={this._handleQueryNewPublish}>有{`${this.state.publishCount}`}条新的推送</div>)}
      </StyledComet>
    )
  }
}

const mapStateToProps = (state) => ({
  homeTimeline: state.blog.homeTimeline   //变为1？？？
})

export default connect(mapStateToProps)(Comet)