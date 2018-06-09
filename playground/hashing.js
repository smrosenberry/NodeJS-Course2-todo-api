const {SHA256} = require( "crypto-js"    );
const jwt      = require( "jsonwebtoken" );
const bcrypt   = require( "bcryptjs"     );

var password = 'abc123!';
var hashValue;

bcrypt.genSalt( 10, (err, jwtSecret) => {
    console.log(`jwtSecret[${jwtSecret}]`);
    bcrypt.hash( password, jwtSecret, (err, hash) => {
        console.log(`hash[${hash}]`);
        //hashValue = hash;
    })
} );

bcrypt.compare( password, '$2a$10$cRvHuh/cgiX7pNjYhMAdK.LMEP7vUDigHgmzBua4o6EUJSH79L066', (err, res) => {
    console.log( res );
})

//var data = {
//  id: 10
//};
//
//var token = jwt.sign( data, '123abc' );
//console.log(`token[${token}]`);
//var decoded = jwt.verify( token, '123abc' );
//console.log(`decoded[${ JSON.stringify( decoded, undefined, 2 ) }]`);

//var msg = 'I am user number 3';
//
//var hash = SHA256(msg).toString();
//
//console.log(`msg[${msg}]`);
//console.log(`hash[${hash}]`);


//var data = {
//  id: 4
//};
//
//var token = {
//    data: data,
//    hash: getSHA256( data )
//}
//
//var resultHash = getSHA256( token.data );
//
//if( resultHash === token.hash )
//{
//    console.log( 'data is valid' );
//}
//else
//{
//    console.log( 'data has been corrupted' );
//}
//
//function getSHA256( data )
//{
//    return( SHA256( JSON.stringify( data ) + 'somesecret' ).toString() );
//}