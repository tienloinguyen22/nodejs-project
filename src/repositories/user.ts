import mongoose from 'mongoose';
import { addAuditableSchema, Genders, LoginTypes, MongoRepository } from '../core';
import { User } from '../types';

const UserSchema = new mongoose.Schema(
  addAuditableSchema({
    fullName: String,
    email: String,
    phoneNo: String,
    avatarUrl: String,
    dob: Date,
    address: String,
    gender: {
      type: String,
      enum: [Genders.MALE, Genders.FEMALE, Genders.OTHER],
    },
    numberOfPets: {
      type: Number,
      default: 0,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: [],
      },
    ],
    loginType: {
      type: String,
      enum: [LoginTypes.EMAIL, LoginTypes.FACEBOOK, LoginTypes.GOOGLE, LoginTypes.APPLE],
    },
    firebaseId: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }),
);
UserSchema.index({
  email: 'text',
  firstName: 'text',
  lastName: 'text',
});

export const UsersModel = mongoose.model('User', UserSchema);

export const usersRepository = new MongoRepository<User>(UsersModel, ['roles']);
