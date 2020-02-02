
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
        act_title : Sequelize.STRING,
        maxNum : Sequelize.INTEGER,
        act_category: Sequelize.STRING,
        activityContent: Sequelize.STRING,
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
    
    module.exports.addActivity = function(activityData){
        return new Promise(function(resolve, reject){ 
            sequelize.sync()
                     .then(()=>{
                         for( let i in activityData)
                         {
                             if(activityData[i] == "")
                             {
                                activityData[i] = null;
                             }
                         }
                         resolve(Activity.create({
                            act_id : activityData.act_id,
                            userName : activityData.userName,
                            act_title : activityData.act_title,
                            maxNum : activityData.maxNum,
                            email : activityData.email,
                            gender: activityData.gender,
                            age: activityData.age,
                            act_category: activityData.act_category,
                            addressStreet : activityData.addressStreet,
                            postalCode: activityData.postalCode,
                            activityContent: activityData.activityContent,
                            activityStatus : activityData.activityStatus,
                            activityDate : activityData.activityDate
                         })
                        .catch((err)=>{
                            reject("unable to create employee");
                        }));
                     })
                     .catch((err)=>{
                        reject("unable to create employee");
                    });
        });

    }