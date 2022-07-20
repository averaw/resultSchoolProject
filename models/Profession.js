const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: {
      // здесь вносим параметры объектов ,почему -то id не нужно
      type: String,
      require: true,
    },
  },
  {
    timestamps: true, // когда была создана модель и когда обновлена ,это опциональный параметр 
  }
);

module.exports = model("Profession", schema);
