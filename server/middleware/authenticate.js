var {User} = require( './../models/user.js' );

const authHeader = 'x-' + User.authTokenName;

var authenticate = ( req, res, next ) => {
    
    var token = req.header( authHeader );
    //console.log( `token[${token}]` );
    
    User.findByToken( token ).then( (user) => {
    //console.log( `user[${user}]` );
        if( !user ) {
            return Promise.reject();
        }
        req.user  = user;
        req.token = token;
        next();
    }).catch( (err) => {
        console.log( 'Authentication failed', err );
        res.status( 401 ).send( err );        
    });

}

module.exports = {
    authenticate,
    authHeader
}