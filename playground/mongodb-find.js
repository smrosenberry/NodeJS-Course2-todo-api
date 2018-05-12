//const MongoClient = require( 'mongodb' ).MongoClient;
const {MongoClient, ObjectID} = require( 'mongodb' );

MongoClient.connect( 'mongodb://localhost:27017/TodoApp',  
                     { useNewUrlParser: true }, 
                     ( err, client ) => {
    
    if( err )
    {
        console.log( 'Unable to connect MongoDB server.');
        return;
    }
    
    console.log( 'Connected to MongoDB server' );
    const db = client.db( 'TodoApp' );
    
    
    var queryById = { _id: new ObjectID( '5af74ba5fcda92999c2a7167' ) };
    var queryByCompleted = { completed: false };
    var queryByName = { name: 'Michele' };
    var queryAll = {};
    
    var cursor = db.collection( 'Users' ).find( queryByName );
    
    cursor.toArray().then( ( docs ) => {
        console.log( 'Todos:' );
        console.log( JSON.stringify( docs, undefined, 2 ) );
    }, (err) => {
        console.log( 'Unable to fetch todos', err  );
    });

    
    cursor.count().then( ( count ) => {
        console.log( `Count[${count}]` );
    }, (err) => {
        console.log( 'Unable to fetch count', err  );
    });
    
    
//    db.collection( 'Todos' ).insertOne( {
//        text: 'Something to do',
//        completed: false
//    }, ( err, result ) => {
//        
//        if( err )
//            {
//                console.log( 'Unable to insert todo', err  );
//                return;
//            }
//        
//        console.log( JSON.stringify( result.ops, undefined, 2 ) );
//        
//    } );
    
    
//    db.collection( 'Users' ).insertOne( {
//        name: 'Steve Rosenberry',
//        age: 58,
//        location: 'Glen Allen, VA'
//    }, ( err, result ) => {
//        
//        if( err )
//            {
//                console.log( 'Unable to insert user', err  );
//                return;
//            }
//        
//        //console.log( JSON.stringify( result.ops, undefined, 2 ) );
//        console.log( result.ops[0]._id.getTimestamp() );
//        
//    } );

    
    client.close();
    
} );