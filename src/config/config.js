
 
 
export const getDataFromLocal = (key) => {
  return localStorage.getItem(key)
}
 
export function setLocalStorage(parentKey, childKey, value) {
  let localData = localStorage.getItem('admin')
    ? JSON.parse(localStorage.getItem('admin'))
    : {}
  localData = {
    ...localData,
    [parentKey]: { ...localData[parentKey], [childKey]: value },
  }
  localStorage.setItem('admin', JSON.stringify(localData))
}
 
export function getLocalStorage(parentKey, childKey) {
  let localData = JSON.parse(localStorage.getItem('admin')) || {}
  return localData[parentKey]?.[childKey]
}
 
 
 