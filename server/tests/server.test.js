const request = require( 'supertest' );
const expect  = require( 'expect' );

const {app}  = require( './../server' );
const {Todo} = require( './../models/todo.js' );
const {User} = require( './../models/user.js' );

beforeEach( (done) => {
   Todo.remove({}).then(() =>done()); 
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
                
                Todo.find().then( (todos ) => {
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
                    expect( todos.length  ).toBe( 0 );
                    done();
                  }).catch( (err) => done( err ) )
              });
        });
        
    });
    
    
//    describe( 'GET /', () => { 
//
//        it( 'respond with html', (done) => {
//            request(app)
//              .get('/')
//              .set( 'Accept', 'application/html' )
//              .expect( 200 )
//              .expect( 'Content-Type', /html/ )
//              .expect( 'Hello world!' )
//              .expect(200, done);
//        });
//    });
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