import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

// Type definition for Follow on the backend
export type Follow = {
  _id: Types.ObjectId;
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
};

export type PopulatedFollow = {
  _id: Types.ObjectId;
  fromUser: User;
  toUser: User;
};

const FollowSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
