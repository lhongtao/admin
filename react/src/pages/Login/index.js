import React from 'react'
import { Form, Icon, Input, Button, Checkbox,notification, Row, Col } from 'antd';
import './style.less'
import { randomNum } from '@/utils/util'
import { withRouter } from 'react-router-dom'
import LoadableComponent from "@/utils/LoadableComponent"
import { login } from "@/api/login";
import { setToken, getToken } from "@/utils/auth";

@withRouter @Form.create()
class LoginForm extends React.Component {
    state = {
      focusItem: -1,   //当前焦点聚焦在哪一项上
      code: ''  //验证码
        // show: 'login' // 当前展示的是登录框还是注册框
    }
    componentDidMount() {
      console.log(this.props.history)
      // 防止用户通过浏览器的前进后退按钮来进行路由跳转
      // 当用户登陆后再通过浏览器的后退按钮回到登录页时，再点击前进按钮可以直接回到首页
      let  isAuthenticated =  getToken()
      if (isAuthenticated) {
        this.props.history.go(1)   //不然他后退或者后退了直接登出
      }
      this._createCode()
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
      // 表单登录时，若验证码长度小于4则不会验证，所以我们这里要手动验证一次
      if (this.state.code.toUpperCase() !== values.captcha.toUpperCase()) {
        this.props.form.setFields({
            captcha: {
                value: values.captcha,
                errors: [new Error('验证码错误')]
            }
        })
        return
      }
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
      console.log(res.data.data)
      localStorage.setItem('username', res.data.data.username)
      setToken(res.data.data.token)
      notification.success({
        message: '登陆成功',
        description: res.data.message,
        duration: 3
      })
      this.props.history.push('/')
    }

    /**
     * 生成验证码
     */
    _createCode = () => {
      const ctx = this.canvas.getContext('2d')
      const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9,'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let code = ''
      ctx.clearRect(0, 0, 80, 40)
      for(let i = 0; i < 4; i++) {
        const char = chars[randomNum(0,57)]
        code += char
        ctx.font = randomNum(20, 25) + 'px SimHei'  //设置字体随机大小
        ctx.fillStyle = '#D3D7F7'
        ctx.textBaseline = 'middle'
        ctx.shadowOffsetX = randomNum(-3, 3)
        ctx.shadowOffsetY = randomNum(-3, 3)
        ctx.shadowBlur = randomNum(-3, 3)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        let x = 80 / 5 * (i + 1)
        let y = 40 / 2
        let deg = randomNum(-25, 25)
        /**设置旋转角度和坐标原点**/
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(char, 0, 0)
        /**恢复旋转角度和坐标原点**/
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
      }
      this.setState({
        code
      })
    }

    changeCaptcha = () => {
      this.props.form.resetFields(['captcha'])
      this._createCode()
    }

    render() {
        const { getFieldDecorator, getFieldError } = this.props.form
        const { focusItem, code, show} = this.state
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
                <Row gutter={8}>
                  <Col span={15}>
                      {getFieldDecorator('captcha', {
                          validateFirst: true,
                          rules: [
                              { required: true, message: '请输入验证码' },
                              {
                                  validator: (rule, value, callback) => {
                                      if (value.length >= 4 && code.toUpperCase() !== value.toUpperCase()) {
                                          callback('验证码错误')
                                      }
                                      callback()
                                  }
                              }
                          ]
                      })(
                          <Input
                              className="myInput"
                              onFocus={() => this.setState({ focusItem: 2 })}
                              onBlur={() => this.setState({ focusItem: -1 })}
                              onPressEnter={this.onSubmit}
                              placeholder="验证码"
                          />
                      )}
                  </Col>
                  <Col span={9}>
                    <canvas onClick={this.changeCaptcha} width="80" height='40' ref={el => this.canvas = el} />
                  </Col>
                </Row>
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

export default LoginForm