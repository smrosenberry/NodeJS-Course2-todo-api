const express     = require( 'express'     );
const bodyParser  = require( 'body-parser' );

var {mongoose}    = require( './db/mongoose.js' );
var {Todo}        = require( './models/todo.js' );
var {User}        = require( './models/user.js' );

var app = express();

app.use( bodyParser.json() );


app.post( '/todos', ( req, res ) => {
    console.log( req.body );
    
    var newTodo = new Todo( {
        text: req.body.text
    });

    newTodo.save().then( ( doc ) => {
        console.log( 'Saved todo to database', JSON.stringify( doc, undefined, 2 ) );
        res.status(200).send( doc );
    }, (err) => {
        console.log( 'Unable to save todo', err );
        res.status(400).send( err );
    });
    
});


app.get( '/todos', ( req, res ) => {
    Todo.find().then( (todos) => {
        res.status( 200 ).send( {todos} ); 
    }, (err) => {
        res.status( 400 ).send( err );
    });
    
});


//
//app.get( '/users', ( req, res ) => {
//    res.send( [ {name: 'Steve',     age: 58 },
//                {name: 'Pat',       age: 62 },
//                {name: 'Stephenie', age: 32 }] );
//});
//

const port = 3000;

app.listen( port, () => {
    console.log( `Started on port ${port}` );
} );

module.exports.app = app;





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
