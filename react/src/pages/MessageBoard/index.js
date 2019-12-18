import React, { Component } from 'react'
import { Comment, Divider, Button, Card, message, Tooltip, Icon, Input, Modal, notification, Tag, Avatar } from 'antd'
import 'braft-editor/dist/index.css'
import './style.less'
import moment from 'moment'
import { connect } from 'react-redux'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { withRouter } from 'react-router-dom'
import LoadableComponent from '@/utils/LoadableComponent'
import { createMessage, getMessageBoard, getBanner } from "@/api/common"

const { TextArea } = Input;
const store = connect(
  (state) => ({ user: state.user,chatList: state.chatList }),
)

function createMarkup(html) {
  return {__html: html};
}

@store
class MessageBoard extends Component {
  state = {
    likes: 0,
    action: null,
    editorState: BraftEditor.createEditorState(null),   //留言内容
    messages: [],   //留言列表
    isShowEditor: false,
    replyPid: '',//回复第几条的父级id
    replyContent: '',  //回复内容
    replyUser: null, //回复的对象
    expandIds: [],  //展开的id列表
    placeholder: '',  //回复的placeholder
  }
  // 当组件实例被创建并插入 DOM 中时
  componentDidMount() {
    this.getMessages()
  }
  componentDidUpdate(prevProps) {
    //修改用户信息时，重新加载
    // if (this.props.user !== prevProps.user) {
    //     this.getMessages()
    // }
  }

  /**
   * 清空留言框
   */
  clearContent = () => {
    this.setState({
      editorState: ContentUtils.clear(this.state.editorState)
    })
  }
  /**
   * 关闭留言框
   */
  closeMessage = () => {
    this.setState({
        isShowEditor: false
    })
    this.clearContent()
  }

  handleChange = (editorState) => {
    this.setState({ editorState })
  }
  /**
   * 留言
   */
  sendMessage = async () => {
    const editorState = this.state.editorState
    if (editorState.isEmpty()) {
        message.warning('请先输入内容')
        return
    }
    const htmlContent = this.state.editorState.toHTML()
    console.log(htmlContent)
    // console.log(this.props.user)
    const param = {
      content: htmlContent
    }
    const res = await createMessage(param)
    console.log('res',res)
    if (res.status === 0) {
        message.success('留言成功')
        this.clearContent()
        // this.getMessages()
    }
  }
  /**
   * 获取留言列表
   */
  getMessages = async () => {
    const ress = await getBanner()
    console.log(ress)
    // const res = await getMessageBoard()
    const res = ''
    this.setState({
        messages: res.data || [
          {
            "id": 432,
            "type": 0,
            "createTime": 1574149877472,
            "content": "<p>666</p>",
            "userId": 819,
            "userIsAdmin": 0,
            "userName": "liudehua",
            "userAvatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            "targetUserId": null,
            "targetUserIsAdmin": null,
            "targetUserName": null,
            "targetUserAvatar": null,
            "pid": -1,
            "likeNum": 0,
            "children": []
          },
          {
            "id": 431,
            "type": 0,
            "createTime": 1574080889622,
            "content": "<p>了</p>",
            "userId": 815,
            "userIsAdmin": 0,
            "userName": "112",
            "userAvatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            "targetUserId": null,
            "targetUserIsAdmin": null,
            "targetUserName": null,
            "targetUserAvatar": null,
            "pid": -1,
            "likeNum": 0,
            "children": []
          },
          {
            "id": 429,
            "type": 0,
            "createTime": 1573910073882,
            "content": "<p>8</p>",
            "userId": 805,
            "userIsAdmin": 0,
            "userName": "niuniu",
            "userAvatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            "targetUserId": null,
            "targetUserIsAdmin": null,
            "targetUserName": null,
            "targetUserAvatar": null,
            "pid": -1,
            "likeNum": 0,
            "children": []
          },
          {
            "id": 428,
            "type": 0,
            "createTime": 1573866743286,
            "content": "<p>200</p>",
            "userId": 801,
            "userIsAdmin": 0,
            "userName": "Chalk",
            "userAvatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            "targetUserId": null,
            "targetUserIsAdmin": null,
            "targetUserName": null,
            "targetUserAvatar": null,
            "pid": -1,
            "likeNum": 0,
            "children": []
          },
          {
            "id": 426,
            "type": 0,
            "createTime": 1573820362613,
            "content": "<p>499</p><p></p>",
            "userId": 736,
            "userIsAdmin": 0,
            "userName": "ycc",
            "userAvatar": "http://47.99.130.140:8888/myUpload/85b4c963d80e25342d6aaf01d8d0c2d6.jpg",
            "targetUserId": null,
            "targetUserIsAdmin": null,
            "targetUserName": null,
            "targetUserAvatar": null,
            "pid": -1,
            "likeNum": 0,
            "children": [
              {
                "id": 427,
                "type": 1,
                "createTime": 1573822189577,
                "content": "1234143234",
                "userId": 735,
                "userIsAdmin": 0,
                "userName": "lipp",
                "userAvatar": "http://47.99.130.140:8888/myUpload/kobe.jpg",
                "targetUserId": 736,
                "targetUserIsAdmin": 0,
                "targetUserName": "ycc",
                "targetUserAvatar": "http://47.99.130.140:8888/myUpload/85b4c963d80e25342d6aaf01d8d0c2d6.jpg",
                "pid": 426,
                "likeNum": 0
              }
            ]
          },
        ]
    })
  }
  like = () => {
    this.setState({
      likes: 1,
      action: 'liked',
    });
  };
  render () {
    const { isShowEditor, messages, editorState, replyPid, replyContent, expandIds, placeholder } = this.state
    const controls = ['undo', 'redo', 'clear', 'separator', 'bold', 'text-color', 'blockquote', 'code', 'emoji', 'separator', 'link', 'separator', 'media']
    const { likes, dislikes, action } = this.state;

    const actions = [
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={action === 'liked' ? 'filled' : 'outlined'}
            onClick={this.like}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes}</span>
      </span>,
      <span key="comment-basic-reply-to">回复</span>,
    ];
    return (
      <div style={{ padding: 24 }}>
        <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
          <div>
              {
                isShowEditor ? (
                  <div style={{ marginTop: 10 }}>
                    <div className="message-board">
                      <div className="editor-inner">
                        <BraftEditor 
                          controls={controls}
                          contentStyle={{height: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'}}
                          value={editorState} 
                          onChange={this.handleChange}
                        />
                      </div>
                      <Button type='primary' onClick={this.sendMessage}>发表</Button>&emsp;
                      <Button onClick={this.closeMessage}>取消</Button>
                    </div> 
                  </div>      
                ) : <Button onClick={() => this.setState({ isShowEditor: true })}>我要留言</Button>
              }
          </div>
          <Divider></Divider>
          <div className="message-list">
            {
              messages && messages.map((item, index) => (
                <Comment
                  key={item.id}
                  author={<span>{item.userName} {item.userIsAdmin === 1 && <Tag color="#87d068">管理员</Tag>}</span>}
                  avatar={ <Avatar src={item.userAvatar} alt='avatar' /> }
                  content={<div className='info-box braft-output-content' dangerouslySetInnerHTML={createMarkup(item.content)} />}
                  actions={actions}
                  datetime={
                    <Tooltip title={moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                      <span>{moment(item.createTime).fromNow()} {`第${messages.length - index}楼`}</span>
                    </Tooltip>
                  }
                > 
                  {item.children.slice(0, expandIds.includes(item.id) ? item.children.length : 1).map(i => (
                    <Comment
                      key={i.id}
                      author={<span>{i.userName} {i.userIsAdmin === 1 && <Tag color="#87d068">管理员</Tag>}</span>}
                      avatar={ <Avatar src={i.userAvatar} alt='avatar' /> }
                      content={<div className='info-box braft-output-content' dangerouslySetInnerHTML={createMarkup(i.content)} />}
                      actions={actions}
                      datetime={
                        <Tooltip title={moment(i.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                          <span>{moment(i.createTime).fromNow()} {`第${messages.length - index}楼`}</span>
                        </Tooltip>
                      }
                    > 
                    </Comment>
                  ))}
                </Comment>
              ))
            } 
          </div>
        </Card>
      </div>
    )
  }
}

export default MessageBoard;

