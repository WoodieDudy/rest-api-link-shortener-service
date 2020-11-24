const {Router, response} = require('express')
const router = Router()
const {nanoid} = require('nanoid')
const linkModel = require('./models/links_db')


router.post('/shorten', async (req, res) => {
    const urlToShorten = req.body.urlToShorten

    const find = await linkModel.findOne({url: urlToShorten})
    if (find != null){
        const response = {
            "status": 'Got',
            "shortenedUrl": find.short_url
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
    const find = await linkModel.findOne({short_url: 'localhost:8000/' + originalShortUrl})
    if (find != null){
        const response = {
            "viewCount": find.clicks
        }
        res.send(response)
    }
    else{
        res.send('Non-existent short url')
    }
})


router.get('/:url', async (req, res) => {
    const originalShortUrl = req.params.url
    const find = await linkModel.findOne({short_url: 'localhost:8000/' + originalShortUrl})
    if (find != null){
        await linkModel.updateOne({short_url: 'localhost:8000/' + originalShortUrl}, {clicks: find.clicks + 1});
        if (find.url.startsWith('http')){
            res.redirect(find.url)
        }
        else{
            res.redirect('http://' + find.url)
        }
    }
    else{
        res.status(404).send('Unknown short link') 
    }
})

module.exports = router
