const _           = require( 'lodash'      );
const express     = require( 'express'     );
const bodyParser  = require( 'body-parser' );
const {ObjectID} = require( 'mongodb' );

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


app.get( '/', ( req, res ) => {
    
    res.status( 200 ).send( `<p>Todo App available!</p>
                             <p>PORT: ${process.env.PORT}<\p>
                             <p>MONGODB_URI: ${process.env.MONGODB_URI}<\p>`
                          ); 
    
});


app.get( '/todos', ( req, res ) => {
    
    Todo.find().then( (todos) => {
        res.status( 200 ).send( {todos} ); 
    }, (err) => {
        res.status( 400 ).send( err );
    });
    
});


app.get( '/todos/:id', ( req, res ) => {
    
    var todoId = req.params.id;
    
    if( !ObjectID.isValid( todoId ) )
    {
        sendError( res, 400, `todoId[${todoId}] is invalid.` );
        return;
    }
    
    Todo.findById( todoId ).then( (todo) => {
        if( !todo )
        {
            sendError( res, 404, `Todo not found for todoId[${todoId}].` );
            return;
        }
        res.status( 200 ).send( {todo} ); 
    }, (err) => {
        sendError( res, 500, `Internal error finding todo for id[${todoId}]` );
        return;
    });
    
});


app.put( '/todos/:id', ( req, res ) => {
    
    var todoId = req.params.id;
    var body   = _.pick( req.body, [ 'text', 'completed' ] );
    
    if( !ObjectID.isValid( todoId ) )
    {
        sendError( res, 400, `todoId[${todoId}] is invalid.` );
        return;
    }
    
    if ( _.isBoolean( body.completed ) && body.completed ) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed   = false;
        body.completedAt = null;
    }
    
    Todo.findByIdAndUpdate( todoId, { $set: body }, { new: true } ).then( (todo) => {
        if( !todo )
        {
            sendError( res, 404, `Todo not found for todoId[${todoId}].` );
            return;
        }
        res.status( 200 ).send( {todo} ); 
    }, (err) => {
        sendError( res, 500, `Internal error updating todo for id[${todoId}]` );
        return;
    });
    
});


app.delete( '/todos/:id', ( req, res ) => {
    
    var todoId = req.params.id;
    
    if( !ObjectID.isValid( todoId ) )
    {
        sendError( res, 400, `todoId[${todoId}] is invalid.` );
        return;
    }
    
    Todo.findByIdAndRemove( todoId ).then( (todo) => {
        if( !todo )
        {
            sendError( res, 404, `Todo not found for todoId[${todoId}].` );
            return;
        }
        res.status( 200 ).send( {todo} ); 
    }, (err) => {
        sendError( res, 500, `Internal error finding todo for id[${todoId}]` );
        return;
    });
    
});


function sendError( res, code, message )
{
    console.log( message );
    res.status( code ).send( message );
    return;
}

//
//app.get( '/users', ( req, res ) => {
//    res.send( [ {name: 'Steve',     age: 58 },
//                {name: 'Pat',       age: 62 },
//                {name: 'Stephenie', age: 32 }] );
//});
//

const port = process.env.PORT || 3000;

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
