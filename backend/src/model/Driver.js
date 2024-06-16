import { Schema, model } from 'mongoose';

const DriverSchema = new Schema({
  DIDid: {type: String, required: [true,'DID id field is required']},
  name: {type: String, required: [true, 'name field is required']},
  licenseNumber: {type: String, required: [true, 'license number field is required']},
  dueDate: {type: String, required: [true, 'license due date field is required']},
  email: {type: String, required: [true, 'Email field is required.']},
}); 

const DriverModel = model('driver', DriverSchema);
export default DriverModel;