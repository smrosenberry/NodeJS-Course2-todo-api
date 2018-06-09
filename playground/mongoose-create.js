
process.env.NODE_ENV = 'test';

require( './../server/config/config.js' );

const jwt        = require( 'jsonwebtoken' );
const bcrypt     = require( 'bcryptjs'     );

const {mongoose} = require( './../server/db/mongoose.js' );
const {Todo}     = require( './../server/models/todo.js' );
const {User}     = require( './../server/models/user.js' );
const seed       = require( './../server/tests/seed/seed.js' );
//
const {ObjectID} = require( 'mongodb' );


const authTokenName = User.authTokenName;
const jwtSecret     = User.jwtSecret;

console.log( `\nauthTokenName[${ authTokenName }]` );
console.log( `jwtSecret[${ jwtSecret }]\n` );

seed.populateTodos( () => console.log( 'TODOS ALL FINISHED!' ) );
seed.populateUsers( () => console.log( 'USERS ALL FINISHED!' ) );

