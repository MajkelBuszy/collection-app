const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    origin: {type: mongoose.Types.ObjectId, required: true, ref: 'collections'},
    author: {type: mongoose.Types.ObjectId, required: true, ref: 'users'},
    name: {type: String, required: true},
    tags: [{type: String}],
    likes: {type: Number, default: 0},
    image: {type: String, required: true, default: 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png'},
    description: {type: String, required: true},
    comments: [{
        author: {type: String},
        content: {type: String}
    }],
    additionalFields: [{
        name: {type: String},
        type: {type: String}
    }]
});

const ItemModel = mongoose.model('items', ItemSchema);
module.exports = ItemModel;