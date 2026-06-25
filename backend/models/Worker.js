import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  mobile: { 
    type: String, 
    required: true 
  },
  aadhaar: { 
    type: String, 
    required: true 
  }, 
  designation: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  tenderId: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    default: "" 
  },
  isPresentToday: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

const Worker = mongoose.model('Worker', WorkerSchema);
export default Worker;