//здесь все что у нас равно mock данным
// короче говоря весь код прописан для загрузки данных в mongo ,после этого все данные подтянутся туда

const Profession = require("../models/Profession"); // это нужно для взаимодействия с БД
const Quality = require("../models/Quality"); // это нужно для взаимодействия с БД
const professionMock = require("../mock/professions.json");
const qualitiesMock = require("../mock/qualities.json");
const { modelNames } = require("mongoose");

module.exports = async () => {
  const professions = await Profession.find();
  if (professions.length !== professionMock.length) {
    await createInitialEntity(Profession, professionMock);
  }

  const qualities = await Quality.find();
  if (qualities.length !== qualitiesMock.length) {
    await createInitialEntity(Quality, qualitiesMock);
  }
};
// типо Model - это Profession ,а data -это professionMock
async function createInitialEntity(Model, data) {
  await Model.collection.drop(); //чистим всю коллекцию ,а далее сохраняем это код ниже
  return Promise.all(
    data.map(async (item) => {
      try {
        delete item._id; // чтобы id не записывался
        const newItem = new Model(item);
        await newItem.save(); // сохраняем все данные и заносим таким образом в mongo
        return newItem;
      } catch (error) {
        return error;
      }
    })
  );
}
