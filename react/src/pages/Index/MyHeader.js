import React from 'react'
import screenfull from 'screenfull'
import { Icon , Menu, message, Avatar} from 'antd'
import ColorPicker from '@/components/ColorPicker'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import LoadableComponent from '@/utils/LoadableComponent'
import MyIcon from '@/components/MyIcon'

const { SubMenu, ItemGroup} = Menu;

class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    const userTheme = JSON.parse(localStorage.getItem('user-theme'))
    let color = '#13C2C2'
    if (userTheme) {
      window.less.modifyVars(userTheme)
      color = userTheme['@primary-color']
    }
    this.state = {
      isFullscreen: false,    //控制页面全屏
      color: color,
      infoVisible: false,     //控制修改用户信息的模态框
      passwordVisible: false   //控制修改密码的模态框
    }
  }
  /**
   * 切换侧边栏的折叠和展开
   */
  toggleCollapsed = () => {
    this.props.onChangeState({
      collapsed: !this.props.collapsed
    })
  }
  /**
   * 切换全屏
   */
  toggleFullscreen = () => {
    if (screenfull.enabled) {
      screenfull.toggle().then(() => {
        this.setState({
          isFullscreen: screenfull.isFullscreen
        })
      });
    }
  }
  /**
   * 切换主题
   */
  changeColor = (color) => {
    window.less.modifyVars({
      '@primary-color': color,
    }).then(() => {
      localStorage.setItem('user-theme', JSON.stringify({ '@primary-color': color }))
      this.setState({
        color
      })
      message.success('更换主题颜色成功')
    })
  }
  /**
   * 重置主题
   */
  resetColor = () => {
    this.changeColor('#13C2C2')
  }
  /**
   * 展开/关闭修改信息模态框
   */
  toggleInfoVisible = (visible) => {
    this.setState({
      infoVisible: visible
    })
  }
  /**
   * 展开/关闭修改密码模态框
   */
  togglePasswordVisible = (visible) => {
    this.setState({
      passwordVisible: visible
    })
  }
  /**
   * 退出登录
   */
  onLogout = () => {
    logout()   //清空cookie
    this.props.history.push('/login')
  }
  changeTheme = () => {
    const theme = this.props.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme)
    this.props.onChangeState({
      theme
    })
  }
  render() {
    const { isFullscreen, color, infoVisible, passwordVisible } = this.state
    const { user, theme } = this.props
    return (
      <div style={{ background: '#fff', padding: '0 16px' }}>
        <Icon
          className="trigger"
          type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggleCollapsed}
        />
        <div style={styles.headerRight}>
          <div style={styles.headerItem}>
            <ColorPicker color={color} onChange={this.changeColor} />
          </div>
          <div style={styles.headerItem}>
            <MyIcon type={theme === 'dark' ? 'icondeng-mingan' : 'icondeng-mingan'} style={{ fontSize: 24 }} onClick={this.changeTheme}/>
          </div>
          <div style={styles.headerItem}>
            <Icon type={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} onClick={this.toggleFullscreen} style={{ fontSize: 24 }}/>
          </div>
          <div style={styles.headerItem}>
            <Menu mode="horizontal" selectable={false}>
              <SubMenu title={<div style={styles.avatarBox}><Avatar size='small' icon="user" style={styles.avatarIcon}/>&nbsp;<span>Admin</span></div>}>
                <ItemGroup title="用户中心">
                  <Menu.Item key={1} onClick={() => this.toggleInfoVisible(true)}><Icon type="user" />编辑个人信息</Menu.Item>
                  <Menu.Item key={77} onClick={() => this.togglePasswordVisible(true)}><Icon type="edit" />修改密码</Menu.Item>
                  <Menu.Item key={2} onClick={this.onLogout}><Icon type="logout" />退出登录</Menu.Item>
                </ItemGroup>
                <ItemGroup title="设置中心">
                  <Menu.Item key={4} onClick={this.resetColor}><Icon type="ant-design" />恢复默认主题</Menu.Item>
                </ItemGroup>
              </SubMenu>
            </Menu>
          </div>
        </div>
      </div>
    )
  }
}
const styles = {
  headerRight: {
    float: 'right',
    display: 'flex',
    height: 64,
    marginRight: 50
  },
  headerItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    fontSize: '18px',
    color: '#5a5e66',
    verticalAlign: 'text-bottom',
  },
  avatarBox: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarIcon: {
    backgroundColor: 'transparent',
    color: '#666'
  }
}
export default withRouter(MyHeader)