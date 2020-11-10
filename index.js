const express = require('express')
const mongoose = require('mongoose')
const PORT = 8000
const app = express()
const linksRoutes = require('./routes/links')

app.use(express.urlencoded({extended: true}))
app.use(linksRoutes)

async function start() {
    try {
        await mongoose.connect('mongodb+srv://test:assword@cluster0.wn4kt.mongodb.net/links', {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log('Server has been started')
        })
    } catch (e) {
        console.log(e)
    } 
}


start()