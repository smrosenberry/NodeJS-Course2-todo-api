require( './config/config.js' );

const _            = require( 'lodash'       );
const express      = require( 'express'      );
const bodyParser   = require( 'body-parser'  );
const {ObjectID}   = require( 'mongodb'      );

var {mongoose}     = require( './db/mongoose.js'             );
var {Todo}         = require( './models/todo.js'             );
var {User}         = require( './models/user.js'             );
var {authenticate,
     authHeader }  = require( './middleware/authenticate.js' );



var app = express();

app.use( bodyParser.json() );

app.post( '/todos', authenticate, ( req, res ) => {
    
    console.log( req.body );
    
    var newTodo = new Todo( {
        text: req.body.text
    });

    newTodo.save().then( ( doc ) => {
        res.status(200).send( doc );
    }, (err) => {
        res.status(400).send( err );
    });
    
});


app.get( '/', ( req, res ) => {
    
    res.status( 200 ).send( `<p>Todo App available!</p>
                             <p>PORT: ${process.env.PORT}<\p>
                             <p>MONGODB_URI: ${process.env.MONGODB_URI}<\p>`
                          ); 
    
});


app.get( '/todos', authenticate, ( req, res ) => {
    
    Todo.find().then( (todos) => {
        res.status( 200 ).send( {todos} ); 
    }, (err) => {
        res.status( 400 ).send( err );
    });
    
});


app.get( '/todos/:id', authenticate, ( req, res ) => {
    
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


app.put( '/todos/:id', authenticate, ( req, res ) => {
    
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


app.delete( '/todos/:id', authenticate, ( req, res ) => {
    
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

app.post( '/users', ( req, res ) => {
    
    console.log( '/users: ' + JSON.stringify( req.body, undefined, 2 ) );
    
    var body = _.pick( req.body, [ 'email', 'password' ] );
    
    var newUser = new User( body );

    newUser.save().then( () => {
//        console.log( 'Saved user to database', JSON.stringify( newUser, undefined, 2 ) );
        return newUser.generateAuthToken();
    }).then( (token) => {
        res.header( authHeader, token ).send( newUser );
    }).catch( (err) => {
        console.log( 'Unable to save user', err );
        res.status( 400 ).send( err );
    });
    
});


app.post( '/users/login', ( req, res ) => {
    
    var body = _.pick( req.body, [ 'email', 'password' ] );
    
    User.findByCredentials( body.email, body.password ).then( (user) => {
        return user.generateAuthToken().then( (token) => {
            res.header( authHeader, token ).send( user );
        });
    }).catch( (err) => {
        res.status( 400 ).send( err );
    });
    
});


app.get( '/users/me', authenticate, ( req, res ) => {
    
    res.send( req.user );
    
});


function sendError( res, code, message )
{
    console.log( message );
    res.status( code ).send( message );
    return;
}


const port = process.env.PORT;

app.listen( port, () => {
    console.log( `Started on port ${port}` );
} );

module.exports.app = app;
