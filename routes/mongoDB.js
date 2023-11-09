const mongoose = require('mongoose');

// MongoDb-Node Connection
mongoose.connect("mongodb://127.0.0.1:27017/brocamp")
.then(()=>{
    console.log('MongoDB Connected');
})
.catch((err)=>{
    console.log('MongoDB Failed to Connect');
    console.error(err.stack);
});

// doc-schemas
const UserDataSchema = new mongoose.Schema({
    username : {
        type : String,
        requied : true
    },
    useremail : {
        type : String,
        required : true
    },
    userpassword : {
        type : String,
        required : true
    },
    userbroid : {
        type : String,
        requied : true
    },
    userbatch : {
        type : String,
        requied : true
    }
});

const AdminLoginSchema = new mongoose.Schema({
    adminemail : {
        type : String,
        required : true
    },
    adminpassword : {
        type : String,
        require : true
    }
});

// collection-schema
const admincollection = new mongoose.model('adminlogin', AdminLoginSchema);
const datacollection = new mongoose .model('userdata', UserDataSchema);

module.exports = {admincollection, datacollection};