import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

ProductSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

ProductSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString(); // _id를 id로 변환
    delete ret._id; // _id 필드 제거
    delete ret.__v; // __v 필드 제거
    return ret;
  },
});

export default mongoose.model('Product', ProductSchema);