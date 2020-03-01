import Stamp from '../node_modules/@dvo/stamp/lib/stamp.js'
import raven from '../node_modules/@dvo/raven/raven.mjs'

function createItemModal (alias) {
  // Stamp the modal
  const item = window.g.store.items
    .find(item => item.alias == alias)
  Stamp('#tpl-item-modal')
    .change(el => {
      if (item.status == 'vendido') {
        el.querySelector('.item-modal-card').classList.add('_vendido')
      }
      el.querySelector('.item-modal-name').textContent = item.name
      el.querySelector('.item-modal-price').textContent = item.price
      el.querySelector('.item-modal-short').textContent = item.short
      el.querySelector('.item-modal-long').textContent = item.long
      el.querySelector('.item-modal-image').setAttribute('src', `./assets/pics/${item.images[0]}`)
      Array.from(el.querySelectorAll('.item-modal-button'))
        .forEach(btn => btn.setAttribute('data-alias', item.alias))
      checkItemButtons(item.alias, el)
    })          
    .stamp(el => {
      if (item.images.length > 1) {
        stampThumbnails(item)
      }
      // Set event listeners for internal elements
      setEV(el)
    })

  // Blur the backdrop
  document.querySelector('body').classList.add('blurry')
}

function checkItemButtons (alias, el=document) {
  if (window.g.store.selectedItems.includes(alias)) {
    el.querySelector('.item-modal-button-retirar').classList.add('_on')
    el.querySelector('.item-modal-button-acrescentar').classList.remove('_on')
    el.querySelector('.item-modal .bought-icon').classList.add('_on')
  }
  else {
    el.querySelector('.item-modal-button-retirar').classList.remove('_on')
    el.querySelector('.item-modal-button-acrescentar').classList.add('_on')
    el.querySelector('.item-modal .bought-icon').classList.remove('_on')
  }
}

function evClickOutside (ev) {
  if (ev.path[0].classList.contains('item-modal'))
    closeModal()
}

function evActivateThumbnail (ev) {
  const target = ev.path.find(el =>
     el.classList.contains('item-modal-carousel-pic-wrapper'))
     
  if (target) {
    document.querySelector('.item-modal-image')
      .setAttribute('src', `./assets/pics/${target.getAttribute('data-image')}`)
  }
}

function closeModal () {
  removeEV(document.querySelector('.item-modal'))
  Stamp('#tpl-item-modal').clear()
  document.querySelector('body').classList.remove('blurry')
}

function stampThumbnails (item) {
  const stamp = Stamp('#tpl-item-modal-carousel-pic')
    .clear()
    .target('.item-modal-carousel-selection')
  item.images.forEach(image => {
    stamp
      .change(el => {
        el.querySelector('.item-modal-carousel-pic').setAttribute('src', `./assets/pics/${image}`)
        el.setAttribute('data-image', image)
      })
    .stamp()
  })
}

const onAddItem = ev => {
  const alias = ev.path[0].getAttribute('data-alias')
  raven.set({ selectedItems: [...window.g.store.selectedItems, alias]})
  checkItemButtons(alias)
}
const onRemoveItem = ev => {
  const alias = ev.path[0].getAttribute('data-alias')
  raven.set({ selectedItems:
    window.g.store.selectedItems.filter(item => item != alias)
  })
  checkItemButtons(alias)
}

const setEV = el => {
  el.addEventListener('click', evClickOutside)
  el.querySelector('.item-modal-carousel-selection')
    .addEventListener('mouseover', evActivateThumbnail)
  el.querySelector('.item-modal-carousel-selection')
    .addEventListener('focusin', evActivateThumbnail)
  el.querySelector('.item-modal-button-acrescentar')
    .addEventListener('click', onAddItem)
  el.querySelector('.item-modal-button-retirar')
    .addEventListener('click', onRemoveItem)
  el.querySelector('.item-modal-button-fechar')
    .addEventListener('click', closeModal)
}
const removeEV = el => {
  el.removeEventListener('click', evClickOutside)
  el.querySelector('.item-modal-carousel-selection')
    .removeEventListener('mouseover', evActivateThumbnail)
  el.querySelector('.item-modal-carousel-selection')
    .removeEventListener('focusin', evActivateThumbnail)
  el.querySelector('.item-modal-button-retirar')
    .removeEventListener('click', onRemoveItem)
  el.querySelector('.item-modal-button-fechar')
    .removeEventListener('click', closeModal)
}

export default createItemModal