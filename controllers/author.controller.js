const AuthorModel = require("../models/author.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const { uploadErrors } = require("../utils/errors.utils");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

module.exports.readAuthors = async (req, res) => {
    AuthorModel.find((err, docs) => {
      if (!err) res.send(docs);
      else console.log("Error to get data : " + err);
    }).sort({ createdAt: -1 });
};
module.exports.createAuthor = async (req, res) => {
    let fileName;
  
    if (req.file !== null) {
      try {
        if (
          req.file.detectedMimeType != "image/jpg" &&
          req.file.detectedMimeType != "image/png" &&
          req.file.detectedMimeType != "image/jpeg"
        )
          throw Error("invalid file");
  
        if (req.file.size > 500000) throw Error("max size");
      } catch (err) {
        const errors = uploadErrors(err);
        return res.status(201).json({ errors });
      }
      fileName = req.body.authorName+ ".jpg";
  
      await pipeline(
        req.file.stream,
        fs.createWriteStream(
          `${__dirname}../../../Projet_Frontend/public/uploads/authors/${fileName}`
        )
      );
    }
  
        const newAuthor = new AuthorModel({
          authorName: req.body.authorName,
          birthday: req.body.birthday,
          country: req.body.country,
          bio: req.body.bio,
          picture: req.file !== null ? "./uploads/authors/" + fileName : "",
        });
      
        try {
          const author = await newAuthor.save();
          return res.status(201).json(author);
        } catch (err) {
          return res.status(400).send(err);
        }
};
module.exports.updateAuthor = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown (update): " + req.params.id);
  
    const updatedRecord = {
      message: req.body.message,
    };
  
    AuthorModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else console.log("Update error : " + err);
      }
    );
};
module.exports.deleteAuthor = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown (delete): " + req.params.id);
  
    AuthorModel.findByIdAndRemove(req.params.id, (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Delete error : " + err);
    });
};
  