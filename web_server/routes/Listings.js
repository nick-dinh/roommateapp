const express = require("express")
const db = require("../env/Database")
const router = expres.Router()
const validation = require("../functions/Validation")

// API call for getting all listings in db
router.get("/all", async(req, res) => {
    try {
        const statement = "SELECT * FROM listings"
        const result = await db.query(statement)
        res.send(result)
    } catch (err) {
        console.log(err)
    }
})

// API call to get a single listing in db
router.get("/:listingID", async(req, res) => {
    try {
        const id = req.params.listingID
        const statement = "SELECT * FROM listings WHERE listingid = ?"
        const result = await db.query(statement, [id])
        res.send(result)
    } catch (err) {
        console.log(err)
    }
})

modules.export(router)