import { Router } from "express"
import { Event } from '../db.js'

const router = Router()

// Search by category, title, date

router.get('/', async (req, res) => {
    const { category, title, date } = req.body
    switch (category, title, date) {
        case category:
            res.send(await Event.find
                ({ category: category })
            )
            break
        case title:
            res.send(await Event.find
                ({ title: title })
            )
            break
        case date:
            res.send(await Event.find
                ({ date: date })
            )
            break
        default: 
            break
    }
})

// List all events

router.get('/all', async (req, res) => {
    res.send(await Event.find())
})


// Get a single event
router.get('/:id', async (req, res) => {
    try {
        res.send( await Event.findById(req.params.id))
    } catch (error) {
        res.status(404).send({ error: 'Entry does not exist' })
    }
})

// Create an event

/*
title: string, required
description: string, required
date: date, required
TODO: Add a field for location
category: reference to Category, required
TODO: Add a field for the image URL
TODO: Add a field for anime
TODO: Add a field for organiser
TODO: Add a field for entry price
TODO: Add a field for rsvp
*/

router.post('/', async (req, res) => {
    const { title, description, category } = req.body

    try {   
        const insertedEvent = new Event({
            title,
            description,
            date: new Date(),
            category 
        })
        await insertedEvent.save()

        res.status(201).send(insertedEvent)
    } catch (error) {
        res.status(400).send({ error: error.message})
    }
})

// Update an event
router.put('/:id', async (req, res) => {
    const { title, description, category } = req.body
    try {
        const updateEvent = await Event.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category
        }, { new: true })
        if (updateEvent) {
            res.send(updateEvent)
        } else {
            res.status(404).send({ error: 'Entry does not exist' })
        }
    } catch (error) {
        res.status(500).send({ error: error.message})
    }
})

// Delete an event
router.delete('/:id', async (req, res) => {
    // TODO: Create Functionality
    req.params.id
    await Event.findByIdAndDelete(req.params.id)
    res.send('Deleted an event')
})

export default router