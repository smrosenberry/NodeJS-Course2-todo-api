var env = process.env.NODE_ENV || 'development';

switch( env ) {
    case 'development':
        process.env.PORT = 3000;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
        break;
    case 'test':
        process.env.PORT = 3000;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
        break;
}

console.log( '****************************************************************' );
console.log( `env[${env}]` );
console.log( `process.env.PORT[${process.env.PORT}]` );
console.log( `process.env.MONGODB_URI[${process.env.MONGODB_URI}]` );
console.log( '****************************************************************' );
