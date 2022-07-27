const express = require("express")
const db = require("../env/Database")
const router = express.Router()
const { validate } =  require("../functions/Validation")

// API call for getting all listings in db
router.get("/all", (req, res) => {
    const statement = "SELECT * FROM listings"
    const result = db.query(statement, (err, result) => {
        if (err)
            console.log(err)
        else res.send(result)
    })
})

// API call to get a single listing in db
router.get("/:listingID", (req, res) => {
    const id = req.params.listingID
    const statement = "SELECT * FROM listings WHERE listingid = ?"
    const result = db.query(statement, [id], (err, result) => {
        if (err)
            console.log(err)
        else res.send(result)
    })
})

module.exports = router