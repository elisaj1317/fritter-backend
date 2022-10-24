import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';

/**
 * This files contains a class that has the functionality to explore comments
 * stored in MongoDB, including adding, finding, updating, and deleting comments.
 * Feel free to add additional operations in this file.
 */
/**
 *
 */
class CommentCollection {
  /**
     * Add a comment to the collection
     *
     * @param {string} authorId - The id of the author of the comment
     * @param {string} objectId - The id of the object being commented on
     * @param {string} content - The content of the freet
     * @param {number} category - The number corresponding to the category of the comment
     * @return {Promise<HydratedDocument<Comment>>} - The newly created comment
     */
  static async addOne(authorId: Types.ObjectId | string, objectId: Types.ObjectId | string, content: string, category: number): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      authorId,
      content,
      category,
      commentOn: objectId,
      dateCreated: date,
      dateModified: date
    });
    await comment.save();
    return comment.populate([
      'authorId',
      {
        path: 'commentOn',
        populate: {path: 'authorId'}
      }
    ]);
  }

  /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @returns {Promise<HydratedDocument<Comment>> | Promise<null>} - The comment with the given commentId, if any
   */
  static async findOne(commentId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    return CommentModel.findOne({_id: commentId}).populate([
      'authorId',
      {
        path: 'commentOn',
        populate: {path: 'authorId'}
      }
    ]);
  }

  /**
   * Get all the comments on a given object
   *
   * @param {string} commentOn - The id of the object being commented on
   * @returns {Promise<HydratedDocument<Comment>[]>} - An array of all the comments
   */
  static async findAllById(commentOn: Types.ObjectId | string): Promise<Array<HydratedDocument<Comment>>> {
    return CommentModel.find({commentOn}).populate([
      'authorId',
      {
        path: 'commentOn',
        populate: {path: 'authorId'}
      }
    ]);
  }

  /**
   * Get all the comments of a given category on a given object
   *
   * @param {string} commentOn - The id of the object being commented on
   * @param {number} category - The number of category
   * @returns {Promise<HydratedDocument<Comment>[]>} - An array of all the comments
   */
  static async findAllByIdAndComment(commentOn: Types.ObjectId | string, category: number): Promise<Array<HydratedDocument<Comment>>> {
    return CommentModel.find({commentOn, category}).populate([
      'authorId',
      {
        path: 'commentOn',
        populate: {path: 'authorId'}
      }
    ]);
  }

  /**
   * Update a comment with the new content and/or category
   *
   * @param {string} commentId  - The commentId of the comment to update
   * @param {Object} commentDetails - An object with the comment's updated information
   * @return {Promise<HydratedDocument<Comment>>} - The updated comment
   */
  static async updateOne(commentId: Types.ObjectId | string, commentDetails: any): Promise<HydratedDocument<Comment>> {
    const comment = await CommentModel.findOne({_id: commentId});
    if (commentDetails.content) {
      comment.content = commentDetails.content as string;
    }

    if (commentDetails.category) {
      comment.category = commentDetails.category as number;
    }

    await comment.save();
    return comment;
  }

  /**
   * Delete a comment with the given commentId.
   *
   * @param {string} commentId - The commentId of the comment to delete
   * @return {Promise<Boolean>} - true if the comment has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const comment = await CommentModel.deleteOne({_id: commentId});
    return comment !== null;
  }
}

export default CommentCollection;
