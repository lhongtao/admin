import React, { Component } from 'react';
import axios from 'axios';
import {Card, Button, Table, Icon, Popconfirm, Divider, notification } from 'antd'
import { Resizable } from 'react-resizable';
import moment from 'moment'
import BrandInfoModal from './FormEdit'
import BrandInfoAdd from './FormAdd'
import './style.less'
import { getBrandList, deleteBrand } from "@/api/brand"

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class BrandList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      brands: [],
      isLoading: false,
      isShowInfoModal: false,
      isShowFormAdd: false,
      brandInfo: {},   //当前行的信息
      pagination: {
        total: 0,
        current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
        pageSize: 10,
        showQuickJumper: true
      },
      selectedRowKeys: [],  //选择中的行keys
      columns: [
        {
          title: '标题',
          align: 'center',
          dataIndex: 'name',
          width: 100,
        },
        {
          title: '图片',
          align: 'center',
          dataIndex: 'image',
          render: (text, record) => (
            <div><img src={text}/></div>
          ),
          width: 40,
        },
        {
          title: '描述',
          align: 'left',
          dataIndex: 'description',
          width: 240,
        },
        {
          title: '添加日期',
          align: 'center',
          dataIndex: 'date',
          render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
          width: 100,
          // sorter: (a, b) => a.registrationTime - b.registrationTime
        },
        {
          title: '操作',
          key: 'active',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <div style={{ textAlign: 'center' }}>
                <span className='my-a' onClick={() => this.showInfoModal(record)}><Icon type="eye" /> 查看</span>
                {
                  <Popconfirm title='您确定删除当前用户吗？' onConfirm={() => this.brandDelete(record)}>
                      <span className='my-a'><Divider type='vertical' /><Icon type='delete' /> 删除</span>
                  </Popconfirm>
                }
            </div>
          )
        },
      ],
    };
  }

  componentDidMount() { //  This is a good place to instantiate the network request(created)
    this.initBrands()
  }

  componentDidUpdate(prevProps) {
    // 典型用法（不要忘记比较 props）：当修改用户信息时，重新加载
    if (this.props.userID !== prevProps.userID) {
      this.getUsers(this.state.pagination.current);
    }
  }
  initBrands = async () => {
    const res = await getBrandList()
    this.setState({
      brands: res.data.data,
    });
  }
  /**
   * 打开用户信息模特框，并初始化用户信息回显
   */
  showInfoModal = (record) => {
    const info = {
      id: record.id,
      date: record.date,
      name: record.name,
      image: record.image,
      description: record.description,
    }
    this.setState({
      isShowInfoModal: true,
      brandInfo: info
    })
  }

  togglesShowAddModal = (visible) => {
    this.setState({
      isShowFormAdd: visible,
    })
  }

  /**
   * 关闭用户信息模态框
   */
  closeInfoModal = () => {
    this.setState({
        isShowFormAdd: false,
        isShowInfoModal: false,
        brandInfo: {}
    })
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

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

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  /**
   * 单条删除
   */
  brandDelete = async (record) => {
    const res = await deleteBrand(record.id)
    // const res = await json.post('/user/delete', {
    //     ids: [record.id]
    // })
    if (res.data.httpCode == 200) {
      notification.success({
        message: '删除成功',
        description: res.data.message,
        duration: 3
      })
      this.initBrands()
      return;
    }
    notification.success({
      message: '删除失败',
      description: res.data.message,
      duration: 3
   })
  }

  render() {
    const { brands, pagination, selectedRowKeys, brandInfo, isShowInfoModal, isShowFormAdd } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));
    return (
      <div style={{ padding: 24 }}>
        <Card bordered={false}>
         <div className="brand-container">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button type='primary' icon='plus' onClick={() => this.togglesShowAddModal(true)}>新增</Button>&emsp;
              <Button type='danger' icon='delete' disabled={!selectedRowKeys.length}>批量删除</Button>
            </div>
            <Table
              bordered
              rowKey='id'
              components={this.components}
              columns={columns}
              dataSource={brands}
              pagination={pagination}
              rowSelection={rowSelection}
              onChange={this.onTableChange}
            />
          </div>
        </Card>
        <BrandInfoModal visible={isShowInfoModal} brandInfo={brandInfo} onCancel={this.closeInfoModal} />
        <BrandInfoAdd visible={isShowFormAdd} onCancel={this.closeInfoModal} />
      </div>
    )
  }
}

export default BrandList
