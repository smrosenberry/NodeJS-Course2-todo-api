const request = require( 'supertest' );
const expect  = require( 'expect'    );

const {app}  = require( './../server.js'      );
const {Todo} = require( './../models/todo.js' );
const {User} = require( './../models/user.js' );

const {ObjectID} = require( 'mongodb' );

const todos = [
    { _id: new ObjectID(), text: 'First test todo'  },
    { _id: new ObjectID(), text: 'Second test todo' },
    { _id: new ObjectID(), text: 'Third test todo', completed: true, completedAt: 333  }
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
    

    describe( 'PUT /todos', () => { 

        it( 'should update one todo by id', (done) => {
            var text = "test update text";
            request(app)
              .put(`/todos/${todos[1]._id}`)
              .send( { text: text, completed: true } )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todo._id         ).toBe( todos[1]._id.toString() );
                expect( res.body.todo.text        ).toBe( text );
                expect( res.body.todo.completed   ).toBe( true );
                //expect( res.body.todo.completedAt ).toBeA( 'number' );
                expect( res.body.todo.completedAt ).toBeGreaterThan( 0 );
                })
              .end( done );
            });
    
        it( 'should clear completedAt for one todo by id', (done) => {
            request(app)
              .put(`/todos/${todos[2]._id}`)
              .send( { completed: false } )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todo._id  ).toBe( todos[2]._id.toString() );
                expect( res.body.todo.text ).toBe( todos[2].text );
                expect( res.body.todo.completed   ).toBe( false );
                expect( res.body.todo.completedAt ).toBe( null  );
                })
              .end( done );
            });
    
        it( 'should get 400 invalid id', (done) => {
            request(app)
              .put('/todos/111')
              .expect( 400 )
              .end( done );
            });
    
        it( 'should get 404 id not found', (done) => {
            request(app)
              .put(`/todos/${new ObjectID()}`)
              .expect( 404 )
              .end( done );
            });
    
    });
    
    
    describe( 'DELETE /todos', () => { 

//        it( 'should delete all todos', (done) => {
//            request(app)
//              .delete('/todos')
//              .expect( 200 )
//              .expect( 'Content-Type', /json/ )
//              .expect( (res) => { 
//                expect( res.body.n ).toBe( 3 );
//                })
//              .end( done );
//            });

        it( 'should delete one todo by id', (done) => {
            request(app)
              .delete(`/todos/${todos[1]._id}`)
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todo._id  ).toBe( todos[1]._id.toString() );
                expect( res.body.todo.text ).toBe( todos[1].text );
                })
              .end( (err, res) => {
                    if( err ) {
                        done(err);
                        return;
                    }
                
                    Todo.findById( todos[1]._id ).then( (todo ) => {
                        expect( todo ).toBe( null );
                        done();
                      }).catch( (err) => done( err ) )
                
                });
            });
    
        it( 'should get 400 invalid id', (done) => {
            request(app)
              .delete('/todos/111')
              .expect( 400 )
              .end( done );
            });
    
        it( 'should get 404 id not found', (done) => {
            request(app)
              .delete(`/todos/${new ObjectID()}`)
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