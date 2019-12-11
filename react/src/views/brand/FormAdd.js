import React from 'react';
import { Modal, Row, Col, Form, Input, Button, Upload, Icon, notification, message } from 'antd'
import { createFormField } from '../../utils/util'
import './style.less'
const { TextArea } = Input;
import { createBrand } from "@/api/brand"
import { uploadFiles } from "@/api/common"

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

@Form.create()
class BrandInfoAdd extends React.Component {
  state = {
    loading: false,
    fileName: '',
    fileList: [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      },
    ],
  };

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
        console.log('Received values of values: ', values);
        const params = {
          description: values.description,
          name: values.name,
          image: this.state.fileName,
          // upload: values.upload[0],
        }
        console.log('Received values of params: ', params);
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
    this.props.onSure()
  }


  render() {
    const { fileList } = this.state
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
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { imageUrl } = this.state;

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
              valuePropName: 'file',
              getValueFromEvent: this.normFile,
            })(
              <Upload
                action="http://localhost:8090/admin/file/upload"
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

export default BrandInfoAdd;