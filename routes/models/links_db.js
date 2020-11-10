const {Schema, model} = require('mongoose')

const schema = new Schema({
    url: {
        type: String
    },
    short_url: {
        type: String
    },
    clicks: {
        type: Number,
        default: 0
    }
})


module.exports = model('Links', schema)
