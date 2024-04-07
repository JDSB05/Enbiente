const passport = require("passport");
const router = require("express").Router();
const UserModel = require("../models/utilizador.model");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cache = require("../config/cache");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "mudar",
};

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
      // Tenta obter o Utilizador em cache
      let user = await cache.get(jwt_payload.id);
      if (!user) {
        console.log("Utilizador não está em cache, obtendo da BD...")
        // Se o Utilizador não está em cache, obtém da BD
        user = await UserModel.findByPk(jwt_payload.id, {
            attributes: ['utilizador_id', 'cargo_id', 'email', 'nome', 'foto', 'estado', 'primeiroLogin', 'ultimoLogin']
        });
        // Armazena o Utilizador em cache por 4 minutos
       cache.set(jwt_payload.id, user, 240);
      }
      if (user && user.estado === 1) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }));
  
