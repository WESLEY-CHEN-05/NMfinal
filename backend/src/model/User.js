import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  DIDid:{type: String, required: [true,'DIDid field is required']},
  firstName:{type: String, required: [true, 'Username field is required']},
  lastName:{type: String, required: [true, 'Username field is required']},
  email:{type: String, required: [true, 'Email field is required.']},
});

const UserModel = model('user', UserSchema);
export default UserModel;