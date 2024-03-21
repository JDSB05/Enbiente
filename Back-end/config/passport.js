const passport = require("passport");
const router = require("express").Router();
const UserModel = require("../models/utilizador.model");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "mudar",
};

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await UserModel.findByPk(jwt_payload.id, {
            attributes: ['utilizador_id', 'cargo_id', 'email', 'nome']
        });
        if (user) {
            return done(null, { message: user, success: true });
        } else {
            return done(null, { message: 'Sem autorização, token inválido!', success: false });
        }
    } catch (err) {
        return done(err, { message: 'Sem autorização, erro ao validar token', success: false });
    }
}));

