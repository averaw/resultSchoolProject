const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateUserData } = require("../utils/helpers");
const { check, validationResult } = require("express-validator");

const tokenService = require("../services/token.service");

// как происходит запрос /api/auth/signUp

router.post("/signUp", [
  check("email", "Некорректно введен email").isEmail(),
  check("password", "Минимальная длина пароля 8 символов").isLength({ min: 8 }), //проверяем пароль и эмейл на валидацию (правильность внесенных данных ) ,для этого мы добавляли библиотеку ("express-validator") {check,validationResult} эти штуки там же взяты из биб-ки

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: {
            message: "INVALID_DATA",
            code: 400,
            // errors: errors.array()
          },
        });
      }
      const { email, password } = req.body;
      const exitingUser = await User.findOne({ email }); // это логика для мыла есть нет и отработка ошибки если нет - сервер останавливается
      if (exitingUser) {
        return res.status(400).json({
          error: {
            message: "EMAIL_EXISTS",
            code: 400,
          },
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12); // 12 сложность пароля ,и здесть сосздаем константу для зашифрованного пароля ,это типо как уже сгенерированный пароль

      const newUser = await User.create({
        ...generateUserData(),
        ...req.body,
        password: hashedPassword,
      }); // здесь важен порядок вызовов ,в начале данные по юзер ,потом боди ,потом пароль

      const tokens = tokenService.generate({ _id: newUser._id }); // после того как пользователь зарегестрировался const newUser у нас в этой функции создается id пользователя переносим в токен
      await tokenService.save(newUser._id, tokens.refreshToken); //ждем пока токен сохранится
      res.status(201).send({ ...tokens, userId: newUser._id });
    } catch (e) {
      res.status(500).json({
        message: "на сервере произошла ошибка пробуйте позже",
      });
    }
  },
]);
router.post('/signInWithPassword', [
    check('email', 'Email некорректный').normalizeEmail().isEmail(),
    check('password', 'Пароль не может быть пустым').exists(),
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({
            error: {
              message: 'INVALID_DATA',
              code: 400
            }
          })
        }
  
        const {email, password} = req.body //получаем эмэйл и пароль
  
        const existingUser = await User.findOne({ email })
         //если пользователя не сущ выдаем ошибку
  
        if (!existingUser) {
          return res.status(400).send({
            error: {
              message: 'EMAIL_NOT_FOUND',
              code: 400
            }
          })
        }
  //получаем и сравниваем захэшированный пароль при помощи библиотеки bcrypt и метода .compare
        const isPasswordEqual = await bcrypt.compare(password, existingUser.password)
  
        if (!isPasswordEqual) {
          return res.status(400).send({
            error: {
              message: 'INVALID_PASSWORD',
              code: 400
            }
          })
        }
  //сохраняем в токины результат
        const tokens = tokenService.generate({ _id: existingUser._id })
        await tokenService.save(existingUser._id, tokens.refreshToken)
  
        res.status(200).send({ ...tokens, userId: existingUser._id })
      } catch (e) {
        res.status(500).json({
          message: 'На сервере произошла ошибка. Попробуйте позже'
        })
      }
  }])

  function isTokenInvalid(data, dbToken) {
    return !data || !dbToken || data._id !== dbToken?.user?.toString()
  }

  router.post('/token', async (req, res) => {
    try {
      const {refresh_token: refreshToken} = req.body //меняем на кэмлкейс 
      const data = tokenService.validateRefresh(refreshToken) // в token.service.js мы создали validateRefresh
      const dbToken = await tokenService.findToken(refreshToken) //получаем из БД токен ,и создали для него метод в token.service.js
  
      if (isTokenInvalid(data, dbToken)) {
        return res.status(401).json({message: 'Unauthorized'})
      }
  
      const tokens = await tokenService.generate({
        _id: data._id
      })
      await tokenService.save(data._id, tokens.refreshToken)
  
      res.status(200).send({ ...tokens, userId: data._id})
    } catch (e) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже'
      })
    }
  })
module.exports = router;
