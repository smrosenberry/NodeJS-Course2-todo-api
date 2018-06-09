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

//console.log( `\nauthTokenName[${ authTokenName }]` );
//console.log( `jwtSecret[${ jwtSecret }]\n` );


const userIds = [ new ObjectID(), 
                  new ObjectID(), 
                  new ObjectID() ];

const tokens  = [ jwt.sign( { _id: userIds[0], authTokenName }, jwtSecret ).toString(),
                  jwt.sign( { _id: userIds[1], authTokenName }, jwtSecret ).toString(),
                  jwt.sign( { _id: userIds[2], authTokenName }, jwtSecret ).toString() ];

const users = [
    { _id: userIds[0], email: 'user1@test.com', password: '123456', tokens: [ {access: authTokenName, token: tokens[0] } ] },
    { _id: userIds[1], email: 'user2@test.com', password: 'abcdef' /*, tokens: [ {access: authTokenName, token: tokens[1] } ]*/ },
    { _id: userIds[2], email: 'user3@test.com', password: 'abc123', tokens: [ {access: authTokenName, token: tokens[2] } ] }
];

//console.log( `users[0].tokens[0][${ JSON.stringify( users[0].tokens[0], undefined, 2 ) }]\n` );
//decoded = jwt.verify( users[0].tokens[0].token, 'abc123' );
//console.log( `decoded[${ JSON.stringify( decoded, undefined, 2 ) }]\n` );
//
//
const populateTodos = (done) => {
    Todo.remove({})
    .then( () => {
       Todo.insertMany( todos );
    })
    .then( () => done() );
};


const populateUsers = (done) => {
    //console.log( `Clear user database.` );
    User.remove({})
    .then( () => {
        //console.log( `users[0].tokens[0][${ JSON.stringify( users[0].tokens[0], undefined, 2 ) }]` );
        var user1 = new User( users[0] ).save();
        var user2 = new User( users[1] ).save();
        var user3 = new User( users[2] ).save();
        return Promise.all( [user1, user2, user3] ).then( () => {
            //console.log( 'populateUsers() calling done' );
            done();
        } );
        
//        User.create( users[0], (err,res) => {
//            console.log( 'populateUsers(): calling done()' );
//       } );
    })
    .catch( (err) => {
        console.log( `err[${ err }]\n` );
    });
};    
    
    
//    User.remove({})
//    .then( () => {
//       User.create( users[0], (err,res) => {
//           done();
//       } );
//    });
    

//    .then( () => {
//        console.log( `users[0].tokens[0][${ JSON.stringify( users[0].tokens[0], undefined, 2 ) }]\n` );
//        decoded = jwt.verify( users[0].tokens[0].token, 'abc123' );
//        console.log( `decoded[${ JSON.stringify( decoded, undefined, 2 ) }]\n` );
//        return( new User( users[0] ).save().then( done() ) );
        //var user1 = new User( users[0] ).save().then( done() );
//        var user2 = new User( users[1] ).save();
//        var user3 = new User( users[2] ).save();
//        return Promise.all( [user1, user2, user3] ).then( () => {
//            console.log( 'populateUsers() calling done' );
//            done();
//        } );
//    })
//};


//const populateUsers = (done) => {
//  User.remove({})
//    .then(() => {
//        var userOne = new User(users[0]).save();
//        var userTwo = new User(users[1]).save();
//
//        return Promise.all([userOne, userTwo])
//        }).then(() => done());
//};

module.exports = {
    todos, 
    populateTodos,
    users, 
    populateUsers
}