require('dotenv').config();
const {ACCESS_TOKEN_SECRET} = process.env;

const UsuarioService = require('../services/usuario_service.js');

const jwt = require('jsonwebtoken');

const USER_NOT_AUTHENTICATED_ERROR = 'Not authenticaded, please authenticate';
const USER_NOT_AUTHORIZED_ERROR = 'Forbidden, user is not authorized';
const USER_NOT_FOUND_ERROR = 'User was not found';

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error(USER_NOT_AUTHENTICATED_ERROR);
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new Error(USER_NOT_AUTHENTICATED_ERROR);
    }
    const user = await UsuarioService.findUsarioById(
        decodedToken.idBoleta);
    if (!user) {
      throw new Error(USER_NOT_FOUND_ERROR);
    }

    req.usuario = user;
    next();
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

exports.permit = (...permittedRoles) => {
  return (req, res, next) => {
    const {user} = req;
    if (!user) {
      throw new Error();
    }
    console.log(user.profile);
    if (permittedRoles.includes(employee.profile.profileDescription)) {
      next();
    } else {
      res.status(403).json({message: USER_NOT_AUTHORIZED_ERROR});
    }
  };
};
