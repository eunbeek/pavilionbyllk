
    //db connection data
    const Sequelize = require('sequelize');
    var sequelize = new Sequelize('dfct2eqt684v3r', 'qpmohzpuhehqgq', '8637bc7922ce139b13139c36020769b1ce95b78dbb08b28dc66b41eed894f140',{
        host:'ec2-54-243-197-120.compute-1.amazonaws.com',
        dialect:'postgres',
        port:'5432',
        dialectOptions: {
            ssl:true
        }
    });
    //handle authenticate 
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((err) => {
        console.log('Unable to connect to the database:', err);
    });

    //Employee DB table form defined
    var Activity = sequelize.define('Activity', {
        act_id : {
                         type: Sequelize.INTEGER,
                         primaryKey: true,
                         autoIncrement : true
                      },
        userName : Sequelize.STRING,
        act_title : Sequelize.STRING,
        maxNum : Sequelize.INTEGER,
        email : Sequelize.STRING,
        addressStreet : Sequelize.STRING,
        postalCode: Sequelize.STRING,
        activityContent: Sequelize.STRING,
        activityStatus : Sequelize.STRING,
        activityDate : Sequelize.STRING
    });
   
    
    module.exports.initialize = function(){
        return new Promise(function(resolve, reject){
            sequelize.sync()
                     .then((Activity)=>{resolve();})
                     .catch((err)=>{reject("unable to sync the database");});
        });
    };

    module.exports.getAllActivities = function(){
        return new Promise(function(resolve, reject){
                   sequelize.sync()
                            .then(()=>{
                                resolve(Activity.findAll());
                            })
                            .catch((err)=>{
                                reject("no results returned");
                            });
               });
           }
  
