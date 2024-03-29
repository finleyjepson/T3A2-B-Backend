class UserClass {
    constructor(user) {
        this._id = user._id
        this.username = user.username
        this.isOrganiser = user.isOrganiser
        this.picture = user.picture
        this.pictureUrl = user.pictureUrl
        this.description = user.description
        this.animes = user.animes
        this.characters = user.characters
        this.actors = user.actors
        this.isAdmin = user.isAdmin
        this.rsvp = user.rsvp
        this.date_created = user.date_created
    }
}

export default UserClass
