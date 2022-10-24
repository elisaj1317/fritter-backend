import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from './model';

type CommentResponse = {
  _id: string;
  author: string;
  content: string;
  category: number;
  commentOn: string;
  dateCreated: string;
  dateModified: string;
  numLikes: number;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
const constructCommentResponse = (comment: HydratedDocument<Comment>): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false
    })
  };

  return {
    _id: commentCopy._id.toString(),
    author: commentCopy.authorId.username,
    content: commentCopy.content,
    category: commentCopy.category,
    commentOn: commentCopy.commentOn._id.toString(),
    dateCreated: formatDate(commentCopy.dateCreated),
    dateModified: formatDate(commentCopy.dateModified),
    numLikes: commentCopy.numLikes
  };
};

export {
  constructCommentResponse
};
