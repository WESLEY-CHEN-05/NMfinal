import { Schema, model } from 'mongoose';

const PassengerSchema = new Schema({
  firstName:{type: String, required: [true, 'Username field is required']},
  lastName:{type: String, required: [true, 'Username field is required']},
  email:{type: String, required: [true, 'Email field is required.']},
  password:{type: String, required: [true, 'Password field is required']},
  signedIn:{type: Boolean, required: [true, 'Signed In state is required']},
});

const PassengerModel = model('passenger', PassengerSchema);
export default PassengerModel;