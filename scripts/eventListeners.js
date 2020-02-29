import Stamp from '../node_modules/@dvo/stamp/lib/stamp.js'
import raven from '../node_modules/@dvo/raven/raven.mjs'
import createItemModal from './itemModal.js'
import createEmailModal from './emailModal.js'

const eventListeners = [

  function setEVCategoryFunctions () {
    const catergoryWrapper = document.querySelector('.category-wrapper')
    catergoryWrapper.addEventListener('click', ev => {
      const btn = ev.path[0]
      if (btn.tagName.toLowerCase() == 'button') {
        const category = btn.getAttribute('data-category')
  
        const newCategories = window.g.store.selectedCategories.includes(category)
          ? window.g.store.selectedCategories.filter(item => item != category)
          : [...window.g.store.selectedCategories, category]
        raven.set({ selectedCategories: newCategories })
      }
    })
  },

  function setOpenItemModal () {
    const catalog = document.querySelector('.area-catalog')
    catalog.addEventListener('click', ev => {
      const btn = ev.path[0]
      if (btn.classList.contains('item-card-button')) {
        const alias = btn.getAttribute('data-alias')
        createItemModal(alias)        
      }
    })

    const cart = document.querySelector('.added-wrapper')
    cart.addEventListener('click', ev => {
      const btn = ev.path.find(el => el.tagName == 'BUTTON')
      if (btn && btn.classList.contains('item-brief-button')) {
        const alias = btn.getAttribute('data-alias')
        createItemModal(alias)        
      }
    })
  },

  function setOpenEmailModal () {
    const openEmailButton = document.querySelector('.area-cart > button')
    openEmailButton.addEventListener('click', ev => {
      createEmailModal()
    })
  }
]

function setEventListeners () {
  eventListeners.forEach(func => func())
}

export default setEventListeners