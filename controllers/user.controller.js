const UserModel = require('../models/user.model');
const BookModel = require('../models/book.model');
const ObjectID = require('mongoose').Types.ObjectID;

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


module.exports.currentlyreading = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown (currentlyreading): " + req.params.id);

  try {
    await BookModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { currentlyreading: req.body.idCr },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.idCr,
      {
        $addToSet: { currentlyreading: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.uncurrentlyreading = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown (uncurrentlyreading): " + req.params.id);

  try {
    await BookModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { currentlyreading: req.body.idUnCr },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.idUnCr,
      {
        $pull: { currentlyreading: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.read = async (req, res) => {
  const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).send({
        message: "User not found",
      });
    }

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { read: req.body.idRead },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );
    await BookModel.findByIdAndUpdate(
      req.body.idRead,
      {
        $addToSet: { read: req.params.id },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(400).json(err);
      }
    );
    
  } catch (err) {
    return res.status(400).json({message: err});
  }
};
module.exports.unread = async (req, res) => {
  const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).send({
        message: "User not found",
      });
    }

  try {
    await BookModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { read: req.body.idUnRead },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.idUnRead,
      {
        $pull: { read: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.wanttoread = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await BookModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { wanttoread: req.body.idWtr },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.idWtr,
      {
        $addToSet: { wanttoread: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.unwanttoread = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await BookModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { wanttoread: req.body.idUnWtr },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.idUnWtr,
      {
        $pull: { wanttoread: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
