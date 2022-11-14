const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ErrorHandler = require('../models/errorHandler');
const CollectionModel = require('../models/collectionModel');
const UserModel = require('../models/userModel');
const ItemModel = require('../models/itemModel');

const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find({}, '-password');
        res.status(200).json({users: users});
    } catch(err) {
        const error = new ErrorHandler('Could not load users.', 500);
        return next(error);
    } 
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    let user;

    try {
        user = await UserModel.findOne({ email: email });
    } catch(err) {
        const error = new ErrorHandler('Something went wrong, please try again later.', 500);
        return next(error);
    }

    if (!user) {
        const error = new ErrorHandler('Invalid credentials, please check your data.', 401);
        return next(error);
    }

    if (!user.active) {
        const error = new ErrorHandler('Account blocked.', 422);
        return next(error);
    }

    let passwordsMatch;

    try {
        passwordsMatch = await bcrypt.compare(password, user.password);
    } catch(err) {
        const error = new ErrorHandler('Invalid credentials, please check your data.', 500);
        return next(error);
    }

    if (!passwordsMatch) {
        const error = new ErrorHandler('Invalid credentials, please check your data.', 401);
        return next(error);
    }
    let token;
    try {
        token = jwt.sign({
            userId: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }, 'secretkey')
    } catch(err) {
        const error = new ErrorHandler('Something went wrong, please try again later.', 500);
        return next(error);
    }
    res.status(200).json({message: 'Login successfull.', token: token, userId: user._id, email: user.email, isAdmin: user.isAdmin});
}

const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ErrorHandler('Invalid input, please check your data.', 422);
        return next(error);
    }

    const { username, email, password } = req.body;

    try {
        const checkEmail = await UserModel.findOne({email: email});
        const checkName = await UserModel.findOne({username: username});
        if (checkEmail || checkName) {
            const error = new ErrorHandler('User already exists.', 422);
            return next(error);
        }
    } catch(err) {
        const error = new ErrorHandler('Sign up failed, please check your data.', 500);
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch(err) {
        const error = new ErrorHandler('Could not sign up, please try again.', 500);
        return next(error);
    }

    try {
        await UserModel.create({
            username: username,
            password: hashedPassword,
            email: email
        });
    } catch(err) {
        const error = new ErrorHandler('Could not sign up, please try again.', 500);
        return next(error);
    }


    res.status(201).json({message: 'Sign up successfull. You can now login.'});
}

const blockUser = async (req, res, next) => {
    const user_id = req.params.uid;
    const { token } = req.body;

    let decryptedToken;
    try {
        decryptedToken = jwt.verify(token, 'secretkey');
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }
        
    if (!decryptedToken.isAdmin) {
        const error = new ErrorHandler('You are not an Admin.', 401);
        return next(error);
    }

    try {
        await UserModel.findByIdAndUpdate(user_id, {active: false});
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }

    res.status(200).json({message: 'User blocked.'});
}

const unblockUser = async (req, res, next) => {
    const user_id = req.params.uid;
    const { token } = req.body;

    let decryptedToken;
    try {
        decryptedToken = jwt.verify(token, 'secretkey');
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }
        
    if (!decryptedToken.isAdmin) {
        const error = new ErrorHandler('You are not an Admin.', 401);
        return next(error);
    }

    try {
        await UserModel.findByIdAndUpdate(user_id, {active: true});
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }

    res.status(200).json({message: 'User unblocked.'});
}

const makeAdmin = async (req, res, next) => {
    const user_id = req.params.uid;
    const { token } = req.body;

    let decryptedToken;
    try {
        decryptedToken = jwt.verify(token, 'secretkey');
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }
        
    if (!decryptedToken.isAdmin) {
        const error = new ErrorHandler('You are not an Admin.', 401);
        return next(error);
    }

    try {
        await UserModel.findByIdAndUpdate(user_id, {isAdmin: true});
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }

    res.status(200).json({message: 'Admin granted.'});
}

const makeUser = async (req, res, next) => {
    const user_id = req.params.uid;
    const { token } = req.body;

    let decryptedToken;
    try {
        decryptedToken = jwt.verify(token, 'secretkey');
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }
        
    if (!decryptedToken.isAdmin) {
        const error = new ErrorHandler('You are not an Admin.', 401);
        return next(error);
    }

    try {
        await UserModel.findByIdAndUpdate(user_id, {isAdmin: false});
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }

    res.status(200).json({message: 'Admin revoked.'});
}

const deleteUser = async (req, res, next) => {
    const user_id = req.params.uid;
    const { token } = req.body;

    let decryptedToken;
    try {
        decryptedToken = jwt.verify(token, 'secretkey');
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }
        
    if (!decryptedToken.isAdmin) {
        const error = new ErrorHandler('You are not an Admin.', 401);
        return next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await UserModel.findByIdAndDelete(user_id, {session: session});
        await CollectionModel.deleteMany({creator: user_id}, {session: session});
        await ItemModel.deleteMany({author: user_id}, {session: session});
        await session.commitTransaction();
    } catch(err) {
        const error = new ErrorHandler('Something went wrong.', 500);
        return next(error);
    }

    res.status(200).json({message: 'User deleted.'});
}

exports.getUsers = getUsers;
exports.loginUser = loginUser;
exports.createUser = createUser;
exports.blockUser = blockUser;
exports.unblockUser = unblockUser;
exports.makeAdmin = makeAdmin;
exports.makeUser = makeUser;
exports.deleteUser = deleteUser;