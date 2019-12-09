import React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './style.less'
import { withRouter } from 'react-router-dom'
import LoadableComponent from "@/utils/LoadableComponent"

// @withRouter
class LoginForm extends React.Component {
    state = {
        // show: 'login' // 当前展示的是登录框还是注册框
    }
    componentDidMount() {
      console.log('componentDidMount')
      // 防止用户通过浏览器的前进后退按钮来进行路由跳转
      // 当用户登陆后再通过浏览器的后退按钮回到登录页时，再点击前进按钮可以直接回到首页
      // if (!!isAuthenticated()) {
      //   this.props.history.go(1)   //不然他后退或者后退了直接登出
      //   // logout()
      // }
      // preloadingImages(imgs)
    }
    toggleShow = () => {
      this.setState({
          show: this.state.show === 'login' ? 'register' : 'login'
      })
    }

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.onLogin(values)
        }
      });
    };
    /**
     * 表单验证成功后的登录函数
     */
    onLogin = async (values) => {
      // const res = await get(`/user/checkName?username=${values.username}`)
      // if (res.status === 0 && !res.data.num) {
      //   this.props.form.setFields({
      //     username: {
      //       value: values.username,
      //       errors: [new Error('用户名不存在')]
      //     }
      //   })
      //   this._createCode()
      //   this.props.form.resetFields('captcha')
      //   return
      // }
      // //加密密码
      // const ciphertext = encrypt(values.password)
      // const res2 = await post('/user/login', {
      //   username: values.username,
      //   password: ciphertext
      // })
      // if (res2.status !== 0) {
      //   this._createCode()
      //   this.props.form.resetFields('captcha')
      //   return
      // }
      const { username, password, remember } = values
      if(username === 'admin') {
        localStorage.setItem('username', values.username)
        this.props.history.push('/')
      }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { show } = this.state
        return (
          <div className="login-container">
            <Form onSubmit={this.handleSubmit} className="login-form">
              <h3 className="title">后台管理系统</h3>
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox>Remember me</Checkbox>)}
                <span className="login-form-forgot">
                    Forgot password
                </span>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Login
                </Button>
                Or <span className="login-register-button">register now!</span>
              </Form.Item>
            </Form>
          </div>
        )
    }
}

const LoginFroms = Form.create({ name: 'normal_login' })(LoginForm);
const Login = withRouter(LoginFroms);
export default Login