const express = require('express');
const {admincollection, datacollection} = require('./mongoDB');

const auth = express.Router();

// mongodb works in async-await
// user signup
auth.post('/signup', async (req, res)=>{
    const {user, email, password} = req.body;
    try{
        // const duplicatecheck = await usercollection.findOne({useremail : email})
        const duplicatecheck = await datacollection.findOne({useremail : email})
        if(duplicatecheck){
            req.session.duplicateuser = true;
            res.redirect('/login');
        }
        else{
            const usersignupdata = {
                username : user,
                useremail : email,
                userpassword : password
            }
            // await usercollection.insertMany([usersignupdata]);
            await datacollection.insertMany([usersignupdata]);
            req.session.signed = true;
            res.redirect('/login');
        }
    }
    catch{
        const usersignupdata = {
            username : user,
            useremail : email,
            userpassword : password
        }
        // await usercollection.insertMany([usersignupdata]);
        await datacollection.insertMany([usersignupdata]);
        req.session.signed = true;
        res.redirect('/login');
    }
})

// user login
auth.post('/userhome', async (req, res)=>{
    const {email, password} = req.body;
    try{
        // const authcheck = await usercollection.findOne({useremail : email});
        const authcheck = await datacollection.findOne({useremail : email});
        if(email===authcheck.useremail && password===authcheck.userpassword){
            req.session.isUserLoggedIn = true;
            req.session.useremail = authcheck.useremail;
            console.log(req.session);
            const loadPerUserData = await datacollection.findOne({useremail : authcheck.useremail})
            // passing user data for GET/userhome
            req.session.GETuserdata = loadPerUserData;
            res.render('userdashboard', {loadPerUserData});
        }
        else{
            console.log('Auth Failed');
            console.log(req.body);
            req.session.unauth = true;
            res.redirect('/login');
        }
    }
    catch{
        console.log('Auth Failed');
        console.log(req.body);
        req.session.unauth = true;
        res.redirect('/login');
    }
})

// admin login
auth.post('/adminhome', async (req, res)=>{
    const {email, password} = req.body;
    try{
        const authcheck = await admincollection.findOne({adminemail : email});
        if(email===authcheck.adminemail && password===authcheck.adminpassword){
            req.session.isAdminLoggedIn = true;
            req.session.adminemail = authcheck.adminemail;
            console.log(req.session);
            const loadAllUserData = await datacollection.find();
            res.render('admindashboard', {name:'Administrator', loadAllUserData});
        }
        else{
            console.log('Auth Failed');
            console.log(req.body);
            req.session.unauth = true;
            res.redirect('/login');
        }
    }
    catch{
        console.log('Auth Failed');
        console.log(req.body);
        req.session.unauth = true;
        res.redirect('/login');
    }
})

module.exports = auth;