var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var userSchema = new Schema({
    "userId" : {
        "type" : String,
        "unique" : true
    },
    "password" : String,
    "email" : String,
    "age" : Number,
    "gender" : String,
    "loginHistory" :  [{ "dateTime" : Date, "userAgent" : String }]
});

let User;

module.exports.initialize = function(){
    return new Promise(function(resolve,reject){
        let db = mongoose.createConnection('mongodb+srv://admin:admin@pavilion-croch.mongodb.net/pavilion?retryWrites=true&w=majority');
        db.on('error', (err)=>{
            reject(err); 
            });
           
            db.once('open', ()=>{
                User = db.model("users", userSchema);
                resolve();
                });
    });
};

module.exports.registerUser = function(userData)
{
    return new Promise(function(resolve,reject){
        if(userData.password === userData.password2)
        {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(userData.password, salt, (err, hash) => {
                    if (err)
                        reject('There was an error encrypting the password');
                    else
                    {
                        userData.password = hash;
                        let newUser = new User(userData);

                        newUser.save().catch(
                            (err)=>{
                                if(err && err.code === 11000)
                                {
                                    reject("User Name already taken");
                                }
                                else if(err && err.code !== 11000)
                                {
                                    reject("There was an error creating the user: "+err);
                                }
                            }
                        );
                        resolve();
            
                    }
                    
                })
            })
        }
        else
        {
            reject("Passwords do not match");
        }
        
    });
};

module.exports.checkUser = function(userData){

    return new Promise(function(resolve,reject){

        User.find({userId: userData.userId})
        .exec()
        .then((users)=>{

                bcrypt.compare(userData.password, users[0].password).then((res) => {
                    if (res)
                    {
                            users[0].loginHistory.push( {dateTime: (new Date()).toString(), userAgent: userData.userAgent});

                            User.update({userId : users[0].userId},{$set:{loginHistory : users[0].loginHistory}})
                            .exec()
                            .then(()=>{
                                resolve(users[0]);
                            })
                            .catch((err)=>{
                                reject("There was an error verifying the user: "+ err);
                            });
                    }
                    else {
                         if (users.length === 0) 
                             reject('Unable to find user: ' + userData.userId);
                         if (users[0].password !== userData.password)
                             reject('Incorrect Password for user: ' + userData.userId);
                    }
                 })

        })
        .catch(()=>{
            reject("Unable to find user: " + userData.userId);
        });
    });

}
