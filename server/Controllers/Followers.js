import models from '../models';
import { serverResponse, serverError } from '../helpers';

const { User, UserFollower } = models;

const userAttributes = [
  'id',
  'firstname',
  'lastname',
  'avatarUrl',
  'email'
];

/**
 * @export
 * @class Followers
 */
class Followers {
  /**
   * @name follow
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new follower
   */
  static async follow(req, res) {
    try {
      const {
        user: { id },
        params: { username }
      } = req;
      const userThatWantsToFollow = await User.findById(id);
      const userToBeFollowed = await User.findByEmail(username);
      const error = Followers.canFollowOrUnfollow(userToBeFollowed, id);
      if (error) return serverResponse(res, error.status, error);
      const follower = await UserFollower.findOrCreate({
        where: {
          userId: userToBeFollowed.id,
          followerId: id
        }
      });
      const { dataValues } = follower[0];
      await Followers.updateFollowsCount(
        userThatWantsToFollow,
        userToBeFollowed
      );

      return serverResponse(res, 200, {
        data: { message: 'followed successfully', follow: dataValues }
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   * @name unfollow
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of an unfollowed user
   */
  static async unfollow(req, res) {
    try {
      const {
        user: { id },
        params: { username }
      } = req;
      const userThatWantsToUnfollow = await User.findById(id);
      const userToBeUnfollowed = await User.findByEmail(username);
      const error = Followers.canFollowOrUnfollow(userToBeUnfollowed, id);
      if (error) return serverResponse(res, error.status, { data: { message: error.message } });
      await UserFollower.destroy({
        where: {
          userId: userToBeUnfollowed.id,
          followerId: id
        }
      });

      await Followers.updateFollowsCount(
        userThatWantsToUnfollow,
        userToBeUnfollowed
      );

      return serverResponse(res, 200, {
        data: {
          message: `you sucessfully unfollowed ${username}`,
          id: userToBeUnfollowed.id
        }
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   * @name canFollowOrUnfollow
   * @async
   * @static
   * @memberof Users
   * @param {Object} user user object
   * @param {integer} id id of other user
   * @returns {object} object with details of a user
   */
  static canFollowOrUnfollow(user, id) {
    if (!user) {
      return { status: 404, data: { message: 'user not found' } };
    }
    if (id === user.id) {
      return {
        status: 409,
        data: { message: 'user cannot perform this action' }
      };
    }
    return false;
  }

  /**
   * @name UpdateFollowsCount
   * @async
   * @static
   * @memberof Followers
   * @param {Object} source the source user object
   * @param {Object} target the target user object
   * @returns {Null} Null object
   */
  static async updateFollowsCount(source, target) {
    const followingsCount = await source.countAllFollowings();
    const followersCount = await target.countAllFollowers();
    await User.update({ followingsCount }, { where: { id: source.id } });
    await User.update({ followersCount }, { where: { id: target.id } });
    return null;
  }

  /**
   * @name allFollowings
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of an unfollowed user
   */
  static async allFollowings(req, res) {
    try {
      const {
        query: { sort }
      } = req;
      const orderby = sort === 'ASC' ? 'ASC' : 'DESC';
      const followings = await req.user.getAllFollowings({
        order: [
          ['id', orderby],
        ],
        include: [
          {
            model: User,
            as: 'following',
            attributes: userAttributes
          }
        ]
      });
      const users = followings.map(following => following.dataValues);
      serverResponse(res, 200, { followings: users });
    } catch (error) {
      return serverError(req, res, error);
    }
  }


  /**
   * @name count
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of an unfollowed user
   */
  static async allFollwers(req, res) {
    try {
      const {
        query: { sort }
      } = req;
      const orderby = sort === 'ASC' ? 'ASC' : 'DESC';
      const followers = await req.user.getAllFollowers({
        order: [
          ['id', orderby],
        ],
        include: [
          {
            model: User,
            as: 'follower',
            attributes: userAttributes
          }
        ]
      });
      const users = followers.map(follower => follower.dataValues);
      serverResponse(res, 200, { followers: users });
    } catch (error) {
      return serverError(req, res, error);
    }
  }
}

export default Followers;
