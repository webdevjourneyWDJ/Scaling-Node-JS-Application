const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require('node-fetch')

const getAllShows = () =>
    fetch('http://localhost:3001')
        .then(res => res.json())

const getShow = id =>
    fetch(`http://localhost:3001/${id}`)
        .then(res => res.json())

const holdSeats = (showID, count) =>
    fetch(`http://localhost:3001/hold-seats`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count, showID })
    }).then(res => res.json())

const makeReservation = (name, count, showID) =>
    fetch(`http://localhost:3002`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, count, showID })
    }).then(res => res.json())

const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded())
    .post('/reserve', async (req, res) => {

        let count, show

        if (!req.body.count) {
            res.status(500)
            return res.json({ error: `A ticket count is required to reserve tickets.`})
        }

        if (!req.body.name) {
            res.status(500)
            return res.json({ error: `A name is required to reserve tickets.`})
        }

        // Parse the Count
        count = parseInt(req.body.count)

        // Lookup the Show
        show = await getShow(req.body.showID)

        if (!show) {
            res.status(500)
            return res.json({ error: `Cannot find show with id: ${req.body.showID}`})
        }

        const remainingSeats = show.houseSize - show.reserved

        if (remainingSeats < count) {
            res.status(500)
            return res.json({ error: `cannot reserve ${count} seats. Only ${remainingSeats} remaining.`})
        }

        // Hold Seats with Show Service
        console.log(`holding ${count} seats for ${req.body.name}`)
        await holdSeats(req.body.showID, count)

        // Make Reservation with Reservation Service
        console.log(`making the reservation for ${req.body.count}`);
        const reservation = await makeReservation(req.body.name, count, req.body.showID);

        res.json({ success: true, showID: req.body.showID, ...reservation})

    })
    .get('/', async (req, res) => {
        // Return a List of Shows Only
        console.log("requesting shows from show service");
        var shows = await getAllShows();
        res.json(shows);
    })

app.listen(3000, () => console.log(`Show Ticket API running for all clients`))
