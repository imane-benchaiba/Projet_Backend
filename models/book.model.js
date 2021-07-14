const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    editor: {
      type: String,
      required: true,
    },
    type: {
        type: String,
    },
    abstract: {
      type: String,
      required: true,
    },
    picture: {
      type: String
    },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        },
      ],
    },
    currentlyreading: {
      type: [String],
    },
    read: {
      type: [String],
    },
    wanttoread: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const BookModel = mongoose.model("book", BookSchema);
module.exports = BookModel;
