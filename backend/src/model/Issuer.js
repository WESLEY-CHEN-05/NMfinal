import { Schema, model } from 'mongoose';

const IssuerSchema = new Schema({
  DIDid:{type: String, required: [true,'DIDid field is required']},
  firstName:{type: String, required: [true, 'Username field is required']},
  lastName:{type: String, required: [true, 'Username field is required']},
  email:{type: String, required: [true, 'Email field is required.']},
  password:{type: String, required: [true, 'Password field is required']},
  signedIn:{type: Boolean, required: [true, 'Signed In state is required']},
});

const IssuerModel = model('issuer', IssuerSchema);
export default IssuerModel;