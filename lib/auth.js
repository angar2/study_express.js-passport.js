module.exports = {
    isOwner: function(request, response) {
        if(request.session.is_login) {
            return true;
        } else {
            return false;
        }
    },
    Status: function(request, response) {
        var authStatus = `<a href="/auth/login">Login</a>`
        if(this.isOwner(request, response)) {
            authStatus = `${request.session.nickname} | <a href="/auth/logout">Logout</a>`;
        }
        return authStatus;
    }
}