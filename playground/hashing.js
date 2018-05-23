const {SHA256} = require( "crypto-js" );
const jwt      = require( "jsonwebtoken" );


var data = {
  id: 10
};

var token = jwt.sign( data, '123abc' );
console.log(`token[${token}]`);
var decoded = jwt.verify( token, '123abc' );
console.log(`decoded[${ JSON.stringify( decoded, undefined, 2 ) }]`);

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