# Steps to Achieve 👍

## Talk about stuff

* talk about jwt
  * is not encryption
  * maybe have diagrams
* talk about auth flow
  * talk about using json req and res
  * talk about different approaches
    * db/restful
    * using local storage
  * talk about auth locked routes/route specific middleware
  * talk about jwts expiring 
  * 
* show routes and db models
  * talk about api versioning routes
* talk about familar packages 
* talk about new packages
  * cors
    * https://www.npmjs.com/package/cors
    * https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    
## Make Express App

* mkdir MERN-auth - cd into it
* mkdir server client - cd into server
* create express app and test db stub routes and install packages
  * touch `server.js` and then `npm init -y`
  * create `.gitignore`
  * touch .env
  * needed packages for this step
    *  dotenv express rowdy-logger mongoose morgan mongoose dotenv cors
  * make basic express app

```js
// require packages
require('dotenv').config()
require('./models')
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const morgan = require('morgan')

// config express app
const app = express()
const PORT = process.env.PORT || 3001 
// for debug logging 
const rowdyResults = rowdy.begin(app)
app.use(morgan('tiny'))
// cross origin resource sharing 
app.use(cors())
// request body parsing
app.use(express.urlencoded({ extended: false })) // optional 
app.use(express.json())

// GET / -- test index route
app.get('/', (req, res) => {
  res.json({ msg: 'hello backend 🤖' })
})

// hey listen
app.listen(PORT, () => {
  rowdyResults.print()
  console.log(`is that port ${PORT} I hear? 🙉`)
})

```
* test route with postman

## Make Db

* configure db connection
  * mkdir models
  * touch ./models/index.js
  * populate index.js

```js
//  in models/index,js
// require mongoose package
const mongoose = require("mongoose")

const connect = () => {
  // mongoose config
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mernAuth'

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = mongoose.connection;

  // Connection methods
  db.once('open', () => {
    console.log(`🔗 Connected to MongoDB at ${db.host}:${db.port}`);
  });

  db.on('error',  err => {
    console.error(`🔥 Datacenter burned down:\n${err}`);
  });
}

module.exports = {
  connect,
}
```
* populate .env file

```bash
MONGODB_URI=mongodb://localhost/mernAuth
```

or 

```bash
PORT=3001
MONGODB_URI=mongodb+srv:// < user name >:< user password >@< cluster name >/< database name >?retryWrites=true&w=majority
```

```js
// in server.js
const db = require('./models')
db.connect()
```

* check the connection by starting `nodemon`
* make a user model
  * touch User.js
  * populate User.js
```js
// require mongoose ODM
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = UserSchema
```

```js
// in ./models/index.js
module.exports = {
  connect,
  User: mongoose.model('user', require('./User.js'))
}
```
* test database
  * touch dbTest.js 
  * populate dbTest.js
  * do tests one by one
  * possibly clear out db

```js
require('dotenv').config()
const db = require('./models')
db.connect()

const userTest = async () => {
  try {
    // CREATE
    const newUser = new db.User({
      name: 'bing',
      email: 'bing@bang.com',
      password: 'bingbang'
    })
  
    await newUser.save()
    console.log('newUser', newUser)

    // READ
    const foundUser =  await db.User.findOne({
      name: newUser.name
    })

    console.log('foundUser', foundUser)

    // UPDATE
    foundUser.name = 'bangBang'

    await foundUser.save()

    const findUserAgain = await db.User.findOne({
      name: 'bangBang'
    })

    console.log('findUserAgain', findUserAgain)

    // DESTROY
    const deleteUser = await db.User.deleteOne({
      name: 'bangBang'
    })

    console.log('deleteUser', deleteUser)

    // we done
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit()
  }
}

userTest()
```

## Testing new packages
* talk about new packages
* bcryptjs
  * npm i bcryptjs 
  * https://www.npmjs.com/package/bcryptjs
  * touch cryptoTest.js
  * populate cryptoTest.js
```js
const bcrypt = require('bcryptjs')

const testCrypto = async () => {
  try {
    // test hashing
    const password = 'hello'
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    console.log('hashed password', hashedPassword)
  
    // match the hashed password to a string
    const matchPasswords = await bcrypt.compare('hello', hashedPassword)
    console.log('matchedPasswords', matchPasswords)
  } catch (error) {
    console.log(error)
  }
}

testCrypto()
```
* jsonwebtoken
  * npm i jsonwebtoken
  * https://www.npmjs.com/package/jsonwebtoken
  * touch jwtTest.js
  * use that awesome site
    * https://jwt.io/
```js
const jwt = require('jsonwebtoken')

const jwtTest = () => {
  // still gonna try catch
  try {
    // create jwt payload
    const payload = {
      name: 'user name',
      id: 'im a user id!'
    }
  
    // sign a jwt token
    const token = jwt.sign(payload, 'My super big secret', { expiresIn: 60 * 60 })
    console.log(token)
    
    // decode jwt token
    const decode = jwt.verify(token, 'My super big secret')
    console.log(decode)
    
  } catch(error) {
    console.log(error)
  } 
}

jwtTest()
```

## Making auth routes

* stub controller
  * mkdir controllers
  * mkdir ./controllers/api-v1
  * touch ./controllers/api-v1/users.js
  * stub controller

```js
// controllers/api-v1/users.js

const router = require('express').Router()

console.log('hello from the users controller')

module.exports = router
```

```js
// in server.js

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))
```

* stub routes

```js
// controllers/api-v1/users.js

// GET /users - test endpoint
router.get('/', (req, res) => {
  res.json({ msg: 'welcome to the users endpoint' })
})

// POST /users/register - CREATE new user
router.post('/register', (req, res) => {
  res.json({ msg: 'register a user' })
})

// POST /users/login -- validate login credentials
router.post('/login', (req, res) => {
  res.json({ msg: 'log a user in' })
})


// GET /auth-locked - will redirect if bad jwt token is found
router.get('/auth-locked', (req, res) => {
  res.json( { msg: 'welcome to the private route!' })
})

```

* make registration route
  * populate .env

```bash
JWT_SECRET="mysecretmessage"
```

* comment pseudocode

```js
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// POST /users/register - CREATE new user
router.post('/register', async (req, res) => {
  try {
    // check if user exists already

    // don't allow emails to register twice

    // hash password
  
    // create new user

    // create jwt payload

    // sign jwt and send back

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'server error' })
  }
})
```

*  populate route

```js
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// POST /users/register - CREATE new user
router.post('/register', async (req, res) => {
  try {
    // check if user exists already
    const findUser = await db.User.findOne({
      email: req.body.email
    })

    // don't allow emails to register twice
    if(findUser) return res.status(400).json({ msg: 'email exists already' })
  
    // hash password
    const password = req.body.password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
  
    // create new user
    const newUser = new db.User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
  
    await newUser.save()

    // create jwt payload
    const payload = {
      name: newUser.name,
      email: newUser.email, 
      id: newUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

    res.json({ token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'server error'  })
  }
})
```

### You do make login

* make comments

```js
// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
  // try to find user in the db
  
  // if the user is not found in the db, return and sent a status of 400 with a message
  
  // check the password from the req body against the password in the database
  
  // if provided password does not match, return an send a status of 400 with a message

  // create jwt payload

  // sign a jwt and send back

  // handle errors with a response of 500 and a log
})
```

* solution

```js
// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
  try {
    // try to find user in the db
    const foundUser = await db.User.findOne({
      email: req.body.email
    })

    const noLoginMessage = 'Incorrect username or password'

    // if the user is not found in the db, return and sent a status of 400 with a message
    if(!foundUser) return res.status(400).json({ msg: noLoginMessage, body: req.body})
    
    // check the password from the req body against the password in the database
    const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)
    
    // if provided password does not match, return an send a status of 400 with a message
    if(!matchPasswords) return res.status(400).json({ msg: noLoginMessage, body: req.body})

    // create jwt payload
    const payload = {
      name: foundUser.name,
      email: foundUser.email, 
      id: foundUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

    res.json({ token })
  } catch(error) {
    console.log(error)
    res.status(500).json({ msg: 'server error'  })
  }
})
```

### Auth locked route

* do middleware demo

```js
// app.use((req, res, next) => {
//   console.log('im a middleware 😬!')
// res.locals.myData = '👾'
//   next()
// })

const middleWare = (req, res, next) => {
  console.log('im a middleware 😬!')
  res.locals.myData = '👾'
  next()
}
```

* touch ./controllers/api-v1/authLockedRoute.js
* populate with comments

```js
const jwt = require('jsonwebtoken')
const db = require('../../models')

// route specific middleware for jwt authorization
const authLockedRoute = async (req, res, next) => {
  try {
    // jwt from client
    const authHeader = req.headers.authorization
    // will throw to catch if jwt can't be verified
    const decode = await jwt.verify(authHeader, process.env.JWT_SECRET)
    // find user from db
    const foundUser = await db.User.findById(decode.id)
    // mount user on locals
    res.locals.user = foundUser
    next()

  } catch(error) {
    console.log(error)
    // respond with status 401 if auth fails
    res.status(401).json({ msg: 'auth failed' })
  }
} 

module.exports = authLockedRoute
```