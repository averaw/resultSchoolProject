const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    completedMetings: {
      type: Number,
    },
    image: {
      type: String,
    },
    profession: { type: Schema.Types.ObjectId, ref: "Profession" }, //профессия одна по-этому объект
    qualities: [{ type: Schema.Types.ObjectId, ref: "Quality" }], // качеств много по-этому массив
    rate: {
      type: Number,
    },
    sex: {
      type: String,
      enum: ["male", "femail", "other"],
    },
  },

  {
    timestamps: true, // когда была создана модель и когда обновлена ,это опциональный параметр
  }
);

module.exports = model("User", schema);
