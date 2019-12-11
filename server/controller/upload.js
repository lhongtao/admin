const { exec } = require('../db/mysql')
const express=require('express');
const mysql=require('mysql');
const { SuccessModel, ErrorModel } = require('../model/resModel')
const path = require('path')
const fs = require('fs');

function resetName(oldPath,targetPath) {
  const promise = new Promise((resolve, reject)=> {
    fs.rename(oldPath, targetPath, err=>{
      if(err) {
        reject(err)
      }
      resolve()
    })
  })
  return promise
}

/**
 * 上传图片
 * @param {*} param
 */
const uploadFile = async (param) => {
  const file = param.files[0]
  let oldPath = null
  let newPath = null
  let targetPath = null
  let newFileName = null
  console.log('file-------------------------------------------------------', file)
  if(file){
		const ext = path.parse(file.originalname).ext;
		oldPath = file.path;
		newPath = file.path + ext;
    newFileName = file.filename + ext;
    targetPath = './public/upload/' + newFileName;
  }
  const res = await resetName(oldPath, targetPath)
  return new SuccessModel({
    data: {
      fileName: newFileName,
    },
    message: '上传成功'
  })
}

module.exports = {
  uploadFile
}