
function User () {
    var name;
    var email;
    var username;
    var provider;
    var facebook;
    var accessToken;
}

User.prototype.initializeUser = function(name, email, username, provider, facebook, accessToken) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.provider = provider;
    this.facebook = facebook;
    this.accessToken = accessToken;
};

module.exports = User;
