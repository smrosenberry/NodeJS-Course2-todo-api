const mongoose = require( 'mongoose' );

mongoose.Promise = global.Promise;

dbURI = process.env.MONGODB_URI;

mongoose.connect( dbURI );
    
module.exports = {
    mongoose: mongoose
}