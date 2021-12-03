const User = require('../models/user');

module.exports.renderSignUp = (req, res) => {
    res.render('users/register');
}

module.exports.signUp = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            const returnUrl = req.session.returnTo || '/';
            delete req.session.returnTo;
            req.flash('success', 'Welcome to ParkGuide!');
            res.redirect(returnUrl);
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register', { page: 0 });
    }
}

module.exports.renderSignIn = (req, res) => {
    res.render('users/login', { page: 0 });
}

module.exports.signIn = (req, res) => {
    const returnUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    req.flash('success', 'Hey there, Good to see you again!');
    res.redirect(returnUrl);
}

module.exports.signOut = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out!');
    res.redirect('/parks');
}