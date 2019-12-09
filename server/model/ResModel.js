class SuccessModel{
  constructor({data,message}){
    this.status = 0
    this.httpCode = 200
    this.message = message || 'ok'
    this.data = data || {}
  }
}
class ErrorModel{
  constructor({message,httpCode}){
    this.status = 1
    this.httpCode = httpCode || 500
    this.message = message || 'Internal Server Error'
  }
}


module.exports = {
  SuccessModel,
  ErrorModel
}