import React from 'react'
import { Layout, Menu, Icon } from 'antd';
import Mysider from './MySider'
import MyHeader from './MyHeader'
import MyContent from './MyContent'
import './style.less'
import { getUser, initWebsocket } from '@/store/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const store = connect(
  (state) => ({ user: state.user, websocket: state.websocket }),
  (dispatch) => bindActionCreators({ getUser, initWebsocket }, dispatch)
)

const { Header, Sider, Content } = Layout

@store
class Index extends React.Component {
  state = {
    collapsed: false, //侧边栏的折叠和展开
    panes: [],    //网站打开的标签页列表
    activeMenu: '',  //网站活动的菜单
    theme: localStorage.getItem('theme') || 'dark',   //侧边栏主题
  }
  componentDidMount() {
    this.init()
  }
  
  /**
   * 初始化用户信息和建立websocket连接
   */
  init = async () => {
    const username = localStorage.getItem('username')
    await this.props.getUser({ username })
    console.log(this.props.user)
    this.props.initWebsocket(this.props.user)
  }
  _setState = (obj) => {
    this.setState(obj)
  }
  render() {
    const { collapsed, panes, activeMenu, theme } = this.state
    return (
      <Layout style={{ height: '100vh' }} className="layou-app">
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <Mysider
            theme={theme}
            panes={panes}
            activeMenu={activeMenu}
            onChangeState={this._setState} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <MyHeader
              theme={theme}
              collapsed={collapsed}
              onChangeState={this._setState} />
          </Header>
          <Content>
            <MyContent
              panes={panes}
              activeMenu={activeMenu}
              onChangeState={this._setState} />
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Index