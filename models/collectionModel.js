const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    topic: {type: String, required: true},
    image: {type: String, required: true, default: 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png'},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'users'},
    items: [{type: mongoose.Types.ObjectId, required: true, ref: 'items'}] 
});

const CollectionModel = mongoose.model('collections', CollectionSchema);
module.exports = CollectionModel;