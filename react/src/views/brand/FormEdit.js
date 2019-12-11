import React from 'react';
import { Modal, Row, Col, Form, Input, Button, Upload, Icon, notification } from 'antd'
import { createFormField } from '../../utils/util'
import './style.less'
const { TextArea } = Input;
import moment from 'moment'
import { updateBrand } from "@/api/brand"
import { uploadFiles } from "@/api/common"
import qs from 'qs'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const form = Form.create({
  //表单回显
  mapPropsToFields(props) {
    return createFormField(props.brandInfo)
  }
})

@form
class BrandInfoModal extends React.Component {
  state = {
    modelForm: null,
    loading: false,
    fileName: '',
    fileList: [],
  }

  handleChange = info => {
    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show One recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ fileList });

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
          fileName: info.file.response.data.fileName
        })
      );
    }
  };

  normFile = e => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  
  submitForm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let image = this.state.fileName ? this.state.fileName : this.props.brandInfo.image
        const params = {
          id: this.props.brandInfo.id,
          description: values.description,
          name: values.name,
          image,
        }
        console.log('Received values of form: ', params);
        this.handleSubmit(params)
      }
    });
  }

  handleSubmit = async (values) => {
    // const res = await updateBrand(qs.stringify(values))
    const res = await updateBrand(values)
    notification.success({
      message: '提交成功',
      description: res.message,
      duration: 3
    })
    this.resetFormModel()
    this.props.onSure()
  }
  resetFormModel = () => {
    this.props.form.resetFields()
    this.setState({
      imageUrl: '',
      loading: false,
      fileName: '',
      fileList: []
    })
  }

  handleCancel = () => {
    this.resetFormModel()  
    this.props.onCancel()
  }

  render() {
    const { fileList } = this.state
    const actionUrl = `${process.env.REACT_APP_BASE_URL}/admin/file/upload`
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
    const uploadButton = (
      <div className='upload-button'>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        {this.props.brandInfo.image ? <img src={`${process.env.REACT_APP_BASE_URL}/upload/` + this.props.brandInfo.image} /> : ''}
        
      </div>
    );
    const { imageUrl } = this.state;

    return (
      <Modal
        visible={this.props.visible}
        width={800}
        centered
        onOk={this.submitForm}
        onCancel={this.handleCancel}
        title='详细信息'>
        <Form {...formItemLayout} className="brand-info-model">
          <Form.Item label="创建时间">
            <span>{ brandInfo.date && moment(brandInfo.date).format('YYYY-MM-DD HH:mm:ss') }</span>
          </Form.Item>
          <Form.Item label="名称">
            {getFieldDecorator('name', {})(<Input />)}
          </Form.Item>
          <Form.Item label="图片">
            {getFieldDecorator('upload', {
              valuePropName: 'file',
              getValueFromEvent: this.normFile,
            })(
              <Upload
                action={actionUrl}
                name="file"
                listType="picture-card"
                showUploadList={false}
                multiple={true}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                fileList={fileList}
              >
                {imageUrl ? <img src={imageUrl} alt="file" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
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

export default BrandInfoModal;