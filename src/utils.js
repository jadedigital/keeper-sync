export function arrayCheck (data) {
  var array = []
  if (!Array.isArray(data)) {
    array.push(data)
  }
  else {
    array = data
  }
  return array
}
