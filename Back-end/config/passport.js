const passport = require("passport");
const router = require("express").Router();
const UserModel = require("../models/usuarios.model");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "mudar",
};

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await UserModel.findByPk(jwt_payload.id, {
            attributes: ['NUsuario', 'NCargo', 'Email', 'Nome', 'Foto']
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

// Autenticação pelo google
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: '277910031789-v55rr1kqidih8dai745f9oergsd1dpcn.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'https://pint-2023-api.onrender.com/api/google/callback',
    scope: ["profile", "email"] // Specify the required scope here
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile); // add this line to check the profile object
    UserModel.findOne({ where: { google_id: profile.id} })
      .then(existingUser => {
        if (existingUser) {
          // Return the existing user
          console.log("Google ID: " + profile.id);
          console.log("Usuário já existe");
          done(null,{ message:  existingUser, success: true });
        } else {
          // Check if there's an existing user with the same email address
          UserModel.findOne({ where: { Email: profile.emails[0].value } })
            .then(userWithEmail => {
              if (userWithEmail && userWithEmail.google_id === null) {
                // An account with the same email exists and was not created with Google, don't create a new account
                console.log("Já existe um usuário com este email");
                const authError = new Error('Email already registered with non-Google account');
                authError.status = 401; // Unauthorized
                done(authError);
              } else {
                // If the user doesn't exist, create a new user in your database
                console.log("Criando novo usuário...");
                const newUser = new UserModel({
                  Nome: profile.displayName,
                  Email: profile.emails[0].value,
                  google_id: profile.id,
                  Estado : 1,
                  DataNascimento: profile.birthday || new Date(),
                  Genero: profile.gender || 'Desconhecido',
                  NCargo: 1,
                  Senha: 'google',
                  Foto: profile.photos[0].value || 'https://res.cloudinary.com/dr2x19yhh/image/upload/v1681211694/foto-padrao.jpg.jpg'
                });
                newUser.save()
                  .then(user => {
                    // Return the new user
                    done(null, newUser, { message: { 
                      NUsuario: user.NUsuario, 
                      NCargo: user.NCargo, 
                      Email: user.Email, 
                      Nome: user.Nome, 
                      Foto: user.Foto ,
                      DataNascimento: user.DataNascimento
                    }});
                  })
                  .catch(err => done(err)); // Handle database errors
              }
            })
            .catch(err => done(err)); // Handle database errors
        }
      })
      .catch(err => done(err)); // Handle database errors
  }));
  