import React from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as Router,Switch, Route, Link, withRouter } from "react-router-dom";
import './icons/iconfont/iconfont.css'
import LoadableComponent from '@/utils/LoadableComponent'

const Index = LoadableComponent(import('./pages/Index'));
const About = LoadableComponent(import('./pages/About'));
const Login = LoadableComponent(import('./pages/Login'));

function App() {
  return (
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/' component={Index} />
    </Switch>
  );
}

export default App;
