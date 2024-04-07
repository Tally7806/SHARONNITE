const { MongoClient } = require('mongodb') //allow connection to database

let dbConnection //initialize variables

module.exports = {       //exports in node application
    connectToDb: (cb) =>// function to connect to database //cb function to run after connection is establish 
    {
        MongoClient.connect('mongodb://localhost:27017/HMS')//connect method connecting to local database HMS 
          .then((client) => //function to show connection completed
          {
           dbConnection = client.db() //metthod db returns database connection
           return cb()      //call back function
        })
          .catch(err =>
            {
                console.log(err)
                return cb(err)  //passing the error into the callback function
            })
    }, 
    getDb: () => dbConnection     //function to return database connection


}
