require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI
const SECRET = process.env.SECRET
const PASSWORD = process.env.PASSWORD

module.exports={ MONGO_URI ,PASSWORD,SECRET }