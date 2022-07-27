const express = require("express")
const db = require("../env/Database")
const router = express.Router()
const { validate } =  require("../functions/Validation")

// API call for getting all listings in db
router.get("/all", (req, res) => {
    const statement = "SELECT * FROM listings"
    result = db.query(statement, (err, result) => {
        if (err)
            console.log(err)
        else res.send(result)
    })
})

// API call to get a single listing in db
router.get("/:listingID", (req, res) => {
    const id = req.params.listingID
    const statement = "SELECT * FROM listings WHERE listingid = ?"
    db.query(statement, [id], (err, result) => {
        if (err)
            console.log(err)
        else res.send(result)
    })
})

// API call to create a listing in DB
router.post("/create", (req, res) => {
    // read from request body
    const [author, title, location, duration, description, maxcapacity] = Object.values(req.body)

    // validate input
    if (validate(author) && validate(title) && validate(location) && validate(duration) && validate(description) && validate(maxcapacity))
        console.log("Input is clean.")
    else { 
        res.send("Input characters are unacceptable.") 
        return
    }

    // create listing in db
    let statement = "INSERT INTO listings (author, title, location, duration, description) VALUES (?,?,?,?,?)"
    db.query(statement, [author,title,location,duration,description], (err, result) => {
        if (err)
            console.log(err)
        const listingID = result.insertId

        // create group assigned to listing
        statement = "INSERT INTO `groups` (listingid, maxcapacity, members) VALUES (?,?,?)"
        db.query(statement, [listingID,maxcapacity,author], (err, result) => {
            if (err) {
                console.log(err)
                res.send("Failed. Try again later!")
            } else res.send("Listing created!")
        })
    })
})

// API call to add member to group 
router.post("/add", (req, res) => {
    // read from request body
    const [member, listingid] = Object.values(req.body)

    // validate input
    if (validate(member) && validate(listingid))
        console.log("Input is clean.")
    else { 
        res.send("Input characters are unacceptable.") 
        return
    }

    // first check group's current and max capacity from db
    // potential improvement : save groupid, maxcapacity, currentcapacity, members from frontend UI call so we dont have to make another query
    let statement = "SELECT groupid,maxcapacity,currentcapacity,members FROM `groups` WHERE listingid = ?"
    db.query(statement, [listingid], (err, result) => {
        if (err)
            console.log(err)
        else {
            const group = result[0]
            if(group.maxcapacity <= group.currentcapacity) {
                res.send("Not able to join! Group is full.")
                return
            }
            else {
                // there is sufficient room in the group, add to database.
                let newMemberList = group.members + "," + member
                statement = "UPDATE `groups` SET members = ?, currentcapacity = ? WHERE groupid = ?"
                db.query(statement, [newMemberList, group.currentcapacity+1, group.groupid], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.send("Unknown error. Failed to join group.")
                    }
                    else res.send("Joined group!")
                })
            }
        }
    })
})

module.exports = router