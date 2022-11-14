const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const ItemModel = require('../models/itemModel');
const CollectionModel = require('../models/collectionModel');
const ErrorHandler = require('../models/errorHandler');

const getRecentItems = async (req, res,next) => {
    try {
        const items = await ItemModel.find({}).limit(5).populate('author', 'username').populate('origin', 'name');
        res.status(200).json({items: items});
    } catch (err) {
        const error = new ErrorHandler('Could not load items.', 500);
        return next(error);
    }
}  

const getItem = async (req, res, next) => {
    const item_id = req.params.itemid;
    try {
        const item = await ItemModel.findById(item_id).populate('author', 'username').populate('origin', 'name');
        res.status(200).json({message: 'Item found.', item: item});
    } catch(err) {
        const error = new ErrorHandler('Could not find item.', 500);
        return next(error);
    }
}

const addItem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ErrorHandler('Invalid input, please try again.', 422);
        return next(error);
    }

    const { name, tags, description, image, origin, author } = req.body;

    const newItem = new ItemModel({
        origin: origin,
        author: author,
        name: name,
        tags: tags,
        description: description,
        image: image
    });

    let collection;

    try {
        collection = await CollectionModel.findById(origin);
        if(!collection) {
            const error = new ErrorHandler('Could not collection.', 500);
            return next(error);
        }
    } catch(err) {
        const error = new ErrorHandler('Could not create item.', 500);
        return next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newItem.save({session: session});
        collection.items.push(newItem);
        await collection.save({session: session});
        await session.commitTransaction();
    } catch(err) {
        const error = new ErrorHandler('Could not create item.', 500);
        return next(error);
    }
    res.status(201).json({message: 'Item created.'})
}

const updateItem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ErrorHandler('Invalid input, please try again.', 422);
        return next(error);
    }

    const item_id = req.params.itemid;
    const { name, tags, image, description } = req.body;

    try {
        await ItemModel.findByIdAndUpdate(item_id, {
            name: name,
            tags: tags,
            image: image,
            description: description
        });
    } catch(err) {
        const error = new ErrorHandler('Could not update item.', 500);
        return next(error);
    }

    res.json({message: 'Item updated.'});
}

const deleteItem = async (req, res, next) => {
    const item_id = req.params.itemid;

    let item;

    try {
        item = await ItemModel.findById(item_id).populate('origin');
    } catch(err) {
        const error = new ErrorHandler('Could not delete item.', 500);
        return next(error);
    }
    
    if (!item) {
        const error = new ErrorHandler('Could not find item.', 500);
        return next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await item.remove({session: session});
        await item.origin.items.pull(item);
        await item.origin.save({session: session});
        await session.commitTransaction();
    } catch(err) {
        const error = new ErrorHandler('Could not delete item.', 500);
        return next(error);
    }

    res.json({message: 'Item deleted.'});
}

exports.getRecentItems = getRecentItems;
exports.getItem = getItem;
exports.addItem = addItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;