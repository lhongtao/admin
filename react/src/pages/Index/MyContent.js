import React from 'react'
import { Tabs, Carousel, Layout, Icon } from 'antd'
import './style.less'

const { Footer } = Layout;
const { TabPane } = Tabs;
const imgs = [
  `${process.env.REACT_APP_BASE_URL}/bg1.jpg`,
  `http://pic1.win4000.com/wallpaper/c/53cdd1fad4bcb.jpg`,
]

class MyContent extends React.Component {
  /**
   *  标签页的改变触发的函数
   */
  onChange = activeKey => {
    this.props.onChangeState({
      activeMenu: activeKey
    })
  }
  onEdit = (targetKey, action) => {
    if (action === 'remove') {
      this.remove(targetKey)
    }
  }
   /**
   * 关闭标签页
   */
  remove = targetKey => {
    let { activeMenu } = this.props
    let panes = this.props.panes.slice()
    let preIndex = panes.findIndex(item => item.key === targetKey) - 1
    preIndex = Math.max(preIndex, 0)

    panes = panes.filter(item => item.key !== targetKey)

    if (targetKey === activeMenu) {
      activeMenu = panes[preIndex] ? panes[preIndex].key : ''
    }
    this.props.onChangeState({
      activeMenu,
      panes
    })
  }
  render() {
    const { panes, activeMenu } = this.props
    return (
      <div className='content-container'>
        {
          panes.length ? (
            <Tabs
              style={{ height: '100%' }}
              tabBarStyle={{ background: '#f0f2f5', marginBottom: 0 }}
              onEdit={this.onEdit}
              onChange={this.onChange}
              activeKey={activeMenu}
              type="editable-card"
              hideAdd>
              {
                panes.map(item => (<TabPane key={item.key} tab={item.name}>
                  <div className='tabpane-box'>
                    {item.content}
                  </div>
                  <Footer style={{ textAlign: 'center', background: '#fff' }}>
                    React-Admin ©{new Date().getFullYear()} Created by 1131821869@qq.com <a target='_blank' href='https://github.com/lhongtao' rel="noopener noreferrer"><Icon type="github" /></a>
                  </Footer>
                </TabPane>))
              }
            </Tabs>
          ) : (
            <div className='bg-box'>
              <Carousel className='bg-size' autoplay autoplaySpeed={5000}>
                {imgs.map(item => (
                  <div className='bg-size' key={item}>
                    <img src={item} alt="" style={{ width: '100%', height: '100%' }} />
                  </div>
                ))}
              </Carousel>
            </div>
          )
        }
      </div>
    )
  }
}

export default MyContent


