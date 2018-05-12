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
    
    
    var queryById = { _id: new ObjectID( '5af761fb699bb7a2f41491a0' ) };
    var queryByCompleted = { completed: false };
    var queryByName = { name: 'Pat' };
    var queryAll = {};
    
    db.collection( 'Users' ).findOneAndUpdate( queryByName, 
                                               { $set: { name: 'Steve'  },
                                                 $inc: { age: 1         } }, 
                                               { returnOriginal: false } ).then( (result) => {
       console.log( JSON.stringify( result, undefined, 2 ) );
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