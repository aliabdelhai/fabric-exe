const express = require('express')
const router = express.Router()

const stock = [
    { product: "Milk", ShelfLocation: (5, 6), AmountAtLocation: 10 },
    { product: "Bread", ShelfLocation: (1, 5), AmountAtLocation: 10 },
    { product: "Salt", ShelfLocation: (6, 5), AmountAtLocation: 10 },
    { product: "Soap", ShelfLocation: (8, 9), AmountAtLocation: 10 },
    { product: "Pasta", ShelfLocation: (9, 2), AmountAtLocation: 10 }
]

const nextTasks = []
let counter = 0;

router.get('/next-tasks', async (req, res) => {
    try {
        res.send(nextTasks)
    } catch (error) {
        res.send(error)
    }
})

router.get('/stock', async (req, res) => {
    try {
        const stackArr = stock.map(s => { return { name: s.product, amount: s.AmountAtLocation } })
        res.send(stackArr)
    } catch (error) {
        res.send(error)
    }
})

router.post('/order', async (req, res) => {
    try {
        const temp = req.body.orders;
        temp.forEach(t => {
            const ta = stock.find(s=> s.product == t)
            const ordertTask = {
                id: counter++,
                action: "pick_from_stock",
                product: ta.product,
                location: ta.ShelfLocation
            }
            nextTasks.push(ordertTask)
        })
        res.end()
    } catch (error) {
        res.send(error)
    }
})

router.post('/supply', async (req, res) => {
    try {
        const temp = req.body.supply;
        temp.forEach(t => {
            const ta = stock.find(s=> s.product == t)
            const supplyTask = {
                id: counter++,
                action: "put_to_stock",
                product: ta.product,
                location: ta.ShelfLocation
            }
            nextTasks.push(supplyTask)
        })
        res.end()
    } catch (error) {
        res.send(error)
    }
})

const putToStock = function (product, location) {
    const temp = stock.find(s => s.product == product)
    if (temp) {
        temp.AmountAtLocation++;
    } else {
        stock.push({ product: product, ShelfLocation: location, AmountAtLocation: 1 },)
    }
}

const pickFromStock = function (product) {
    const temp = stock.find(s => s.product == product)
    if (temp.AmountAtLocation > 0) {
        temp.AmountAtLocation--;
    } else {
        const index = stock.findIndex(f => f.product == product)
        stock.splice(index, 1)
    }
}

router.post('tasks/:id/complete', async (req, res) => {
    try {
        const taskId = req.params.id
        const temp = nextTasks.find(s => s.id == taskId)
        temp.action == "pick_from_stock" ? pickFromStock(temp.product) : putToStock(temp.product, temp.location)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router