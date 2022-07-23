const jwt = require("jsonwebtoken") // бибилиотека 
const config = require ("config")
const Token = require("../models/Token")

class TokenService {
generate(payload){

    const accessToken = jwt.sign(payload,config.get("accessSecret"),{
        expiresIn:"1h" // на сколько будет доступен токен обычно дается час  

    })
    const refreshToken = jwt.sign(payload,config.get("refreshSecret")) //здесь нам не нужно чтобы ключ истекал по времени ,мы просто его сохраняем
    return {
        accessToken, refreshToken,expiresIn:3600
    }
}
//далее создаем новый метод который будет сохранять refreshToken для пользователя 

async save(user,refreshToken) {
const data = await Token.findOne({user}) // user: это ключ который мы создвали в Token.js
if (data){
    data.refreshToken = refreshToken //обновляем ключ
    return data.save()
}

const token = await Token.create ({user, refreshToken}) //если в бд не создалась запись ,значит вносим ее в бд при помощи этой ф-ции 
return token
}

validateRefresh(refreshToken){
    try {
       return jwt.verify(refreshToken,config.get("refreshSecret") ) //jwt.verify библиотека + метод
    } catch (e) {
        return null
    }
}

async findToken (refreshToken){
    try {
        return await Token.findOne({refreshToken})
    } catch (error) {
        return null
    }
}

}

module.exports = new TokenService()