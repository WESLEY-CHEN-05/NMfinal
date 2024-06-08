import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  fistName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const driverModel = model('driver', UserSchema);
export default driverModel;