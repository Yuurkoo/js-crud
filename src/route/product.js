// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  constructor(name, description, price) {
    this.name = name
    this.description = description
    this.price = price
    this.id = new Date().getTime()
  }

  static getList = () => {
    return this.#list
  }

  static add = (product) => {
    return this.#list.push(product)
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static updateById = (id, { name }) => {
    const product = this.getById(id)

    if (product) {
      if ({ name }) {
        product.name = name
      }
      return true
    } else {
      return false
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.post('/product-create', function (req, res) {
  // console.log(req.body)

  const { name, description, price } = req.body

  const newProduct = new Product(name, description, price)

  Product.add(newProduct)
  // console.log(Product.getList())

  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    data: {},
    // info: result
    //   ? 'Успішне виконання дії'
    //   : 'Помилка: можливо ви ввели дані неправильно',
  })
})

// ================================================================
// router.get Створює нам один ентпоїнт

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  // console.log(typeof id)

  Product.deleteById(Number(id))

  res.render('product-edit', {
    style: 'product-edit',
  })
})
// ================================================================
// ================================================================

router.get('/product-delete', function (req, res) {
  // console.log(req.body)

  res.render('alert-delete', {
    style: 'alert-delete',
    info: 'Товар видалено',
  })
})
// ================================================================
// ================================================================

router.post('/product-update', function (req, res) {
  // console.log(req.body)

  const { id, name, description, price } = req.body

  console.log(id, name, description, price)

  res.render('alert-update', {
    style: 'alert-update',
    info: 'Зміни товару були збережені',
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
