const {Router, response} = require('express')
const router = Router()
const {nanoid} = require('nanoid')
const linkModel = require('./models/links_db')


router.post('/shorten', async (req, res) => {
    const urlToShorten = req.body.urlToShorten

    const find = await linkModel.where({url: urlToShorten})
    if (find.length > 0){
        const response = {
            "status": 'Got',
            "shortenedUrl": find[0].short_url
        }
        res.send(response)
    }
    else{
        const short_url = nanoid(5)
        const link = new linkModel({
            url: req.body.urlToShorten,
            short_url: 'localhost:8000/' + short_url
        })
    
        await link.save()

        const response = {
            "status": 'Created',
            "shortenedUrl": 'localhost:8000/' + short_url
        }
        res.send(response)

    }
})


router.get('/:url/views', async (req, res) => {
    const originalShortUrl = req.params.url
    const find = await linkModel.where({short_url: 'localhost:8000/' + originalShortUrl})
    if (find.length > 0){
        const response = {
            "viewCount": find[0].clicks
        }
        res.send(response)
    }
    else{
        res.send('Non-existent short url')
    }
})


router.get('/:url', async (req, res) => {
    const originalShortUrl = req.params.url
    const find = await linkModel.where({short_url: 'localhost:8000/' + originalShortUrl})
    if (find.length > 0){
        await linkModel.updateOne({short_url: 'localhost:8000/' + originalShortUrl}, {clicks: find[0].clicks + 1});

        const response = {
            "redirectTo": find[0].url
        }
        res.send(response) 
    }
    else{
        res.send('Error 404')
    }
})

module.exports = router
