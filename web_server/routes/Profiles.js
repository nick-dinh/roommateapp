const express = require("express")
const db = require("../env/Database")
const router = express.Router()
const { validate } =  require("../functions/Validation")



module.exports = router