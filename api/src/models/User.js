import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

schema.methods.generateToken = function () {
    return jwt.sign({
        email: this.email
    }, process.env.TOKEN_SECRET)
}

schema.methods.packForLogin = function () {
    return {
        email: this.email,
        token: this.generateToken()
    }
}

schema.statics.verifyToken = function (token, callback) {
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        callback(err, decoded);
    })
}

schema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

export default mongoose.model('User', schema);