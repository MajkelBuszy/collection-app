const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const ErrorHandler = require('../models/errorHandler');
const CollectionModel = require('../models/collectionModel');
const UserModel = require('../models/userModel');
const ItemModel = require('../models/itemModel');

const getBiggestCollections = async (req, res, next) => {
    try {
        const collections = await CollectionModel.find({}, '-items').limit(5).populate('creator', 'username');
        res.status(200).json({collections: collections});
    } catch(err) {
        const error = new ErrorHandler('Could not load collections.', 404);
        return next(error);
    }
}

const getUserCollections = async (req, res, next) => {
    const user_id = req.params.uid;
    try {
        const collections = await CollectionModel.find({ creator: user_id }).populate('creator', 'username');
        res.status(200).json({message: 'User collections found.', collections: collections});
    } catch(err) {
        const error = new ErrorHandler('Could not find collection.', 500);
        return next(error);
    }
}

const getCollectionById = async (req, res, next) => {
    const collection_id = req.params.cid;
    try {
        const collection = await CollectionModel.findById(collection_id).populate('items');
        if (collection) {
            res.status(200).json({message: 'Collection found', collection: collection});
        } else {
            const error = new ErrorHandler('Could not find collection.', 422);
            return next(error);
        }
    } catch(err) {
        const error = new ErrorHandler('Could not find collection.', 500);
        return next(error);
    }
}

const updateCollection = async (req, res, next) => {
    const id = req.params.cid;
    const { name, description, topic, image } = req.body;

    let collection;
    try {
        collection = await CollectionModel.findById(id);
    } catch(err) {
        const error = new ErrorHandler('Could not update collection.', 500);
        return next(error);
    }

    collection.name = name;
    collection.description = description;
    collection.topic = topic;
    if (image) collection.image = image;

    try {
        await collection.save();
    } catch(err) {
        const error = new ErrorHandler('Could not update collection.', 500);
        return next(error);
    }

    res.status(200).json({message: 'Collection updated.', collection: collection.toObject()});
}

const createCollection = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ErrorHandler('Invalid input, please check your data.', 422);
        return next(error);
    }

    const { name, description, topic, image, creator } = req.body;

    const newCollection = new CollectionModel({
        name,
        description,
        topic,
        image,
        creator
    });

    let user;
    try {
        user = await UserModel.findById(creator);
        if (!user) {
            const error = new ErrorHandler('Could not find user.', 404);
            return next(error);
        }
    } catch(err) {
        const error = new ErrorHandler('Could not create collection.', 500);
        return next(error);
    }
    
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newCollection.save({ session: session });
        user.collections.push(newCollection);
        await user.save({ session: session });
        await session.commitTransaction();
    } catch(err) {
        const error = new ErrorHandler('Could not create collection.', 500);
        return next(error);
    }

    res.status(201).json({message: 'Collection created.'});
}

const deleteCollection = async (req, res, next) => {
    const collection_id = req.params.cid;
    let collection;

    try {
        collection = await CollectionModel.findById(collection_id).populate('creator');
    } catch(err) {
        const error = new ErrorHandler('Could not delete collection.', 500);
        return next(error);
    }

    if (!collection) {
        const error = new ErrorHandler('Could not find collection.', 404);
        return next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await collection.remove({session: session});
        await collection.creator.collections.pull(collection);
        await collection.creator.save({session: session});
        await ItemModel.deleteMany({origin: collection_id}, {session: session});
        await session.commitTransaction();
    } catch(err) {
        const error = new ErrorHandler('Could not delete collection.', 500);
        return next(error);
    }
    res.status(200).json({message: 'Collection deleted'});
}

exports.getBiggestCollections = getBiggestCollections;
exports.getUserCollections = getUserCollections;
exports.getCollectionById = getCollectionById;
exports.updateCollection = updateCollection;
exports.createCollection = createCollection;
exports.deleteCollection = deleteCollection;