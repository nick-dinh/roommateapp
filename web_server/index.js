const express = require('express')
const db = require('./env/database')
const cors = require('cors')

// initialize server
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 5051;

// routes (defined in ./routes)
const groupsRouter = require("./routes/Groups")
const inboxRouter = require("./routes/Inbox")
const listingsRouter = require("./routes/Listings")
const managementRouter = require("./routes/UserManagement")
const profilesRouter = require("./routes/UserProfiles")
app.use("/groups/", groupsRouter)
app.use("/inbox/", inboxRouter)
app.use("/listings/", listingsRouter)
app.use("/management/", managementsRouter)
app.use("/profiles/", profilesRouter)

// listen on port for API requests
app.listen(PORT, ()=> {
    console.log(`Server listening on localhost:${PORT}`)
})