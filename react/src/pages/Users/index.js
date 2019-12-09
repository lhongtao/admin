import React from 'react';
import { Table, Card, Form, Input, Button, DatePicker , message, Icon, Row, Col, Divider, Modal, Popconfirm, notification } from 'antd'
import moment from 'moment'
import InfoModal from './InfoModal'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const { RangePicker } = DatePicker;
const store = connect(
  (state) => ({ user: state.user })
)

@withRouter @store @Form.create()
class User extends React.Component {
  state = {
    users: [], // 用户列表
    usersLoading: false,//获取用户loading
    pagination: {
      total: 0,
      current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
      pageSize: 10,
      showQuickJumper: true
    },
    isShowInfoModal: false,
    userInfo: {},        //当前行的user信息
    selectedRowKeys: [],   //选择中的行keys
    isShowCreateModal: false
  }
  
  componentDidMount() {
    // this.getUsers()
  }

  componentDidUpdate(prevProps) {
    // 典型用法（不要忘记比较 props）：当修改用户信息时，重新加载
    if (this.props.userID !== prevProps.userID) {
      this.getUsers(this.state.pagination.current);
    }
  }
  /**
   * 分页
   */
  getUsers = async (page = 1) => {
    const { pagination } = this.state
    const fields = this.props.form.getFieldsValue()
    this.setState({
        usersLoading: true,
    })
    const res = await json.get('/user/getUsers', {
        current: page - 1,
        username: fields.username || '',   //koa会把参数转换为字符串，undefined也会
        startTime: fields.startTime ? fields.startTime.valueOf() : '',
        endTime: fields.endTime ? fields.endTime.valueOf() : ''
    })
    if (res.status !== 0) {
        this.setState({
            usersLoading: false,
        })
        return
    }
    this.setState({
        usersLoading: false,
        users: res.data.list,
        pagination: {
            ...pagination,
            total: res.data.total,
            current: page
        }
    })
  }
  /**
   * table分页
   */
  onTableChange = async (page) => {
    await this.setState({
      pagination: page
    })
    console.log(page.current)
    console.log(this.props.user)
  }

  onDateChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }
  
  onOk = (value) => {
    console.log('onOk: ', value);
  }
  /**
   * 搜索函数
   */
  onSearch = () => {
    const fields = this.props.form.getFieldsValue()
    console.log(fields)
    // this.getUsers()
  }
  
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  /**
   * 打开用户信息模特框，并初始化用户信息回显
   */
  showInfoModal = (record) => {
    const userInfo = {
        username: record.username,
        gender: record.gender,
        rTime: record.registrationTime && moment(record.registrationTime).format('YYYY-MM-DD HH:mm:ss'),
        lastLoginAddress: record.lastLoginAddress,
        registrationAddress: record.registrationAddress,
        lastLoginTime: record.lastLoginTime && moment(record.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')
    }
    this.setState({
        isShowInfoModal: true,
        userInfo: userInfo
    })
    console.log(userInfo)
  }
  /**
   * 单条删除
   */
  singleDelete = async (record) => {
    // const res = await json.post('/user/delete', {
    //     ids: [record.id]
    // })
    const res = {
      status: 0
    }
    if (res.status === 0) {
      notification.success({
          message: '删除成功',
          description: '3秒后自动退出登录',
          duration: 3
      })
    }
  }
  /**
   * 关闭用户信息模态框
   */
  closeInfoModal = () => {
    this.setState({
        isShowInfoModal: false,
        userInfo: {}
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { users, usersLoading, pagination, userInfo, isShowInfoModal, selectedRowKeys, isShowCreateModal } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: '序号',
        key: 'num',
        align: 'center',
        render: (text, record, index) => {
            let num = (pagination.current - 1) * 10 + index + 1
            if (num < 10) {
                num = '0' + num
            }
            return num
        }
      },
      {
        title: '用户名',
        dataIndex: 'username',
        align: 'center'
      },
      {
        title: '注册地址',
        dataIndex: 'registrationAddress',
        align: 'center',
      },
      {
        title: '注册时间',
        dataIndex: 'registrationTime',
        align: 'center',
        render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
        sorter: true
      },
      {
        title: '上一次登陆地址',
        dataIndex: 'lastLoginAddress',
        align: 'center',
      },
      {
        title: '身份',
        dataIndex: 'isAdmin',
        align: 'center',
        render: (text) => text ? '管理员' : '超级管理员',
      },
      {
        title: '操作',
        key: 'active',
        align: 'center',
        render: (text, record) => (
            <div style={{ textAlign: 'center' }}>
                <span className='my-a' onClick={() => this.showInfoModal(record)}><Icon type="eye" /> 查看</span>
                {
                    this.props.user.username === record.username &&
                    <Popconfirm title='您确定删除当前用户吗？' onConfirm={() => this.singleDelete(record)}>
                        <span className='my-a'><Divider type='vertical' /><Icon type='delete' /> 删除</span>
                    </Popconfirm>
                }
            </div>
        )
      },
    ];
    const data = [];
    for (let i = 0; i < 3; i++) {
      data.push({
        birth: null,
        gender: null,
        id: i,
        isAdmin: i,
        lastLoginAddress: '上海',
        lastLoginTime: 1571189723772,
        location: null,
        phone: null,
        registrationAddress: '北京',
        registrationTime: 1571187249221,
        username: '张三',
      });
    }
    return (
      <div style={{ padding: 24 }}>
        <Card bordered={false}>
          <Form layout="inline" style={{ marginBottom: 16 }}>
            <Row type='flex'>
              <Col>
                <Form.Item>
                  {getFieldDecorator('username')(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="用户名"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('startTime')(
                    <RangePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['注册开始时间', '注册结束时间']}
                      onChange={this.onDateChange}
                      onOk={this.onOk}
                    />,
                  )}
                </Form.Item>    
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type='primary' icon='plus'>新增</Button>&emsp;
            <Button type='danger' icon='delete' disabled={!selectedRowKeys.length}>批量删除</Button>
          </div>
          <Table
            bordered
            rowKey='id'
            columns={columns}
            pagination={pagination}
            dataSource={data}
            rowSelection={rowSelection}
            onChange={this.onTableChange}
          />
        </Card>
        <InfoModal visible={isShowInfoModal} userInfo={userInfo} onCancel={this.closeInfoModal} />
      </div>
    );
  }
}

export default User;