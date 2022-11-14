const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true, minlength: 6},
    email: {type: String, required: true, unique: true},
    active: {type: Boolean, required: true, default: true},
    isAdmin: {type: Boolean, required: true, default: false},
    collections: [{type: mongoose.Types.ObjectId, required: true, ref: 'collections'}]
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;