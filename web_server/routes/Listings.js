const express = require("express")
const db = require("../env/Database")
const router = express.Router()
const { validate } =  require("../functions/Validation")
const { route } = require("./Profiles")

// API call for getting all listings in db
router.get("/l/all", (req, res) => {
    const statement = "SELECT * FROM listings"
    result = db.query(statement, (err, result) => {
        if (err)
            console.log(err)
        else res.send(result)
    })
})

// API call to get a single listing in db
router.get("/l/:listingID", (req, res) => {
    const id = req.params.listingID
    const statement = "SELECT * FROM listings WHERE listingid = ?"
    db.query(statement, [id], (err, result) => {
        if (err)
            console.log(err)
        else res.send(result)
    })
})

// API call to get single group in DB
router.get("/g/:listingID", (req, res) => {
    const id = req.params.listingID
    const statement = "SELECT * from `groups` WHERE listingid = ?"
    db.query(statement, [id], (err, result) => {
        if (err)
            console.log(err)
        else res.send(result)
    })
})

// API call to create a listing in DB
router.post("/l/create", (req, res) => {
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
router.post("/g/add", (req, res) => {
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

// API call to remove member from a group
router.post("/g/remove", (req, res) => {
    // read from request body
    const [member, listingid] = Object.values(req.body)

    // validate input
    if (validate(member) && validate(listingid))
        console.log("Input is clean.")
    else { 
        res.send("Input characters are unacceptable.") 
        return
    }

    // first check if member is in group
    let statement = "SELECT groupid,currentcapacity,members FROM `groups` WHERE listingid = ?"
    db.query(statement, [listingid], (err, result) => {
        if (err)
            console.log(err)
        else {
            const group = result[0]
            let memberList = group.members.split(',')
            if (memberList.includes(member)) {
                // cant remove if user is the only member in the group. should call delete group instead.
                if(group.currentcapacity == 1)  {
                    res.send("Not able to remove user. User is only member in group.")
                    return
                }
                else {
                    memberList.splice(memberList.indexOf(member), 1)
                    newMemberList = memberList.join()
                    statement = "UPDATE `groups` SET members = ?, currentcapacity = ? WHERE groupid = ?"
                    db.query(statement, [newMemberList, group.currentcapacity-1, group.groupid], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.send("Unknown error. Failed to remove user.")
                        }
                        else res.send("Removed user from group!")
                    })
                }
            }
            // member is not in the group
            else res.send("Not able to remove user. User is not a part of group.")
        }
    })
})

module.exports = router