import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

// Type definition for Comment on the backend
export type Comment = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  category: number;
  commentOn: Types.ObjectId;
  dateCreated: Date;
  dateModified: Date;
};

export type PopulatedComment = {
  _id: Types.ObjectId;
  authorId: User;
  content: string;
  category: number;
  commentOn: Freet;
  dateCreated: Date;
  dateModified: Date;
  numLikes: number;
};

const CommentSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: Number,
    required: true
  },
  commentOn: {
    type: Schema.Types.ObjectId,
    ref: 'Freet',
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  }
}, {
  toObject: {virtuals: true, versionKey: false},
  toJSON: {virtuals: true, versionKey: false}
});

CommentSchema.virtual('numLikes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'likedObject',
  count: true,
  match: {
    docModel: 'Comment'
  }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
