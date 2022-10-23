import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including adding, finding, and deleting follows.
 */
class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} liker - the username of the user performing the like
   * @param {string} likedObject - the id of the freet being liked
   * @return {Promise<Boolean>} - true if the like was created successfully, false otherwise
   */
  static async addOne(liker: Types.ObjectId | string, likedObject: Types.ObjectId | string): Promise<boolean> {
    const like = new LikeModel({
      liker,
      likedObject
    });
    await like.save();
    return like !== null;
  }

  /**
   * Find a like given userId and likedObject
   *
   * @param {string} userId - The userId of the user who likes other freets
   * @param {string} likedObject - The freetId of the freet who was liked
   * @return {Promise<HydratedDocument<Like> | Promise<null>} - The follow with the given liker and likedObject
   */
   static async findOne(userId: Types.ObjectId | string, likedObject: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({liker: userId, likedObject});
  }

  /**
   * Find all likes of a given user by userId
   *
   * @param {string} userId - The userId of the user who likes other freets
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all the likes
   */
  static async findAllLikesById(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({liker: userId}).populate([
      'liker',
      {
        path: 'likedObject',
        populate: {path: 'authorId'}
      }
    ]);
  }

  /**
   * Find count of likes on a freet by freetId
   *
   * @param {string} freetId - The freetId of the freet who is liked
   * @return {Promise<number>} - The number of likes on the post
   */
  static async findCount(freetId: Types.ObjectId | string): Promise<number> {
    return LikeModel.count({likedObject: freetId});
  }

  /**
   * Delete a like from the collection
   *
   * @param {string} likerId - The userId of user liking an object
   * @param {string} likedObject - The freetId of freet being deleted
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(likerId: Types.ObjectId | string, likedObject: Types.ObjectId | string) {
    const likeSuccess = await LikeModel.deleteOne({likerId, likedObject});
    return likeSuccess !== null;
  }
}

export default LikeCollection;
