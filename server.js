"use strict";

// Secret (used to store session data on user's browser):
const secret = "REfg#45$5$%6$t6sd6U%&u$5";

// Libraries:
const express = require("express");
const app = express();

const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const PasportLocal = require("passport-local").Strategy;

const auth = require("./auth.js");
const userValidator = require("./user-validator.js");
const dbManager = require("./dbmanager.js");
const collections = require("./collections.js");

// Express middleware to read request body:
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Cookie parser:
app.use(cookieParser(secret));

// EJS view engine:
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Public folder for images and HTML, CSS, JS files:
app.use(express.static("public"));

// Session settings:
app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true
}));

// Passport:
app.use(passport.initialize());
app.use(passport.session());

// Passport login strategy:
const getUserData = async username => {
    return await dbManager.findRow(__dirname + "/users/users.db", "userdata", "id", username);
}

passport.use(new PasportLocal(async (username, password, done) => {
    if (await auth.authenticate(username, password))
        return done(null, await getUserData(username)); // User found.
    done(null, false); // User not found.
}));

// Serialization (use of a single data to identify the user):
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialization (from a single user data, all the others are obtained):
passport.deserializeUser(async (id, done) => {
    done(null, await dbManager.findRow(__dirname + "/users/users.db", "userdata", "id", id));
});

// Function used as a middleware on every request handling function that need confirm is user is loged in before:
const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect("/signin?code=1");
}

// x-----------------------------------x REQUEST HANDLING x-----------------------------------x //

// Home:
app.get("/", (req, res) => {
    res.render("index.ejs", req.user);
});

// Example of a page that can only be accessed by logged in users:
app.get("/onlyloggedin", checkAuthentication, (req, res) => {
    res.render("onlyloggedin.ejs", req.user);
    console.log(req.user);
});

// Account settings:
app.get("/account", checkAuthentication, (req, res) => {
    res.render("account.ejs", req.user);
});

// x-----------------x LOGIN, REGISTER AND FORGOT PASSWORD REQUEST HANDLING x-----------------x //

// SIGN IN ERROR CODES:
// 0) Wrong username or password
// 1) You must be logged in to access this site

app.get("/signin", (req, res) => {
    if (req.isAuthenticated())
        res.redirect("/");
    else
        res.render("signin.ejs");
});

app.post("/signin", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin?code=0",
}));

// SIGN UP ERROR CODES:
// 0) Reserved for "success" status
// 1) Username must be between 3 and 16 characters long
// 2) Username can only contain letters, numbers and characters _ - .
// 3) The username is already taken
// 4) Password must be between 6 and 32 characters long
// 5) Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system
// 6) Invalid e-mail format
// 7) For security reasons, only emails ${allowedMailServices.join(", ")} are allowed
// ...) The email address is already taken (no error code to avoid "user enumeration" attack)

app.get("/signup", (req, res) => {
    if (req.isAuthenticated())
        req.logOut();
    res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
    try {
        if (req.isAuthenticated())
            req.logOut();
        
        let validatedData = new Object();
        
        let username = req.body.username;
        validatedData.username = await userValidator.validateUsernameLength(username, 1);
        validatedData.username = await userValidator.validateUsernameContent(username, 2);
        validatedData.username = await userValidator.validateUsernameAvailability(username, 3);
        
        let password = req.body.password;
        validatedData.password = await userValidator.validatePasswordLength(password, 4);
        validatedData.password = await userValidator.validatePasswordContent(password, 5);
        
        let email = req.body.email;
        validatedData.email = await userValidator.validateEmailFormat(email, 6);
        validatedData.email = await userValidator.validateEmailService(email, 7);
        validatedData.email = await userValidator.validateEmailAvailability(email, 0); // Code is 0 for "success" status instead of an error code, to avoid "user enumeration" attack.
        
        let confirmationCode = await auth.registerUser(validatedData);
        console.log(`TODO: Send e-mail with confirmation code http://127.0.0.1:3000/signup/confirm/${confirmationCode}`); // TODO
        
        return res.redirect(`/signup?code=0`);
    } catch (error) {
        if (typeof error == "number" && !isNaN(error))
            return res.redirect(`/signup?code=${error}`);
        return res.status(500).send("Unexpected error.");
    }
});

app.get("/signup/confirm/:confirmationid", async (req, res) => {
    try {
        if (req.isAuthenticated())
            req.logOut();
        
        await auth.confirmUser(req.params.confirmationid);
        return res.render("confirmation.ejs", {success: true});
    } catch (error) {
        return res.render("confirmation.ejs", {success: false});
    }
});

app.get("/forgotpassword", (req, res) => {
    if (req.isAuthenticated())
        req.logOut();
    
    res.render("forgotpassword.ejs");
});

app.post("/forgotpassword", (req, res) => {
    auth.sendResetPasswordEmail(req.body.email);
    res.redirect("/forgotpassword?code=0");
});

app.get("/resetpassword/:id", (req, res) => {
    res.render("resetpassword.ejs", {id: req.params.id});
});

// RESET PASSWORD ERROR CODES:
// 0) Password must be between 6 and 32 characters long
// 1) Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system
// 2) The provided reset password id does not exist

app.post("/resetpassword", async (req, res) => {
    try {
        let resetPasswordId;
        resetPasswordId = await userValidator.validateResetPasswordId(req.body.resetPasswordId, 2);
        
        let password;
        password = await userValidator.validatePasswordLength(req.body.password, 0);
        password = await userValidator.validatePasswordContent(req.body.password, 1);
        
        await auth.resetPassword(resetPasswordId, password);
        
        res.redirect("/signin?code=2");
    } catch (error) {
        if (typeof error == "number" && !isNaN(error))
            return res.redirect(`/resetpassword/${req.body.resetPasswordId}?code=${error}`);
        return res.status(500).send("Unexpected error.");
    }
});

// ACCOUNT CONFIGURATION ERROR CODES:
// 0) CHANGE PASSWORD: Reserved for "success" status
// 1) CHANGE PASSWORD: The current password is incorrect
// 2) CHANGE PASSWORD: Password must be between 6 and 32 characters long
// 3) CHANGE PASSWORD: Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system
// 4) DELETE ACCOUNT: Wrong password

app.post("/changepassword", checkAuthentication, async (req, res) => {
    try {
        if (!await auth.authenticate(req.user.username, req.body.currentpassword))
            throw 1;
        
        let newPassword;
        newPassword = await userValidator.validatePasswordLength(req.body.newpassword, 2);
        newPassword = await userValidator.validatePasswordContent(req.body.newpassword, 3);
        
        await auth.changePassword(req.user.id, newPassword);
        
        return res.redirect("/account?code=0");
    } catch (error) {
        if (typeof error == "number" && !isNaN(error))
            return res.redirect(`/account?code=${error}`);
        return res.status(500).send("Unexpected error.");
    }
});

app.post("/deleteaccount", checkAuthentication, async (req, res) => {
    try {
        if (!await auth.authenticate(req.user.username, req.body.password))
            throw 4;
        
        await auth.deleteAccount(req.user.id);
        
        req.logOut();
        res.redirect("/");
    } catch (error) {
        if (typeof error == "number" && !isNaN(error))
            return res.redirect(`/account?code=${error}`);
        return res.status(500).send("Unexpected error.");
    }
});

app.get("/signout", checkAuthentication, (req, res) => {
    req.logOut();
    res.redirect("/");
});

// Port listening:

app.listen(3000, () => {
    console.log("Listening on port 3000!");
});