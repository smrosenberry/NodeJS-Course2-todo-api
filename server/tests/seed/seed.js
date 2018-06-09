const jwt        = require( 'jsonwebtoken' );
const bcrypt     = require( 'bcryptjs'     );
const {ObjectID} = require( 'mongodb'      );

const {Todo} = require( './../../models/todo.js' );
const {User} = require( './../../models/user.js' );


const todos = [
    { _id: new ObjectID(), text: 'First test todo'  },
    { _id: new ObjectID(), text: 'Second test todo' },
    { _id: new ObjectID(), text: 'Third test todo', completed: true, completedAt: 333  }
];


const authTokenName = User.authTokenName;
const jwtSecret     = User.jwtSecret;

const userIds = [ new ObjectID(), 
                  new ObjectID(), 
                  new ObjectID() ];

const tokens  = [ jwt.sign( { _id: userIds[0], authTokenName }, jwtSecret ).toString(),
                  jwt.sign( { _id: userIds[1], authTokenName }, jwtSecret ).toString(),
                  jwt.sign( { _id: userIds[2], authTokenName }, jwtSecret ).toString() ];

const users = [
    { _id: userIds[0], email: 'user1@test.com', password: '123456!', tokens: [ {access: authTokenName, token: tokens[0] } ] },
    { _id: userIds[1], email: 'user2@test.com', password: 'abcdef!' /*, tokens: [ {access: authTokenName, token: tokens[1] } ]*/ },
    { _id: userIds[2], email: 'user3@test.com', password: 'abc123!', tokens: [ {access: authTokenName, token: tokens[2] } ] }
];


const populateTodos = (done) => {
    Todo.remove({})
    .then( () => {
       Todo.insertMany( todos );
    })
    .then( () => done() );
};


const populateUsers = (done) => {
    User.remove({})
    .then( () => {
        var user1 = new User( users[0] ).save();
        var user2 = new User( users[1] ).save();
        var user3 = new User( users[2] ).save();
        return Promise.all( [user1, user2, user3] ).then( () => {
            done();
        } );
        
    })
    .catch( (err) => {
        console.log( `err[${ err }]\n` );
    });
};    
    

module.exports = {
    todos, 
    populateTodos,
    users, 
    populateUsers
}