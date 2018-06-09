const _         = require( 'lodash'       );
const mongoose  = require( 'mongoose'     );
const validator = require( 'validator'    );
const jwt       = require( "jsonwebtoken" );
const bcrypt    = require( "bcryptjs"     );

var UserSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        minlength: 2,
        trim: true,
        unique: true,
        validate: { 
            validator: validator.isEmail,
            message: '[{VALUE}] is not a valid email address.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6       
    },
    tokens: [{
        access: {
            type: String,
            required: true        
        },
        token: {
            type: String,
            required: true        
        }
    }]
});

const authTokenName = 'auth';
const jwtSecret  = 'abc123';

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick( userObject, [ '_id', 'email' ] );
};

UserSchema.pre( 'save', function( next ) {
 
    var user = this;
    
    if( user.isModified( 'password' ) ) {
        
        bcrypt.genSalt( 10, (err, jwtSecret) => {

//            console.log( `jwtSecret[${jwtSecret}]` );
//            console.log( `user.password[${user.password}]` );

            bcrypt.hash( user.password, jwtSecret, (err, hash) => {
                user.password = hash;
//                console.log( `hashed user.password[${user.password}]` );
                next();
            })

        });
        
    }
    else {
        next();
    }
    
});

UserSchema.methods.generateAuthToken = function() {
    
    var user   = this;
    var access = authTokenName;
    
    var token  = jwt.sign( { _id: user._id.toHexString(), access }, jwtSecret ).toString();
    
    user.tokens.push( { access, token } );
    
    return user.save().then( ()=> {
        return( token );
    });
           
}

UserSchema.statics.findByToken = function( token ) {
    var User = this;
    var decoded;
    //console.log( `token[${ JSON.stringify( token, undefined, 2 ) }]` );
    
    try {
        decoded = jwt.verify( token, jwtSecret );
        //console.log( `decoded[${ JSON.stringify( decoded, undefined, 2 ) }]` );
    }
    catch( err ) {
        console.log( `UserSchema.findByToken encountered err[${err}]` );
        return Promise.reject();
    }

    return User.findOne( { '_id'           : decoded._id, 
                           'tokens.token'  : token,
                           'tokens.access' : authTokenName } );
    
    
}

UserSchema.statics.findByCredentials = function( email, password ) {
    
    var User = this;

    return User.findOne( {email} ).then( ( user ) => {
        
        if( !user ) {
            return( Promise.reject() );
        }
        
        return new Promise( ( resolve, reject ) => {
            
            bcrypt.compare( password, user.password, (err, res) => {
                if( res ) {
                    resolve( user );
                }
                else {
                    reject();
                }
            });
            
        });
        
    });
    
 
    
    var decoded;
    //console.log( `token[${ JSON.stringify( token, undefined, 2 ) }]` );
    
    try {
        decoded = jwt.verify( token, jwtSecret );
        //console.log( `decoded[${ JSON.stringify( decoded, undefined, 2 ) }]` );
    }
    catch( err ) {
        console.log( `UserSchema.findByToken encountered err[${err}]` );
        return Promise.reject();
    }

    return User.findOne( { '_id'           : decoded._id, 
                           'tokens.token'  : token,
                           'tokens.access' : authTokenName } );
    
    
}


UserSchema.statics.authTokenName = authTokenName;
UserSchema.statics.jwtSecret     = jwtSecret;

var User = mongoose.model( 'User', UserSchema );

module.exports = {
    User,
}