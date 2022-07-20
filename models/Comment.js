const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    pageId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // на чьей странице нах-тя комментарии
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // id чела кто ост коммент
  },

  {
    timestamps: { createdAt: "created_at" }, // что -то про CamelCase
  }
);

module.export = model("Comment", schema);
