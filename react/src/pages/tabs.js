import React from 'react'
import LoadableComponent from '../utils/LoadableComponent'
const Users = LoadableComponent(import('./Users/index'), true);
const About = LoadableComponent(import('./About/index'), true);
const MessageBoard = LoadableComponent(import('./MessageBoard/index'), true);
const Home = LoadableComponent(import('./Home/index'), true);
const System = LoadableComponent(import('./System/index'), true);
const Chat = LoadableComponent(import('./Chat/index'), true);
const BrandList = LoadableComponent(import('@/views/brand/BrandList'), true);
const BackToTop = LoadableComponent(import('@/components/BackToTop/index'), true);
const ErrorThird = LoadableComponent(import('@/components/Result/R403'), true);
const ErrorFour = LoadableComponent(import('@/components/Result/R404'), true);
const Tinymce = LoadableComponent(import('@/components/Tinymce/index'), true);
const DndList = LoadableComponent(import('@/components/DndList/index'), true);


const menu = [
  {
    name: '首页',
    icon: 'home',
    key: 'Home',
  },
  {
    name: '权限管理',
    icon: 'lock',
    key: 'Users',
  },
  {
    name: '组件',
    icon: 'appstore',
    key: 'components',
    children: [
      {
        name: '富文本编辑器',
        icon: '',
        key: 'Tinymce',
      },
      {
        name: '头像上传',
        icon: '',
        key: 'AvatarUpload',
      },
      {
        name: '列表拖拽',
        icon: '',
        key: 'DndList',
      },
      // {
      //   name: '返回顶部',
      //   icon: '',
      //   key: 'BackToTop',
      // },
    ]
  },
  // {
  //   name: '图表',
  //   icon: 'pie-chart',
  //   key: 'Charts',
  //   children: [
  //     {
  //       name: '键盘图表',
  //       icon: '',
  //       key: 'KeyboardChart',
  //     },
  //     {
  //       name: '折线图',
  //       icon: '',
  //       key: 'LineChart',
  //     },
  //     {
  //       name: '混合图表',
  //       icon: '',
  //       key: 'MixChart',
  //     },
  //   ]
  // },
  {
    name: '结果页面',
    icon: 'question-circle',
    key: 'error',
    children: [
      {
        name: '403',
        icon: '',
        key: 'ErrorThird',
      },
      {
        name: '404',
        icon: '',
        key: 'ErrorFour',
      },
    ]
  },
  {
    name: '栏目管理',
    icon: 'project',
    key: 'Columns',
    children: [
      {
        name: '品牌列表',
        icon: '',
        key: 'BrandList',
      },
    ]
  },
  {
    name: '系统管理',
    icon: 'setting',
    key: 'System',
  },
  {
    name: '聊天室',
    icon: 'qq',
    key: 'Chat'
  },
  {
    name: '留言板',
    icon: 'message',
    key: 'MessageBoard'
  },
  {
    name: '关于',
    icon: 'info-circle',
    key: 'About'
  }
]

const tabs = {
  Users: <Users />,
  About: <About />,
  MessageBoard: <MessageBoard />,
  Home: <Home />,
  System: <System />,
  BrandList: <BrandList />,
  BackToTop: <BackToTop />,
  ErrorFour: <ErrorFour />,
  ErrorThird: <ErrorThird />,
  Tinymce: <Tinymce />,
  DndList: <DndList />,
  Chat: <Chat />,
}

export { menu,tabs }

