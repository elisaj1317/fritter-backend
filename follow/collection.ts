import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore follows
 * stored in MongoDB, including adding, finding, and deleting follows.
 */
class FollowCollection {
  /**
   * Add a follow to the collection
   *
   * @param {string} fromUser - The id of the user performing the follow
   * @param {string} toUserUsername - The username of the user being followed
   * @return {Promise<Boolean>} - true if the follow was created successfully, false otherwise
   */
  static async addOne(fromUser: Types.ObjectId | string, toUserUsername: string): Promise<boolean> {
    const toUser = await UserCollection.findOneByUsername(toUserUsername);
    const toUserId = toUser._id;
    const follow = new FollowModel({
      fromUser,
      toUser: toUserId
    });
    await follow.save();
    return follow !== null;
  }

  /**
   * Find a follow given a userId and a username
   *
   * @param {string} fromUserId - The userId of user who performed the action
   * @param {string} toUsername - The username of the user who received the action
   * @return {Promise<HydratedDocument<Follow>> | Promise<null>} - The follow with the given to and from,
   * if any exist
   */
  static async findOne(fromUserId: Types.ObjectId | string, toUsername: string): Promise<HydratedDocument<Follow>> {
    const toUser = await UserCollection.findOneByUsername(toUsername);
    return FollowModel.findOne({fromUser: fromUserId, toUser: toUser._id});
  }

  /**
   * Find a follow given two usernames
   *
   * @param {string} fromUsername - The username of user who performed the follow
   * @param {string} toUsername - The username of the user who received the follow
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all the follows with given fromUsername and toUsername
   */
  static async findAllByUsernames(fromUsername: string, toUsername: string): Promise<Array<HydratedDocument<Follow>>> {
    const fromUser = await UserCollection.findOneByUsername(fromUsername);
    const toUser = await UserCollection.findOneByUsername(toUsername);
    return FollowModel.find({fromUser: fromUser._id, toUser: toUser._id}).populate(['fromUser', 'toUser']);
  }

  /**
   * Find all followings of a given user
   *
   * @param {string} username - The username of the user who follows other users
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all the follows
   */
  static async findAllFollowingsByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowModel.find({fromUser: user._id}).populate(['fromUser', 'toUser']);
  }

  /**
   * Find all followings of a given user by userId
   *
   * @param {string} userId - The userId of the user who follows other users
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all the follows
   */
  static async findAllFollowingsByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({fromUser: userId}).populate(['fromUser', 'toUser']);
  }

  /**
   * Find all followers of a given user
   *
   * @param {string} username - The username of the user who is followed
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all the followers
   */
  static async findAllFollowersByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowModel.find({toUser: user._id}).populate(['fromUser', 'toUser']);
  }

  /**
   * Delete a follow from the collection
   *
   * @param {string} fromUserId - The userId of user requesting delete
   * @param {string} toUsername - The username to unfollow from
   * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
   */
  static async deleteOne(fromUserId: string, toUsername: string): Promise<boolean> {
    const toUser = await UserCollection.findOneByUsername(toUsername);
    const followSuccess = await FollowModel.deleteOne({fromUser: fromUserId, toUser: toUser._id});
    return followSuccess !== null;
  }

  /**
   * Delete all the follows associated with a given user
   *
   * @param {string} userId - The id of user removing from follows
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({toUser: userId});
    await FollowModel.deleteMany({fromUser: userId});
  }
}

export default FollowCollection;
