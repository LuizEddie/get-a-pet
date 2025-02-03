const mongoose = require('mongoose');

async function main(){
    await mongoose.connect('mongodb://host.docker.internal:27017/getapet');
    console.log('Conectou ao mongoose');
}

main().catch(e => console.log(e));

module.exports = mongoose;