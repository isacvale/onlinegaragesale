import Stamp from '../node_modules/@dvo/stamp/lib/stamp.js'
import raven from '../node_modules/@dvo/raven/raven.mjs'
import { store, initializeStore } from '../scripts/store.js'
import setEventListeners from './eventListeners.js'

window.g = {
  store,
  raven
}

window.onload = () => {
  initializeStore()
  raven.load(store)
  loadCategories()
  raven.subscribe('selectedCategories', loadItems)
  raven.subscribe('selectedCategories', loadFamilyLogo)
  raven.subscribe('selectedItems', showSelectionOnCards)
  raven.set({ selectedCategories: ['CDs']})
  setEventListeners()
}

function loadCategories () {
  Stamp('#tpl-menu-item').alias('menuItem')
  const categoryList = Object.keys(window.g.store.categories)
  categoryList.forEach(category => {
    Stamp('menuItem')
      .change(el => {
        el.textContent = `${category} (${window.g.store.categories[category]})`
        el.setAttribute('data-category', category)
      })
      .stamp()
  })
}

function loadItems () {
  const { items, selectedCategories } = window.g.store
  const selectedItems = items.filter(item => selectedCategories.includes(item.type))

  // Stamp in items that match categories
  Stamp('#tpl-item-card')
    .alias('itemCard')
    .clear()
  selectedItems.forEach(item => {
    Stamp('itemCard')
      .change(el => {
        el.querySelector('.item-card-name').textContent = item.name
        el.querySelector('.item-card-price').textContent = item.price
        el.querySelector('.item-card-short').textContent = item.short
        el.querySelector('.item-card-image').setAttribute('src', `./assets/pics/${item.images[0]}`)
        el.querySelector('.item-card-button').setAttribute('data-alias', item.alias)
      })
      .stamp()
  })

  // Set category button appearance
  Array.from(document.querySelectorAll('.menu-item')).forEach(menuItem => {
    console.log('xxx', window.g.store.selectedCategories, menuItem.textContent)
    window.g.store.selectedCategories.includes(menuItem.getAttribute('data-category'))
      ? menuItem.classList.add('_selected')
      : menuItem.classList.remove('_selected')
  })
}

function loadFamilyLogo () {
  const emptyCategories = window.g.store.selectedCategories.length == 0
  const smallLogo = document.querySelector('main header')
  const bigLogo = document.querySelector('.family-logo-big')

  if (emptyCategories) {
    smallLogo.classList.remove('_on')
    bigLogo.classList.add('_on')
  } else {
    smallLogo.classList.add('_on')
    bigLogo.classList.remove('_on')
  }
}

function showSelectionOnCards () {
  const cards = document.querySelectorAll('.item-card')
  cards.forEach(card => {
    const alias = card.getAttribute('data-alias')
    console.log('aaaaa', alias)
  })
}