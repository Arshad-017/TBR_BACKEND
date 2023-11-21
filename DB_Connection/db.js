const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/K0077DBATBR').then(()=> console.log('Connection of DB is successfull!!!'))


//  Schema
const TbrEmployee = new mongoose.Schema(
    {
        emp_id:{
            type : String ,
        },
        first_name: {
            type : String ,
        },
        last_name: {
            type : String ,
        },
        email: {
            type : String ,
        },
        phone: {
            type : String ,
        },
        gender: {
            type : String ,
        },
        age: {
            type : Number ,
        },
        job_title: {
            type : String ,
        },
        years_of_experience: {
            type : Number ,
        },
        salary: {
            type : Number ,
        },
        department: {
            type : String ,
        },
        DEL_IND:{
            type : String ,
        },
        Comments: {
            type : String ,
        },
    },
    {
        timestamps : {
            createdAt : true ,
            updatedAt : true,
        },
    }
)



const userLoginDeatils= new mongoose.Schema(
    {
        fullName:    { type : String , },
        userName:    { type : String , },
        emailId:     { type : String , },
        phoneNumber: { type : String , },
        password:    { type : String , },
        gender:      { type : String , },
    },
    {
        timestamps : {
            createdAt : true ,
            updatedAt : true,
        },
    }
)



const contactUs = new mongoose.Schema(
    {
        fullname: { type : String , },
        message : { type : String , },
        email : { type : String , },
    },
    {
        timestamps : {
            createdAt : true ,
            updatedAt : true,
        },
    }
)



const notifyThem =new mongoose.Schema(
    {
        fullname: { type : String , },
        message : { type : String , },
        email:  { type : String , },
        subject : { type : String , },
    },
    {
        timestamps : {
            createdAt : true ,
            updatedAt : true,
        },
    }
)


const TbrEmployeeModel = mongoose.model('tbremployee' , TbrEmployee)

const userLoginDeatilsModel = mongoose.model('userlogindeatils' , userLoginDeatils)

const contactUsModel = mongoose.model('contactus' , contactUs)

const notifyThemModel = mongoose.model('notifythems' , notifyThem)



module.exports = {
    TbrEmployeeModel, userLoginDeatilsModel,contactUsModel,notifyThemModel
}
