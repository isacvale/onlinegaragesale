import data from '../assets/data.js'

const store = {
  categories: {},
  selectedCategories: [],
  items: [],
  selectedItems: [],
  discartedItems: []
}

function initializeStore () {
  data.forEach(item => {
    if (!store.categories[item.type])
      store.categories[item.type] = 0
    store.categories[item.type]++
  })
  store.items = [...data]
}

export { store, initializeStore }