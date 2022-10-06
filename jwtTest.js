const jwt = require('jsonwebtoken')

const jwtTest = () => {
    try {
        // create a jwt payload -- the data that is encoded
        const payload = {
            // user information
            // DO NOT put password in here (this is public info)
            name: 'valerie',
            id: '1234',
            email: 'v@a.com'
        }
        // 'sign' the jwt token by supplying a secret to hash in the signature
        const secret = 'my super big secret' //needs to be string
        // jwt.sign({payload to encode}, 'secret to create signature', {options (expiresIn)})
        const token = jwt.sign(payload, secret)
        console.log(token)
        // head (specifies encoding standard for the jwt): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
        //payload (encoded data):         eyJuYW1lIjoidmFsZXJpZSIsImlkIjoiMTIzNCIsImVtYWlsIjoidkBhLmNvbSIsImlhdCI6MTY2NTA4MjIzNn0.
        // signature (hash of the payload and secret):eiV06E8DV6imUctZvPPSdwGZwxsS_gNmAkvTWyyh-d0

        // signing a token will log a user in
        // jwt.verify(token, secret) --  throws an error if it can't verify (otherwise returns decoded data to us)
        const decode = jwt.verify(token, secret)
        console.log(decode)

        // when we decode jwts we will check the signature to make sure user's login is valid, this 'authorizes' the user


    }catch(err) {
        console.log(err)
        // for project, if err in jwt, have to log the user out
    }
}

jwtTest()