import React from 'react'
import { notification, Avatar } from 'antd'
import { getChatList } from "@/api/common"
import { getUser } from '@/api/user'

// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_USER = 'SET_USER'
export function setUser(user) {
  return {
    type: SET_USER,
    user
  }
}

export const SET_CHATLIST = 'SET_CHATLIST'
export function setChatList(chatList) {
    return {
        type: SET_CHATLIST,
        chatList
    }
}

export const ADD_CHAT = 'ADD_CHAT'
export function addChat(chat) {
    return {
        type: ADD_CHAT,
        chat
    }
}

export const SET_WEBSOCKET = 'SET_WEBSOCKET'  //设置websocket对象
export function setWebsocket(websocket) {
  return {
    type: SET_WEBSOCKET,
    websocket
  }
}

export const SET_ONLINELIST = 'SET_ONLINELIST'  // 设置在线列表
export function setOnlinelist(onlineList) {
  return {
    type: SET_ONLINELIST,
    onlineList,
  }
}

//异步action，从后台获取用户信息
export function getUserById(param) {
  return async function (dispatch) {
    const res= await getUser(param)
    dispatch(setUser(res.data.data || {}))
  }
}

// 初始化websocket对象
export function initWebsocket(user) {
  return async function (dispatch) {
    const ws = new WebSocket("ws://" + window.location.hostname + ":8888")
    ws.onopen = function()
    {
      // Web Socket 已连接上，使用 send() 方法发送数据
      const data = {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
      ws.send(JSON.stringify(data));
      console.log("数据发送中...");
    };
    
    ws.onmessage = function (event) 
    { 
      const data = JSON.parse(event.data)
      //在线人数变化的消息
      if (data.type === 0) {
        dispatch(setOnlinelist(data.msg.onlineList))
        data.msg.text && notification.info({
            message: '提示',
            description: data.msg.text
        })
      }
      //聊天的消息
      if (data.type === 1) {
        dispatch(addChat(data.msg))
        notification.open({
            message: data.msg.username,
            description: <div dangerouslySetInnerHTML={{ __html: data.msg.content }} />,
            icon: <Avatar src={data.msg.userAvatar} />
        })
      }
    };
    dispatch(setWebsocket(ws))
    dispatch(initChatList())
  }
}

//异步action，初始化聊天记录列表
export function initChatList() {
  return async function (dispatch) {
    const res = await getChatList()
    dispatch(setChatList(res.data || []))
  }
}