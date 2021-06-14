const UserModel = require('../models/user.model');
const objectID = require('mongoose').Types.ObjectID;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}
module.exports.userInfo = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(400).send({
      message: "User not found",
    });
  }
  res.status(200).send(user);

}
module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(400).send({
      message: "User not found",
    });
  }
  try {
      await UserModel.findOneAndUpdate(
          {_id: req.params.id},
          {$set: {
              bio: req.body.bio
          }},
          {new: true, upsert: true, setDefaultsOnInsert: true},
          (err, docs) => {
              if(!err) return res.send(docs);
              if(err) return res.status(500).send({ message: err});
          }
      )
  } catch (err) {
      return res.status(500).json({ message: err});
  }
};
module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(400).send({
      message: "User not found",
    });
  }

  try {
      await UserModel.remove({ _id: req.params.id}).exec();
      res.status(200).json({ message: "Successfully deleted. "})
  } catch (err) {
      return res.status(500).json({ message: err});
  }
}
module.exports.follow = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).send({
        message: "User not found",
      });
    }
    try{
        // Ajouter dans la liste des followers
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow }},
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        // Ajouter dans la liste des following
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id }},
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err});
    }
} 
module.exports.unfollow = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).send({
        message: "User not found",
      });
    }
    try{
        // Enlever de la liste des followers
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow }},
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        // Enlever de la liste des following
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id }},
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err});
    }
} 