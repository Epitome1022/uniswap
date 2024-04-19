const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://defibizzylos:aaf0NKQ5yZKy9Z8Z@cluster0.p9e2zcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let db;

connectToDatabase = async ()=> {
    try {
        await client.connect();
        db = client.db("uniswap");
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    }
}

getDb = ()=> {
    return db;
}

module.exports = { getDb, connectToDatabase };