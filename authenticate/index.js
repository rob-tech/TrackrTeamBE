const passport = require("passport")
const User = require("../models/User")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const jwt = require("jsonwebtoken") 

const options = {
    secretOrKey: "123456789987654321",
    username: "email",
    password: "password",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
//passport.use(new LocalStrategy(User.authenticate()))
passport.use(User.createStrategy())

passport.use(new JwtStrategy(options, (jwt_payload, done)=>{ //reading the token
    User.findById(jwt_payload._id, (err, user) =>{
        if (err) return done(err, false) //error => unauthorized + error
        else if (user) return done(null, user) //ok => pass it over
        else return done(null, false) //user not found!
    })
}))

module.exports = {    

    createToken: (user) => jwt.sign(user, options.secretOrKey,  { expiresIn: 10800}), //creating the token,
    adminOnly:async(req, res, next) =>{
        if (req.user.role === "Admin" )  next()          
        else {
            res.status = 401;
            res.send("this method works for admin only")
        }
    },
    managerOnly:async(req,res,next)=>{
        if (req.user.role === "Manager" )  next()          
        else {
            res.status = 401;
            res.send("this method works for manager only")
        }
    },
    studentOnly:async(req,res,next)=>{
        if (req.user.role === "Student" )  next()          
        else {
            res.status = 401;
            res.send("this method works for student only")
        }
    },
    token: passport.authenticate("jwt", { session: false })
 
}




