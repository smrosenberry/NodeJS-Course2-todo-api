const request = require( 'supertest' );
const expect  = require( 'expect' );

const {app}  = require( './../server' );
const {Todo} = require( './../models/todo.js' );
const {User} = require( './../models/user.js' );

const {ObjectID} = require( 'mongodb' );

const todos = [
    { _id: new ObjectID(), text: 'First test todo'  },
    { _id: new ObjectID(), text: 'Second test todo' },
    { _id: new ObjectID(), text: 'Third test todo'  }
];


beforeEach( (done) => {
   Todo.remove({})
    .then(() => {
       Todo.insertMany( todos );
    })
    .then( () => done() );
});

describe( 'Todo-API', () => { 

    describe( 'POST /todos', () => { 

        it( 'should create a new todo', (done) => {
            
            var text = 'Test todo text';
            
            request(app)
              .post('/todos')
              .send( {text: text} )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => {
                    expect( res.body.text ).toBe( text );
                })
              .end( (err, res) => {
                if( err ) {
                    done( err );
                    return;
                }
                
                Todo.find({text}).then( (todos ) => {
                    expect( todos.length  ).toBe( 1    );
                    expect( todos[0].text ).toBe( text );
                    done();
                  }).catch( (err) => done( err ) )
              });
        });
        
        it( 'should NOT create todo with invalid body data', (done) => {
            request(app)
              .post('/todos')
              .send( {} )
              .expect( 400 )
              .end( (err, res) => {
                if( err ) {
                    done( err );
                    return;
                }
                
                Todo.find().then( (todos ) => {
                    expect( todos.length  ).toBe( 3 );
                    done();
                  }).catch( (err) => done( err ) );
              });
        });
        
    });
    

    describe( 'GET /todos', () => { 

        it( 'should get all todos', (done) => {
            request(app)
              .get('/todos')
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todos.length ).toBe( 3 );
                })
              .end( done );
            });

        it( 'should get one todo by id', (done) => {
            request(app)
              .get(`/todos/${todos[1]._id}`)
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todo._id  ).toBe( todos[1]._id.toString() );
                expect( res.body.todo.text ).toBe( todos[1].text );
                })
              .end( done );
            });
    
        it( 'should get 400 invalid id', (done) => {
            request(app)
              .get('/todos/111')
              .expect( 400 )
              .end( done );
            });
    
        it( 'should get 404 id not found', (done) => {
            request(app)
              .get(`/todos/${new ObjectID()}`)
              .expect( 404 )
              .end( done );
            });
    
    });
    
    
//    
//    describe( 'GET /no', () => { 
//        it( 'respond with json error', (done) => {
//            request(app)
//              .get('/no')
//              .expect( 404 )
//              .expect( 'Content-Type', /json/ )
//              .expect( { error: 'Page not found.' } )
//              .expect( (res) => {
//                    expect( res.body ).toInclude( {error: 'Page not found.' } );
//                })
//              .end( done );
//        });
//    });
//
//    describe( 'GET /users', () => { 
//        it( 'respond with json users', (done) => {
//            request(app)
//              .get('/users')
//              .expect( 200 )
//              .expect( 'Content-Type', /json/ )
//              .expect( (res) => {
//                    expect( res.body ).toInclude( { name: 'Steve', age: 58 } );
//                })
//              .end( done );
//        });
//    });
});