import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['home', 'work', 'other'],
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Address || mongoose.model('Address', addressSchema); 