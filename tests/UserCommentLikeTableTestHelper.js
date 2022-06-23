/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UserCommentLikeTableTestHelper = {
  async addLike({
    id = 'like-123', comment_id = 'comment-123', user_id = 'user_123',
  }) {
    const query = {
      text: 'INSERT INTO user_comment_likes (id, comment_id, user_id) VALUES ($1, $2, $3)',
      values: [id, comment_id, user_id],
    };
    await pool.query(query);
  },
  async getLikeById(id) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = UserCommentLikeTableTestHelper;
