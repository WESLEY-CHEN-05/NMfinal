import { Schema, model } from 'mongoose';

const DriverSchema = new Schema({
  fistName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  DIDid: {
    type: String,
    required: true,
  },
  email: {
    type: String, 
    required: true
  },
  password: {
    type: String, 
    required: true
  }
});

const DriverModel = model('driver', DriverSchema);
export default DriverModel;