export interface User {
    userId:string,
    firstname:string,
    lastname:string
    password:string,
    codeTwoFactorAuthentication?:string,
    secretCode?:string
}

export interface LoginUser {
    userId:string,
    password:string,
    secretcode?:string
}



