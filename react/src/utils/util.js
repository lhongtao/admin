import { Form } from 'antd'

/**
 * 判断是否是对象
 * @param {*} obj 
 */
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 创建表单回显的对象
 * @param {*} obj 
 */
export function createFormField(obj) {
    let target = {}
    if (isObject(obj)) {
        for (let [key, value] of Object.entries(obj)) {
            target[key] = Form.createFormField({
                value
            })
        }
    }
    return target
}