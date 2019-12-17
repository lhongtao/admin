import React from 'react';
import { Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,notification} from 'antd';
import moment from 'moment'
import './style.less'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getSystem,updateSystem } from '@/api/system'

const store = connect(
  (state) => ({ user: state.user })
)

const CustomizedForm = Form.create({
  name: 'system',
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      email: Form.createFormField({
        ...props.email,
        value: props.email.value,
      }),
      mobile: Form.createFormField({
        ...props.mobile,
        value: props.mobile.value,
      }),
      address: Form.createFormField({
        ...props.address,
        value: props.address.value,
      }),
      tel: Form.createFormField({
        ...props.tel,
        value: props.tel.value,
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    // console.log('allValues', allValues)
    // console.log('changedValues', changedValues);
  },

})(props => {
  const { getFieldDecorator } = props.form;

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

  return (
    <Form {...formItemLayout}>
      <Form.Item label="邮箱">
        {getFieldDecorator('email', {
          rules: [{ type: 'email',  message: '输入的电子邮件无效！',}, {required: false,message: '请输入邮箱!', }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="电话">
        {getFieldDecorator('tel')(
          <Input />
        )}
      </Form.Item>
      <Form.Item label="手机号码">
        {getFieldDecorator('mobile')(
          <Input style={{ width: '100%' }} />
        )}
      </Form.Item>
      <Form.Item label="地址">
        {getFieldDecorator('address')(
          <Input />
        )}
      </Form.Item>
    </Form>
  );
});

@withRouter @store
class System extends React.Component {
  state = {
    fields: {
      email: {
        value: '',
      },
      tel: {
        value: '',
      },
      mobile: {
        value: '',
      },
      address: {
        value: '',
      },
    },
    systemModel: null,
  };
  componentDidMount() {
    this.getSystemData()
  }
   
  getSystemData = async () => {
    const res = await getSystem()
    const source = {
      email: {
        value: res.data.data[0].email,
      },
      tel: {
        value: res.data.data[0].tel,
      },
      mobile: {
        value: res.data.data[0].mobile,
      },
      address: {
        value: res.data.data[0].address,
      },
    }
    console.log(source)
    // let data = Object.assign({}, this.state.fields, )
    this.setState({
      fields: source,
      systemModel: res.data.data
    })
  }

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  exec = async (field) => {
    const promise = new Promise((resolve, reject)=> {
      let param = {}
      Object.keys(field).forEach(function(key){
        const err = field[key].errors
        if(err){
          // 验证失败
          reject(err)
          return
        }
        param[key] = field[key].value
      });
      resolve(param)
    })
    return promise
  }

  submit = async () => {
    const field = {...this.state.fields}
    const values = await this.exec(field)
    console.log('Received values of form: ', values);
    const res = await updateSystem(values)
    // this.getSystemData()
    notification.success({
      message: '更新成功',
      description: res.data.message,
      duration: 3
    })
  }

  render() {
    const { fields } = this.state;

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

    return (
      <div style={{ padding: 24 }} className="system-container">
        <Card bordered={false}>
          <div className="system-form">
            <CustomizedForm {...fields} onChange={this.handleFormChange} />
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={this.submit}>
                保存
              </Button>
            </Form.Item>
          </div>
        </Card>
      </div>
    )  
  }  
}

export default System;