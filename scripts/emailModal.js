import Stamp from '../node_modules/@dvo/stamp/lib/stamp.js'
import { getClickedTarget } from './utils.js'


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
        })
        .stamp()
    })
}

function setUpItem (alias) {
  const item = window.g.store.items.find(item => item.alias == alias)
  
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
  if (getClickedTarget(ev, 'email-modal'))
  // if (ev.path[0].classList.contains('email-modal'))
    closeModal()
}

function closeModal () {
  removeEV(document.querySelector('.email-modal'))
  Stamp('#tpl-email-modal').clear()
  document.querySelector('body').classList.remove('blurry')
}

const setEV = el => {
  el.addEventListener('click', evClickOutside)
  // el.querySelector('.item-modal-button-fechar')
  //   .addEventListener('click', closeModal)
  // el.querySelector('.item-modal-button-enviar')
  //   .addEventListener('click', onEnviar)
  el.querySelector('form')
    .addEventListener('submit', onSendForm)
}

const removeEV = el => {
  el.removeEventListener('click', evClickOutside)
  // el.querySelector('.item-modal-carousel-selection')
  //   .removeEventListener('mouseover', evActivateThumbnail)
  // el.querySelector('.item-modal-button-fechar')
  //   .removeEventListener('click', closeModal)
  // el.querySelector('.item-modal-button-enviar')
  //   .removeEventListener('click', onEnviar)
  el.querySelector('[type="submit"]')
    .removeEventListener('submit', onSendForm)
}

function getFinalItems () {
  return window.g.store.selectedItems
    .filter(alias =>
      !window.g.store.discartedItems.includes(alias)
    )
}

function onSendForm (ev) {
  ev.preventDefault()
  const form = document.querySelector('form')
  const finalItems = getFinalItems()

  const info = {
    nome: form.querySelector('[name="nome"]').value,    
    email: form.querySelector('[name="email"]').value,
    coleta: form.querySelector('[name="data"]').value,
    envio: new Date(),
    comentario: form.querySelector('[name="comentario"]').value,
    items: finalItems.reduce((acc, alias) => {
      const item = window.g.store.items.find(x => x.alias == alias)
      return {...acc, [alias]: item.price}
    }, {}),
    valor: finalItems
      .map(alias => window.g.store.items.find(item => item.alias == alias))
      .reduce((acc, item) => acc += item.price, 0)
  }

  sendToFirebase(info)
}

function sendToFirebase (info) {
  closeModal()
  const db = window.g.db
  db.collection('inquiries').add(info)
    .then(docRef => {
      clearSelectedItems()
      showMessage('obrigado!', 'Seu pedido foi registrado e entraremos em contato em breve.')
    })
    .catch(err => {
      console.log('Erro:', err)
      showMessage('desculpe!', 'Houve um problema no processamento. Por favor, tente de novo.')
    })
}

function showMessage (title, body) {
  Stamp('#tpl-message-modal')
    .change(el => {
      el.querySelector('.message-modal-title')
        .textContent = title
      el.querySelector('.message-modal-body')
        .textContent = body
      el.querySelector('button')
        .addEventListener('click', closeMessageModal)
    })
    .stamp()
}

function closeMessageModal () {
  // removeEV(document.querySelector('.message-modal'))
  Stamp('#tpl-message-modal').clear()
  document.querySelector('body').classList.remove('blurry')
}

function clearSelectedItems () {
  window.g.raven.set({ selectedItems: [] })
}

export default createEmailModal