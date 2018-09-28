const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const mongoHost = process.env.MONGO_HOST || 'mongodb';
const mongoPort = process.env.MONGO_PORT || '27017';

// Connection url
const url = `mongodb://${mongoHost}:${mongoPort}`;

let client = null;
async function connect(){
  try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url,
      {
        useNewUrlParser: true,
        // retry to connect for 60 times
        reconnectTries: 60,
        // wait 1 second before retrying
        reconnectInterval: 1000
      });

      return client;

  } catch (err) {
    console.log(err.stack);
    return client;
  }
}

function mongoClient(){
  return client;
}

connect();

module.exports = { connect, client: mongoClient};

