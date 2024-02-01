const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 12);
            user.password = hashedPassword;
            return next();
        } catch (error) {
            return next(error);
        }
    } else {
        return next();
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
