const express = require('express')
const router = express.Router({mergeParams:true})
const auth = require ("../middleware/auth.middelware")
const Comment = require("../models/Comment")



router
  .route('/')
  .get(auth, async (req, res) => {
    try {
      const {orderBy, equalTo} = req.query //это параметры которые мы получаем с фронта 
      const list = await Comment.find({ [orderBy]: equalTo }) //фильтруем комментарии такое себе не понятно 
      res.send(list) //отправляем список всех комментариев 
    } catch (e) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже'
      })
    }
  })
  .post(auth, async (req, res) => {
    try {
      const newComment = await Comment.create({
        ...req.body,
        userId: req.user._id
      })
      res.status(201).send(newComment)
    } catch (e) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже'
      })
    }
  })

router.delete('/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params
    const removedComment = await Comment.findById(commentId) //получаем  ком который нужно удалить

    if (removedComment.userId.toString() === req.user._id) // получаем кто может удалить комент ,пользователь который его оставил !
     {
      await removedComment.remove()
      return res.send(null)
    } else {
      res.status(401).json({message: 'Unauthorized'})
    }
  } catch (e) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже'
    })
  }
})





module.exports =router 