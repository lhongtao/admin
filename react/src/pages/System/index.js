import React from 'react';
import { Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,} from 'antd';
import moment from 'moment'
import './style.less'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


const store = connect(
  (state) => ({ user: state.user })
)

@withRouter @store @Form.create()
class System extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
  
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form
    const { autoCompleteResult } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );


    return (
      <div style={{ padding: 24 }} className="system-container">
        <Card bordered={false}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit} className="system-form">
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: '输入的电子邮件无效！',
                  },
                  {
                    required: false,
                    message: '请输入邮箱!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="电话">
              {getFieldDecorator('phone')(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="手机号码">
              {getFieldDecorator('mobile')(
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
              )}
            </Form.Item>
            <Form.Item label="地址">
              {getFieldDecorator('address')(
                <Input />
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )  
  }  
}

export default System;