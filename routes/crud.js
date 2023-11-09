const express = require('express');
const {admincollection, datacollection} = require('./mongoDB');

const crud = express.Router();

// Admin side crud operations
crud.get('/adduser', (req, res)=>{
    res.render('createuser');
})
crud.post('/adduser', async (req, res)=>{
    const {user, email, password, broid, batch} = req.body;
    try{
        const duplicatecheck = await datacollection.findOne({useremail : email})
        if(duplicatecheck){
            res.redirect('/adminhome');
        }
        else{
            const userAddData = {
                username : user,
                useremail : email,
                userpassword : password,
                userbroid : broid,
                userbatch : batch
            }
            await datacollection.insertMany([userAddData]);
            // reloading user data
            const loadAllUserData = await datacollection.find();
            res.render('admindashboard', {name:'Administrator', loadAllUserData});
        }
    }
    catch{
        const userAddData = {
            username : user,
            useremail : email,
            userpassword : password,
            userbroid : broid,
            userbatch : batch
        }
        await datacollection.insertMany([userAddData]);
        // reloading user data
        const loadAllUserData = await datacollection.find();
        res.render('admindashboard', {name:'Administrator', loadAllUserData});
    }
})
// receiving object id by req.params - dynamic route
// delete user
crud.get('/deleteuser/:id', async (req, res)=>{
    await datacollection.findByIdAndDelete(req.params.id);
    res.redirect('/adminhome');
})
// update user - page for admin
crud.get('/updateuser/:id', async (req, res)=>{
    const loadPerUserData = await datacollection.findOne({_id:req.params.id});
    res.render('updateuser', {loadPerUserData});
})
// update user and redirect
crud.post('/updateuser/:id', async (req, res)=>{
    const {user, email, broid, batch} = req.body;
    const userUpdateData = {
        username : user,
        useremail : email,
        userbroid : broid,
        userbatch : batch
    }
    await datacollection.findByIdAndUpdate(req.params.id, userUpdateData);
    res.redirect('/adminhome');
})

// AJAX codes to perform search queries
crud.get('/search', async (req, res) => {
    const searchQuery = req.query.search;
    const regexPattern = new RegExp(`^${searchQuery}`, 'i');
    const filteredUser = await datacollection.find({username : {$regex: regexPattern}});
    res.json(filteredUser);
})

module.exports = crud;