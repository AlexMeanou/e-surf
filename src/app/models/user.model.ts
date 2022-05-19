export class User {
    username : string
    token : string
    spot : string

    constructor(
        username : string,
        token : string,
        spot : string
    ) {
        this.username = username;
        this.token = token;
        this.spot = spot;
    }
}