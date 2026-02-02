// src/config/passport.ts

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/user';

/**
 * GOOGLE STRATEGY
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/v1/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error('Google account has no email'), false);
        }

        const user = await User.findOneAndUpdate(
          { email },
          {
            username: profile.displayName.replace(/\s/g, '').toLowerCase(),
            email,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile.photos?.[0]?.value,
            authProvider: 'google',
            providerId: profile.id,
          },
          { upsert: true, new: true },
        );

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    },
  ),
);

/**
 * FACEBOOK STRATEGY
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: '/v1/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error('Facebook account has no email'), false);
        }

        const firstName = profile.name?.givenName ?? '';
        const lastName = profile.name?.familyName ?? '';

        const username =
          (firstName + lastName).toLowerCase().replace(/\s/g, '') ||
          email.split('@')[0];

        const user = await User.findOneAndUpdate(
          { email },
          {
            username,
            email,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile.photos?.[0]?.value,
            authProvider: 'facebook',
            providerId: profile.id,
          },
          { upsert: true, new: true },
        );

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    },
  ),
);

export default passport;
