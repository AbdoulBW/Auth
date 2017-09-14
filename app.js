var express           = require("express"),
mongoose              = require("mongoose"),
passport              = require("passport"),
bodyParser            = require("body-parser")
User                  =require("./models/user")
localStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose")

var app = express();

mongoose.connect("mongodb://localhost/auth_demo_app");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(require("express-session")({
    secret:"On ne baissera pas les bras",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// ROUTES

app.get('/', function (req,res) {
    res.render("home")
});

app.get('/secret', function (req,res) {
    res.render("secret")
});


//Auth routes
//show signup form
app.get('/register', function (req,res) {
    res.render('register')
});

//submit form
app.post('/register', function (req,res) {
    var uname = req.body.username;
    var pword = req.body.password;
    User.register(new User({username:req.body.username}),req.body.password, function (err,user) {
        if(err){
            console.log(err)
            res.render('register');
        }else{
            passport.authenticate("local")(req,res, function () {
                res.redirect("/secret");
            })
        }
    }
)
    
})


app.listen(3000, function () {
    console.log("App started")
});