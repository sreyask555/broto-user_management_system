const express = require('express');
const session = require('express-session');
const nocache = require('nocache');
const {v4:uuidv4} = require('uuid');
const morgan = require('morgan');
const {admincollection, datacollection} = require('./routes/mongoDB');
const auth = require('./routes/auth');
const crud = require('./routes/crud');


const app = express();

app.set('view engine', 'ejs');

// Application  Middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(nocache());
app.use(session({
    secret : uuidv4(),
    resave : false,
    saveUninitialized : true
}))
app.use(morgan('tiny'));

// Custom middlewares for router instances
app.use(auth);
app.use(crud);

// Routes
app.get('/', (req, res)=>{
    res.redirect('/login');
})
// main login page
app.get('/login', (req, res)=>{
    // check existing user
    if(req.session.duplicateuser){
        res.render('login', {duplicate : true});
        req.session.destroy();
        return; 
    }
    // if new registration
    else if(req.session.signed){
        res.render('login', {signed : true});
        req.session.destroy();
        return;
    }
    // check user - login session active
    else if(req.session.isUserLoggedIn){
        res.redirect('/userhome');
        console.log(req.session);
        return;
    }
    // check admin - login session active
    else if(req.session.isAdminLoggedIn){
        res.redirect('/adminhome');
        console.log(req.session);
        return;
    }
    // if wrong credentials for user or admin
    else if(req.session.unauth){
        res.render('login', {unauth : true});
        req.session.destroy();
        return;
    }
    res.render('login', {title : 'Brocamp Login'})
})
// user home page
app.get('/userhome', (req, res)=>{
    if(req.session.isUserLoggedIn){
        res.render('userdashboard', {loadPerUserData : req.session.GETuserdata})
        return;
    }
    res.redirect('/login');
})
// admin home page (direct render from DB)
app.get('/adminhome', async (req, res)=>{
    if(req.session.isAdminLoggedIn){
        const loadAllUserData = await datacollection.find()
        res.render('admindashboard', {name : 'Administrator', loadAllUserData});
        return;
    }
    res.redirect('/login');
})
// user signup page
app.get('/signup', (req, res)=>{
    // check user - login session active
    if(req.session.isUserLoggedIn){
        res.redirect('/userhome');
        console.log(req.session);
        return;
    }
    // check admin - login session active
    else if(req.session.isAdminLoggedIn){
        res.redirect('/adminhome');
        console.log(req.session);
        return;
    }
    res.render('signup');
})
// admin login page
app.get('/adminlogin', (req, res)=>{
    // check user - login session active
    if(req.session.isUserLoggedIn){
        res.redirect('/userhome');
        console.log(req.session);
        return;
    }
    // check admin - login session active
    else if(req.session.isAdminLoggedIn){
        res.redirect('/adminhome');
        console.log(req.session);
        return;
    }
    res.render('admin');
})
// logout issuer user/admin
app.get('/logout', (req, res)=>{
    // session-destroy
    req.session.destroy();
    console.log(req.session);
    res.redirect('/login');
})
// Any other routes called
app.get('*', (req, res)=>{
    res.status(404).render('error');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
})