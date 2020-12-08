const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try {
            let user = await User.findOne({googleId: profile.id})
            if(user){
                done(null,user) // quer dizer que authenticou e vai pro serializeUser
            }else{
                user = await User.create(newUser)
                done(null,user) // quer dizer que authenticou e vai pro serializeUser
            }
        } catch (error) {
            console.log(error)
        }
    }))
    passport.serializeUser((user,done) => { // chamado em todo request de login, salva o id do usuario na sessao
        done(null,user.id)
    })
    passport.deserializeUser((id,done) => {  // adiciona o user no req.user
        User.findById(id,(err,user) => done(err,user)) 
    })
}