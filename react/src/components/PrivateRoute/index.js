
import React from 'react'
import { Route, Redirect, } from 'react-router-dom'
import { setToken, getToken } from "@/utils/auth";
// import { isAuthenticated } from '@/utils/session'

//私有路由，只有登录的用户才能访问
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    getToken() ? <Component {...props} />  : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  )} />
)

export default PrivateRoute