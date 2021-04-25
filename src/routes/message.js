const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message')

/** Route to get all messages. */
router.get('/', (req, res) => {
    Message.find().then((messages) => {
        return res.json({ messages })
    })
    .catch((err) => {
        throw err.message
    })
})

/** Route to get one message by id. */
router.get('/:messageId', (req, res) => {
    Message.findOne({ _id: req.params.messageId })
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        throw err.message
    })
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    let message = new Message(req.body)
    message.save()
    .then(message => {
        return User.findById(message.author)
    })
    .then(user => {
        // console.log(user)
        user.messages.unshift(message)
        return user.save()
    })
    .then(() => {
        return res.send(message)
    }).catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', (req, res) => {
    Message.findByIdAndUpdate(req.params.messageId, req.body)
    .then(() => {
        return Message.findById({ _id: req.params.messageId })
    })
    .then((message) => {
        return res.json({ message })
    })
    .catch((err) => {
        throw err.message
    })
})

/** Route to delete a message. */
router.delete('/:messageId', (req, res) => {
    Message.findByIdAndDelete(req.params.messageId)
    .then((message) => {
        if (message === null) {
            return res.json({ message: 'Message does not exist.' })
        } else {
            return res.json({
                'message': 'Message was deleted.'
            })
        }
    })
    .catch((err) => {
        throw err.message
    })
})

module.exports = router