const express = require('express')
const router = express.Router({mergeParams:true})
// как происходит запрос /api/auth

router.use('/auth',require('./auth.routes'))
router.use('/quality',require('./quality.routes'))
router.use('/profession',require('./profession.routes'))
router.use('/user',require('./user.routes'))
router.use('/comment',require('./comment.routes'))

module.exports =router 