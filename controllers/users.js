const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');

}

module.exports.signup = async (req, res, next) => { 
    try {    
         let {username, email, password} = req.body;
        let newuser = new User({email, username});
        let registeredUser = await User.register(newuser, password);
    
        req.login(registeredUser, (err) => { 
            if (err) {
                return next(err); 
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect('/listings');
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }
        
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async (req, res, next) => {
    req.flash("success", "Welcome back to Wanderlust!"); 
    let redirectUrl = res.locals.redirectUrl || '/listings';
    req.session.save(() => {
        res.redirect(redirectUrl);
    });
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
            req.flash("success", "Logged Out");
            res.redirect('/listings');
    })
}