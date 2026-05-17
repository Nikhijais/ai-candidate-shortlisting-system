const mongoose = require('mongoose');
const uri = 'mongodb://nikhiljaiswal9798_db_user:Nikhil%23%232004@ac-jdvvycn-shard-00-00.wurv3zt.mongodb.net:27017,ac-jdvvycn-shard-00-01.wurv3zt.mongodb.net:27017,ac-jdvvycn-shard-00-02.wurv3zt.mongodb.net:27017/?ssl=true&replicaSet=atlas-jdvvycn-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => { console.log('Connected directly'); process.exit(0); })
  .catch(err => { console.log(err.message); process.exit(1); });
