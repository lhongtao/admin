import React from 'react'
import { Form, Icon, Input, Button, Checkbox,notification } from 'antd';
import './style.less'
import { withRouter } from 'react-router-dom'
import LoadableComponent from "@/utils/LoadableComponent"
import { login } from "@/api/login";
import { setToken, getToken } from "@/utils/auth";

@withRouter
class LoginForm extends React.Component {
    state = {
        // show: 'login' // 当前展示的是登录框还是注册框
    }
    componentDidMount() {
      console.log(this.props.history)
      // 防止用户通过浏览器的前进后退按钮来进行路由跳转
      // 当用户登陆后再通过浏览器的后退按钮回到登录页时，再点击前进按钮可以直接回到首页
      let  isAuthenticated =  localStorage.getItem("token") ? true : false;
      if (isAuthenticated) {
        this.props.history.go(1)   //不然他后退或者后退了直接登出
      }
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
          // console.log('Received values of form: ', values);
          this.onLogin(values)
        }
      });
    };
    /**
     * 表单验证成功后的登录函数
     */
    onLogin = async (values) => {
      const { username, password, remember } = values
      const res = await login(username, password)
      if(res.data.httpCode == '400'){
        notification.success({
          message: '登陆失败',
          description: res.data.message,
          duration: 3
        })
        return
      }
      setToken(res.data.data.token)
      notification.success({
        message: '登陆成功',
        description: res.data.message,
        duration: 3
      })
      console.log(this.props.history)
      this.props.history.push('/')
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { show } = this.state
        return (
          <div className="login-container">
            <Form onSubmit={this.handleSubmit} className="login-form">
              <h3 className="title">欢迎登陆后台管理系统</h3>
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '用户名!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '密码!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登陆
                </Button>
              </Form.Item>
            </Form>
          </div>
        )
    }
}

const LoginFroms = Form.create({ name: 'normal_login' })(LoginForm);
const Login = withRouter(LoginFroms);
export default Login