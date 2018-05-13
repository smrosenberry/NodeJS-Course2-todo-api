const mongoose = require( 'mongoose' );

mongoose.Promise = global.Promise;

dbURI = process.env.MONGODB_URI || 
        'mongodb://localhost:27017/TodoApp';

mongoose.connect( dbURI );
    
module.exports = {
    mongoose: mongoose
}