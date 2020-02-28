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
  raven.subscribe('selectedItems', updateItemsInCart)
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
    .target('.area-catalog')
    .clear()
  selectedItems.forEach(item => {
    Stamp('itemCard')
      .change(ev => changeCard(ev, item))
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

function changeCard (el, item) {
  el.setAttribute('data-alias', item.alias)
  el.querySelector('.item-card-name').textContent = item.name
  el.querySelector('.item-card-price').textContent = item.price
  el.querySelector('.item-card-short').textContent = item.short
  el.querySelector('.item-card-image').setAttribute('src', `./assets/pics/${item.images[0]}`)
  el.querySelector('.item-card-button').setAttribute('data-alias', item.alias)
  el.querySelector('.item-card-name').textContent = item.name
  if (window.g.store.selectedItems.includes(item.alias))
    el.querySelector('.bought-icon').classList.add('_on')
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
    if (window.g.store.selectedItems.includes(alias))
      card.querySelector('.bought-icon').classList.add('_on')
    else
      card.querySelector('.bought-icon').classList.remove('_on')
  })
}

function updateItemsInCart () {
  const stamp = Stamp('#tpl-item-brief')
    .target('.added-wrapper')
    .clear()
  const selectedItems = window.g.store.selectedItems
    .map(alias => window.g.store.items.find(item => item.alias == alias))

  // Update items in cart
  selectedItems.forEach(item => {
    stamp
      .change(ev => changeBrief(ev, item))
      .stamp()
  })

  // Show/hide cart
  const cart = document.querySelector('.area-cart')
  if (selectedItems.length)
    cart.classList.add('_on')
  else 
    cart.classList.remove('_on')

  // Update title
  const title = document.querySelector('.area-cart > h1')
  if (selectedItems.length)
    title.textContent = "Sua lista"
  else
    title.textContent = "Lista vazia"

  // Update total price
  const sendButton = document.querySelector('.area-cart > button')
  const totalPrize = selectedItems.reduce((acc, item) => acc + item.price, 0)
  sendButton.textContent = `Comprar (total $${totalPrize})`

}

function changeBrief (el, item) {
  el.setAttribute('data-alias', item.alias)
  el.querySelector('.item-brief-name').textContent = `${item.type}: ${item.name}`
  el.querySelector('.item-brief-price').textContent = item.price
  el.querySelector('.item-brief-button').setAttribute('data-alias', item.alias)
}