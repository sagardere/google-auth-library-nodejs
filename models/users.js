var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});


// generating a hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.local.password);
};

//Define and Export user modeule
var User = mongoose.model('User', userSchema);

module.exports = User;