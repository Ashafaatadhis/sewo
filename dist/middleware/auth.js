"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("../config/config"));
const passport_github2_1 = require("passport-github2");
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: config_1.default.auth.google.google_client_id,
    clientSecret: config_1.default.auth.google.google_client_secret,
    callbackURL: "http://localhost:8080/api/auth/google/callback",
    passReqToCallback: true,
}, function (request, access_token, refreshToken, profile, done) {
    return done(null, profile);
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: config_1.default.auth.github.github_client_id,
    clientSecret: config_1.default.auth.github.github_client_secret,
    callbackURL: "http://localhost:8080/api/auth/github/callback",
}, function (access_token, refreshToken, profile, done) {
    return done(null, profile);
}));
exports.default = passport_1.default;
