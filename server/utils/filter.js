function dateNow(){
  const d = new Date();  
  const date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
  return date
}

module.exports = {
  dateNow
}
