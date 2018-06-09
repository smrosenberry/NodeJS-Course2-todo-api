require( './../config/config.js' );

const request = require( 'supertest' );
const expect  = require( 'expect'    );

const {mongoose} = require( './../db/mongoose.js' );
const {app}      = require( './../server.js'      );
const {Todo}     = require( './../models/todo.js' );
const {User}     = require( './../models/user.js' );
const seed       = require( './seed/seed.js'      );

const {ObjectID} = require( 'mongodb' );

beforeEach( seed.populateUsers );
beforeEach( seed.populateTodos );

describe( 'Todo-API', () => { 

    describe( 'POST /todos', () => { 

        it( 'should create a new todo', (done) => {
            
            var text = 'Test todo text';
            
            request(app)
              .post('/todos')
              .set( 'x-auth', seed.users[0].tokens[0].token )
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
              .set( 'x-auth', seed.users[0].tokens[0].token )
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
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todos.length ).toBe( 3 );
                })
              .end( done );
            });

        it( 'should get one todo by id', (done) => {
            request(app)
              .get(`/todos/${seed.todos[1]._id}`)
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todo._id  ).toBe( seed.todos[1]._id.toString() );
                expect( res.body.todo.text ).toBe( seed.todos[1].text );
                })
              .end( done );
            });
    
        it( 'should get 400 invalid id', (done) => {
            request(app)
              .get('/todos/111')
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 400 )
              .end( done );
            });
    
        it( 'should get 404 id not found', (done) => {
            request(app)
              .get(`/todos/${new ObjectID()}`)
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 404 )
              .end( done );
            });
    
    });
    

    describe( 'PUT /todos', () => { 

        it( 'should update one todo by id', (done) => {
            var text = "test update text";
            request(app)
              .put(`/todos/${seed.todos[1]._id}`)
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .send( { text: text, completed: true } )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todo._id         ).toBe( seed.todos[1]._id.toString() );
                expect( res.body.todo.text        ).toBe( text );
                expect( res.body.todo.completed   ).toBe( true );
                //expect( res.body.todo.completedAt ).toBeA( 'number' );
                expect( res.body.todo.completedAt ).toBeGreaterThan( 0 );
                })
              .end( done );
            });
    
        it( 'should clear completedAt for one todo by id', (done) => {
            request(app)
              .put(`/todos/${seed.todos[2]._id}`)
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .send( { completed: false } )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todo._id  ).toBe( seed.todos[2]._id.toString() );
                expect( res.body.todo.text ).toBe( seed.todos[2].text );
                expect( res.body.todo.completed   ).toBe( false );
                expect( res.body.todo.completedAt ).toBe( null  );
                })
              .end( done );
            });
    
        it( 'should get 400 invalid id', (done) => {
            request(app)
              .put('/todos/111')
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 400 )
              .end( done );
            });
    
        it( 'should get 404 id not found', (done) => {
            request(app)
              .put(`/todos/${new ObjectID()}`)
              .set( 'x-auth', seed.users[0].tokens[0].token )
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
              .delete(`/todos/${seed.todos[1]._id}`)
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => { 
                expect( res.body.todo._id  ).toBe( seed.todos[1]._id.toString() );
                expect( res.body.todo.text ).toBe( seed.todos[1].text );
                })
              .end( (err, res) => {
                    if( err ) {
                        done(err);
                        return;
                    }
                
                    Todo.findById( seed.todos[1]._id ).then( (todo ) => {
                        expect( todo ).toBe( null );
                        done();
                      }).catch( (err) => done( err ) )
                
                });
            });
    
        it( 'should get 400 invalid id', (done) => {
            request(app)
              .delete('/todos/111')
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 400 )
              .end( done );
            });
    
        it( 'should get 404 id not found', (done) => {
            request(app)
              .delete(`/todos/${new ObjectID()}`)
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 404 )
              .end( done );
            });
    
    });
    
    
    describe( 'GET /no', () => { 
        it( 'respond with 404 error', (done) => {
            request(app)
              .get('/no')
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 404 )
//              .expect( { error: 'Page not found.' } )
//              .expect( (res) => {
//                    expect( res.body ).toInclude( {error: 'Page not found.' } );
//                })
              .end( done );
        });
    });


    describe( 'GET /users/me', () => { 
        
        it( 'respond with user1@test.com', (done) => {
            
            //console.log( `users[${ JSON.stringify( seed.users[0], undefined, 2 ) }]` );
            
            request(app)
              .get('/users/me')
              .set( 'x-auth', seed.users[0].tokens[0].token )
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => {
                    expect( res.body._id   ).toBe( seed.users[0]._id.toHexString() );
                    expect( res.body.email ).toBe( seed.users[0].email );
                })
              .end( done );
        });
        
        it( 'respond with unauthorized', (done) => {
            request(app)
              .get('/users/me')
//              .set( 'x-auth', seed.users[1].tokens[0].token )
              .expect( 401 )
              .expect( (res) => {
                    expect( res.body ).toEqual( {} );
                })
              .end( done );
        });
        
    });

    describe( 'POST /users', () => { 
        
        it( 'should create a new user', (done) => {
            
            //console.log( `users[${ JSON.stringify( seed.users[0], undefined, 2 ) }]` );
            var email = 'example@example.com';
            var password = 'abc123!'
            
            request(app)
              .post('/users')
              .send({email, password})
              .expect( 200 )
              .expect( 'Content-Type', /json/ )
              .expect( (res) => {
                    expect( res.headers['x-auth'] ).toBeTruthy();
                    expect( res.body._id          ).toBeTruthy();
                    expect( res.body.email        ).toBe(email);
                })
              .end( (err) => {
                if( err ) {
                    return( done(err) );
                }
                User.findOne( {email} ).then( (user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                })
            } );
        });
        
        it( 'should return validation errors if request invalid', (done) => {
            var email = 'bad_example';
            var password = 'abc'
            request(app)
              .post('/users')
              .send({email, password})
              .expect( 400 )
              .end( done );
        });

        it( 'should not create user if email in use', (done) => {
            var email = seed.users[0].email;
            var password = 'abc123!'
            request(app)
              .post('/users')
              .send({email, password})
              .expect( 400 )
              .end( done );
        });
        
    });
    
});