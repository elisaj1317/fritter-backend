import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

// Type definition for Comment on the backend
export type Comment = {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  category: number;
  commentOn: Types.ObjectId;
  dateCreated: Date;
  dateModified: Date;
};

export type PopulatedComment = {
  _id: Types.ObjectId;
  author: User;
  content: string;
  category: number;
  commentOn: Freet;
  dateCreated: Date;
  dateModified: Date;
};

const CommentSchema = new Schema({
  author: {
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
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
