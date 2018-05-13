//const express     = require( 'express'     );
//const bodyParser  = require( 'body-parser' );

const {mongoose} = require( './../server/db/mongoose.js' );
const {Todo}     = require( './../server/models/todo.js' );
const {User}     = require( './../server/models/user.js' );

const {ObjectID} = require( 'mongodb' );


var todoId = '5af7a0bba03957a5cc36e2c6';

if( !ObjectID.isValid( todoId ) )
{
    console.log( `todoId[${todoId}] is invalid.` );
    return;
}

Todo.remove( {} ).then( (result) => {
    console.log( JSON.stringify( result, undefined, 2 ) );
})

Todo.findOneAndRemove( {
    _id: id
}).then( (todo) => {
    console.log( 'Removed Todo:', JSON.stringify( todo, undefined, 2 ) );
})

Todo.findByIdAndRemove( todoId ).then( (todo) => {
    if( !todo )
    {
        console.log( `todo not found for todoId[${todoId}]` );
        return;
    }
    console.log( 'Removed Todo:', JSON.stringify( todo, undefined, 2 ) );
}).catch( (err) => console.log( err ) );



var userId = '5af780ede69cd3a8dcdd1942';

if( !ObjectID.isValid( userId ) )
{
    console.log( `userId[${userId}] is invalid.` );
    return;
}

User.findById( userId ).then( (user) => {
    if( !user )
    {
        console.log( `User not found for userId[${userId}]` );
        return;
    }
    console.log( 'User:', JSON.stringify( user, undefined, 2 ) );
}).catch( (err) => console.log( err ) );



//var {User}        = require( './models/user.js' );

//var app = express();
//
//app.use( bodyParser.json() );
//
//
//app.post( '/todos', ( req, res ) => {
//    console.log( req.body );
//    
//    var newTodo = new Todo( {
//        text: req.body.text
//    });
//
//    newTodo.save().then( ( doc ) => {
//        console.log( 'Saved todo to database', JSON.stringify( doc, undefined, 2 ) );
//        res.status(200).send( doc );
//    }, (err) => {
//        console.log( 'Unable to save todo', err );
//        res.status(400).send( err );
//    });
//    
//});
//
//
//app.get( '/todos', ( req, res ) => {
//    Todo.find().then( (todos) => {
//        res.status( 200 ).send( {todos} ); 
//    }, (err) => {
//        res.status( 400 ).send( err );
//    });
//    
//});
//
//
//
//app.get( '/users', ( req, res ) => {
//    res.send( [ {name: 'Steve',     age: 58 },
//                {name: 'Pat',       age: 62 },
//                {name: 'Stephenie', age: 32 }] );
//});
//

//const port = 3000;
//
//app.listen( port, () => {
//    console.log( `Started on port ${port}` );
//} );
//
//module.exports.app = app;





//var newTodo = new Todo( {
//    text: 'Cook dinner',
//    completed: false,
//    completedAt: 12345
//});
//
//newTodo.save().then( ( doc ) => {
//    console.log( 'Saved todo to database', JSON.stringify( doc, undefined, 2 ) );
//}, (err) => {
//    console.log( 'Unable to save todo', err );
//});
//
//
//var newUser = new User( {
//    email: 'steve.rosenberry@gmail.com'
//});
//
//newUser.save().then( ( doc ) => {
//    console.log( 'Saved user to database', JSON.stringify( doc, undefined, 2 ) );
//}, (err) => {
//    console.log( 'Unable to save user', err );
//});
//
//
//var newUser2 = new User( {
//    email: 'x'
//});
//
//newUser2.save().then( ( doc ) => {
//    console.log( 'Saved user to database', JSON.stringify( doc, undefined, 2 ) );
//}, (err) => {
//    console.log( 'Unable to save user', err );
//});
