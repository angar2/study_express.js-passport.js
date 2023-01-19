module.exports = {
    isOwner: function(request, response) {
        if(request.user) {
            return true;
        } else {
            return false;
        }
    },
    Status: function(request, response) {
        var authStatus = `<a href="/auth/login">Login</a> | <a href="/auth/signup">Sign up</a>`
        if(this.isOwner(request, response)) {
            authStatus = `${request.user.displayName} | <a href="/auth/logout">Logout</a>`;
        }
        return authStatus;
    }
}