const express = require('express')
const router = express.Router({mergeParams:true})
const User = require("../models/User")
const auth = require("../middleware/auth.middelware")

router.patch('/:userId', auth, async (req, res) => {
    try {
      const { userId } = req.params // здесь вот это '/:userId',
  
      if (userId === req.user._id)//совпадают ли юзеры 
       {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new: true}) // это чтобы на бэк пришли обновленные данные  {new: true}
        res.send(updatedUser)
      } else {
        res.status(401).json({message: 'Unauthorized'})
      }
    } catch (e) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже'
      })
    }
  })

router.get('/', auth, async (req, res) => {
    try {
      const list = await User.find()
      res.send(list)
    } catch (e) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже'
      })
    }
  })


module.exports =router 