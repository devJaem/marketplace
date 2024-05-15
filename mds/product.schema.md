### product.schema.js
---
```javascript
import mongoose from 'mongoose';

//타입과 필수 여부를 지정한다
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // 나중에 활용해보려고 order 필드도 생성했다
  // 정렬을 날짜가 아니라 order 값으로 해봐도 같은 결과가 나올듯
  order: {
    type: Number,
    required: true,
    unique: true
  },
  description:{
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
// 몽고디비 특징인 _id와 __v 값을 이름을 바꾸거나, 없애기 위해 검색해서 찾았다
// json 에서 제거해줌
ProductSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});
// 몽고디비 특징인 _id와 __v 값을 이름을 바꾸거나, 없애기 위해 검색해서 찾았다
// object 에서 제거해줌
ProductSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;              
    delete ret.__v;              
    return ret;
  }
});

export default mongoose.model('Product', ProductSchema);
```