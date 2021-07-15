const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
    {
        authorName: {
            type: String,
            required: true,
        },
        birthday: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            required: true,
        },
        picture: {
            type: String
        }
    },
    {
        timestamps: true,
      }
);

const AuthorModel = mongoose.model("author", AuthorSchema);
module.exports = AuthorModel;