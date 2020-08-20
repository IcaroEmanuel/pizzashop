const select = (element) => document.querySelector(element)
const selectAll = (element) => document.querySelectorAll(element)

let qtdPizzas = 1
let cart = []
let modalKey = 0 //Controle de qual item é pedido para ser usado no carrinho de compras
//Exibindo informações na página inicial
pizzaJson.map((item, indexPizza) => {
  const pizzaItem = select('.models .pizza-item').cloneNode(true) //clonei o item usando o cloneNode para mostrar a quantidade disponível no array

  //Peguei o index de cada elemento e setei como atributo para usar como controle
  pizzaItem.setAttribute('data-key', indexPizza)
  //Preencher informações
  pizzaItem.querySelector('.pizza-item--img img').src = item.img
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

  //Selecionando a tag 'a' para mostrar o modal com as infos da pizza
  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault(); //Cancelei o evento padrão do click que é atualizar a tela

    getInfoPizzas(e, '.pizza-item', 'data-key')

    showModal('.pizzaWindowArea')
  })
  select('.pizza-area').append(pizzaItem) //Adicionando conteúdo usando o append
})

//Função criada para exibir o modal
const showModal = (classModal) => {
  select(classModal).style.display = 'flex' //Configurei o modal para aparecer usando o comando flex dentro do display
  select(classModal).style.opacity = 0

  //Criei um time que vai mudar o opacity de 0 a 1 no intervalo de 200 ms
  setTimeout(() => {
    select(classModal).style.opacity = 1
  }, 200)
}

//Pegando as informações da pizza
const getInfoPizzas = (element, classItem, dataIndex) => {
  const key = element.target.closest(classItem).getAttribute(dataIndex)
  modalKey = key

  qtdPizzas = 1

  select('.pizzaBig img').src = pizzaJson[key].img
  select('.pizzaInfo h1').innerHTML = pizzaJson[key].name
  select('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
  select('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

  select('.pizzaInfo--size.selected').classList.remove('selected')

  //Pegando a informação dos tamanhos
  selectAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    if (sizeIndex === 2) size.classList.add('selected')

    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
  })

  select('.pizzaInfo--qt').innerHTML = qtdPizzas
}

//Fechar modal
const closeModal = () => {
  select('.pizzaWindowArea').style.opacity = 0

  setTimeout(() => {
    select('.pizzaWindowArea').style.display = 'none'
  }, 200)
}

//Controle dos botõs cancelar e voltar do modal
selectAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click', closeModal)
})

//Controle do botão de diminuir a quantidade no modal
select('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (qtdPizzas > 1) {
    qtdPizzas--
    select('.pizzaInfo--qt').innerHTML = qtdPizzas
  }
})

//Controle do botão de aumentar a quantidade no modal
select('.pizzaInfo--qtmais').addEventListener('click', () => {
  qtdPizzas++
  select('.pizzaInfo--qt').innerHTML = qtdPizzas
})

//Controle de seleção do tamanho das pizzas
selectAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', () => {
    select('.pizzaInfo--size.selected').classList.remove('selected')
    size.classList.add('selected')
  })
})

//Carrinho de compras
select('.pizzaInfo--addButton').addEventListener('click', () => {
  let size = parseInt(select('.pizzaInfo--size.selected').getAttribute('data-key'))
  let identifier = `${pizzaJson[modalKey].id}@${size}`
  let key = cart.findIndex((item) => item.identifier === identifier)

  if (key > -1) {
    cart[key].qtd += qtdPizzas
  }
  else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qtd: qtdPizzas
    })
  }

  updateCart()
  closeModal()
})

//Configurando o carrinho para aparecer na versão mobile
select('.menu-openner').addEventListener('click', () => {
  if (cart.length > 0) {
    select('aside').style.left = '0'
  }
})

//Fecha o carrinho na versão mobile
select('.menu-closer').addEventListener('click', () => {
  select('aside').style.left = '100vw'
})

//Atualiza o carrinho
const updateCart = (() => {

  select('.menu-openner span').innerHTML = cart.length //Add a quantidade no ícone do carrinho na versão mobile
  if (cart.length > 0) {
    select('aside').classList.add('show')
    select('.cart').innerHTML = ''

    let subtotal = 0
    let total = 0
    let discount = 0

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id === cart[i].id)
      let cartItem = select('.models .cart--item').cloneNode(true) //Pega todo mundo
      let pizzaSizeName

      switch (cart[i].size) {
        case 0:
          pizzaSizeName = 'P'
          break
        case 1:
          pizzaSizeName = 'M'
          break
        case 2:
          pizzaSizeName = 'G'
          break
      }

      let PizzaName = `${pizzaItem.name}(${pizzaSizeName}) `
      subtotal += pizzaItem.price * cart[i].qtd

      cartItem.querySelector('img').src = pizzaItem.img
      cartItem.querySelector('.cart--item-nome').innerHTML = PizzaName
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if (cart[i].qtd > 1) {
          cart[i].qtd--
        }
        else {
          cart.splice(i, 1)
        }
        updateCart()
      })

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qtd++
        updateCart()
      })
      select('.cart').append(cartItem) //Exibe na tela
    }
    discount = subtotal * 0.1
    total = subtotal - discount

    select('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
    select('.desconto span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`
    select('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

  }
  else {
    select('aside').classList.remove('show')
    select('aside').style.left = '100vw'
  }

})



