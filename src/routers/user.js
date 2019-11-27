const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const cookieParser = require('cookie-parser');
const router = new express.Router()
const { sendWelcomeEmail, sendFollowUpEmail} = require('../emails/account')
router.use(cookieParser());

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log("hello")
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.cookie("token", token)
        res.status(201).send()
    } catch (e) {
        console.log('this is an error?')
        res.status(400).send()
    }
    
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie("token", token)
        res.status(200).redirect('/dashboard')
    } catch (e) {
        res.status(400).send()
    }
})


router.post('/users/logoutAll', auth , async (req,res)=>{
    try{
        console.log('this is my logout')
        res.clearCookie('token')
        res.send()
    } catch(e){
        res.status(500).send()
    }
})


module.exports = router