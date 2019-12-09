import React from 'react';
import { message, Avatar, Divider, Card } from 'antd'
import 'braft-editor/dist/index.css'
import { initChatList, initWebsocket } from '@/store/actions'
import moment from 'moment'
import { connect } from 'react-redux'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import './style.less'
import { createMessage, getMessageBoard, getAllUserList } from "@/api/common"
import { bindActionCreators } from 'redux'

const store = connect(
  (state) => ({ user: state.user, websocket: state.websocket, chatList: state.chatList, onlineList: state.onlineList}),
  (dispatch) => bindActionCreators({ initChatList, initWebsocket }, dispatch)
)

@store
class Chat extends React.Component {
  state = {
    editorState: BraftEditor.createEditorState(null),   //留言内容
    userList: [], //所有用户列表
  }
  componentDidMount() {
    console.log(this.props.websocket)
    if (this.props.websocket && this.props.websocket.readyState !== 1) {
      this.props.initWebsocket(this.props.user)
    }
    // this.chatListDom.scrollTop = this.chatListDom.scrollHeight
    this.getUserList()
    // window.onmouseup = this.onMouseUp
  }
  /**
   * 获取所有用户列表
   */
  getUserList = async () => {
    const res = await getAllUserList()
    await this.setState({
      userList: res.data || []
    })
    this.handleUserList()
  }

  /**
   * 处理用户列表(管理员、在线用户放在数组前面)
   */
  handleUserList = () => {
    const userList = this.state.userList
    const onlineList = this.props.onlineList
    let list1 = []
    let list2 = []
    let list3 = []
    for (let item of userList) {
        const isHave = onlineList.find(i => i.id === item.id)
        const user = {
            ...item,
            online: !!isHave
        }
        if (item.isAdmin) {
            list1.push(user)
        } else if (!!isHave) {
            list2.push(user)
        } else {
            list3.push(user)
        }
    }
    this.setState({
        userList: list1.concat(list2, list3)
    })
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }
  //定制键盘命令
  handleKeyCommand = (command) => {
    //如果是回车命名就发送信息
    if (command === 'split-block') {
        this.onSend()
        return 'handled';
    }
    return 'not-handled';
  }

  onSend = () => {
    const editorState = this.state.editorState
    const htmlContent = editorState.toHTML()
    const websocket = this.props.websocket

    if (editorState.isEmpty()) {
        return message.warning('请先输入聊天内容')
    }
    console.log(websocket)
    if (websocket.readyState !== 1) {
        //断开连接，重新连接
        this.props.initWebsocket(this.props.user)
        return message.warning('消息发送失败，请重新发送')
    }
    websocket.send(JSON.stringify({ content: htmlContent }))
    this.setState({
      editorState: ContentUtils.clear(this.state.editorState)
        // editorState: BraftEditor.createEditorState(null)    //用这种方法清空富文本编辑器，在下次输入时光标容易跳动
    })
  }

  render() {
    const { editorState, userList } = this.state
    const { chatList, user, onlineList } = this.props
    const controls = ['emoji', 'italic', 'text-color', 'separator', 'separator']
    return (
      <div className='chat-container' ref={el => this.chatContainer = el}>
        <div className='chat-box' ref={el => this.chatBox = el}>
          <div className='chat-header' onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} ref={el => this.chatHeader = el}>
            <div className='header-left'>
                <img src={require('./imgs/header1.png')} alt="" />
            </div>
            <div className='header-center'>
                <img src={require('./imgs/header2.png')} alt="" />
            </div>
            <div className='header-right'>
                <Avatar src={user.avatar} />
            </div>
          </div>
          <div className='chat-body'>
            <div className='main'>
              <div className='chat-list' ref={el => this.chatListDom = el}>
                {chatList && chatList.map((item, index) => (
                    <div key={item.id} className='chat-item'>
                          {/* 两条消息记录间隔超过3分钟就显示时间 */}
                            {(index === 0 || item.createTime - chatList[index - 1].createTime > 3 * 60 * 1000) && (
                                <div className='time'>{this.handleTime(item.createTime)}</div>
                            )}
                            <div className={`chat-item-info ${user.id === item.userId ? 'chat-right' : ''}`}>
                                <div><Avatar src={item.userAvatar} /></div>
                                <div className='chat-main'>
                                    <div className='username'>{item.username}</div>
                                    <div className='chat-content' dangerouslySetInnerHTML={{ __html: item.content }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='chat-editor-wrapper'>
                  <BraftEditor
                    draftProps={{ handleKeyCommand: this.handleKeyCommand }}
                    value={editorState}
                    onChange={this.handleEditorChange}
                    contentStyle={styles.contentStyle}
                    controlBarStyle={styles.controlBarStyle}
                    controls={controls}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  contentStyle: {
      height: 100,
      paddingBottom: 0,
      transform: 'translateY(-15px)',
      fontSize: 14
  },
  controlBarStyle: {
      boxShadow: 'none'
  },
  center: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
  }
}

export default Chat;