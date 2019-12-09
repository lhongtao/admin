const TokenKey = 'usetoken'
const UserName = 'usename'
const UserCode = 'usecode'

export function setToken(token) {
  // return Cookies.set(TokenKey,token)
  return localStorage.setItem(TokenKey,token)
}

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem(TokenKey)
}

export function setUseName(name) {
  // return Cookies.set(TokenKey,token)
  return localStorage.setItem(UserName,name)
}

export function getUseName() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(UserName)
}

export function setUseCode(code) {
  // return Cookies.set(TokenKey,token)
  return localStorage.setItem(UserCode,code)
}

export function getUseCode() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(UserCode)
}

export function removeUseInfo() {
  // return Cookies.remove(TokenKey)
  return localStorage.clear()
}
