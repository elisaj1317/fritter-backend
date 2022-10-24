import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {PopulatedFreet} from '../freet/model';

export type objectsToLike = 'Freet' | 'Comment';

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId;
  liker: Types.ObjectId;
  likedObject: Types.ObjectId;
  docModel: objectsToLike;
};

export type PopulatedFreetLike = {
  _id: Types.ObjectId;
  liker: User;
  likedObject: PopulatedFreet;
  docModel: 'Freet';
};

const LikeSchema = new Schema({
  liker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likedObject: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'docModel'
  },
  docModel: {
    type: String,
    required: true,
    enum: ['Freet', 'Comment']
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
