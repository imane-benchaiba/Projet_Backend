const express = require('express');
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();
app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  }));

app.use(morgan("combined"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// jwt
app.get('*', checkUser); // dans chaque requete on doit vérifier si c'est bien le user concerné
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});



// Server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})