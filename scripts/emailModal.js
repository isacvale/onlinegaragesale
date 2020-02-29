import Stamp from '../node_modules/@dvo/stamp/lib/stamp.js'


function createEmailModal () {
  Stamp('#tpl-email-modal')
    .change(el => {
      el.querySelector('.email-modal-total-price')
        .textContent = getTotalPrice()
    })
    .stamp(el => {
      // Stamp('#tpl-email-modal-item')
      //   .alias('modalItem')  
      // window.g.store.selectedItems
      //   .forEach(setUpItem)
      setUpItems()
      setEV(el)
    })
  document.querySelector('body').classList.add('blurry')
}

function setUpItems (alias) {
  const store = window.g.store
  Stamp('#tpl-email-modal-item')
    .alias('modalItem')  
  
  store.selectedItems
    .forEach(alias => {
      const item = store.items.find(item => item.alias == alias)
      Stamp('modalItem')
        .change(el => {
          el.querySelector('.email-modal-item-price')
            .textContent = `$${item.price}`
          el.querySelector('.email-modal-image')
            .setAttribute('src', `./assets/pics/${item.images[0]}`)
          console.log('before', el)
        })
        // .execute(obj => console.log('item', obj))
        .stamp(el => console.log('item', el, el.parentElement))
    })
}

function setUpItem (alias) {
  const item = window.g.store.items.find(item => item.alias == alias)
  console.log('item:', alias, item, item && item.images)
  
  Stamp('modalItem')
    .change(el => {
      el.querySelector('.email-modal-item-price')
        .textContent = `$${item.price}`
      el.querySelector('.email-modal-image')
        .setAttribute('src', `./assets/pics/${item.images[0]}`)
    })
    .stamp()
}

const getTotalPrice = () => {
  const store = window.g.store
  return store.selectedItems
    .reduce((acc, alias) => {
      const item = store.items.find(item => item.alias == alias)
      return acc += item.price
    }, 0)
  }

function evClickOutside (ev) {
  if (ev.path[0].classList.contains('email-modal'))
    closeModal()
}

function closeModal () {
  removeEV(document.querySelector('.email-modal'))
  Stamp('#tpl-email-modal').clear()
  document.querySelector('body').classList.remove('blurry')
}

function onEnviar () {

}

const setEV = el => {
  el.addEventListener('click', evClickOutside)
  // el.querySelector('.item-modal-button-fechar')
  //   .addEventListener('click', closeModal)
  // el.querySelector('.item-modal-button-enviar')
  //   .addEventListener('click', onEnviar)
}
const removeEV = el => {
  el.removeEventListener('click', evClickOutside)
  // el.querySelector('.item-modal-carousel-selection')
  //   .removeEventListener('mouseover', evActivateThumbnail)
  // el.querySelector('.item-modal-button-fechar')
  //   .removeEventListener('click', closeModal)
  // el.querySelector('.item-modal-button-enviar')
  //   .removeEventListener('click', onEnviar)
}

export default createEmailModal