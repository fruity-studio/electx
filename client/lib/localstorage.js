const key = "ELECTIONS"

const getAll = () => {
  const items = localStorage.getItem(key) || ""
  return items.length > 0 ? JSON.parse(items) : []
}

const add = (item) => {
  const pItems = getAll()
  pItems.push(item)
  localStorage.setItem(key, JSON.stringify(pItems))
}

export default {
  getAll,
  add,
}
