import React from 'react';
import { Modal, Row, Col, Form, Input, Button, Upload, Icon, notification } from 'antd'
import { createFormField } from '../../utils/util'
import './style.less'
const { TextArea } = Input;
import { createBrand } from "@/api/brand"

@Form.create()
class BrandInfoAdd extends React.Component {
  state = {}

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  submitForm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const params = {
          description: values.description,
          name: values.name,
          image: 'https://preview.qiantucdn.com/58pic/35/32/39/54D58PICS869q6fj2Dv2p_PIC2018.jpg!w1024_new_small',
        }
        console.log('Received values of form: ', params);
        this.handleSubmit(params)
      }
    });
  }

  handleSubmit = async (values) => {
    // const res = await updateBrand(qs.stringify(values))
    const res = await createBrand(values)
    notification.success({
      message: '提交成功',
      description: res.message,
      duration: 3
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const { brandInfo } = this.props
    const formItemLayout = {
      labelCol: {
          span: 4
      },
      wrapperCol: {
          span: 20
      },
    };
    return (
      <Modal
        visible={this.props.visible}
        width={800}
        centered
        onOk={this.submitForm}
        onCancel={this.props.onCancel}
        title='添加品牌'>
        <Form {...formItemLayout} className="brand-info-model">
          <Form.Item label="标题">
            {getFieldDecorator('name', {})(<Input />)}
          </Form.Item>
          <Form.Item label="图片">
            {getFieldDecorator('upload', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="logo" action="/upload.do" listType="picture">
                <Button>
                  <Icon type="upload" /> 点击上传图片
                </Button>
              </Upload>,
            )}
          </Form.Item>
          <Form.Item label="描述">
            {getFieldDecorator('description', {})(<TextArea rows={4} />)}
          </Form.Item>
        </Form>
      </Modal>
    ) 
  }
}

export default BrandInfoAdd;