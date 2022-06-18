/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTabelTestHelper = {
  async addComment({
    id = 'comment-123',
    owner = 'user-123',
    thread = 'thread-123',
    date = '2021-08-08T07:19:09.775Z',
    content = 'some-content',
    reply = null,
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments(id,owner,thread,date,content,reply,is_delete) VALUES($1,$2,$3,$4,$5,$6,$7)',
      values: [
        id,
        owner,
        thread,
        date,
        content,
        reply,
        is_delete,
      ],
    };

    await pool.query(query);
  },

  async addReply({
    id = 'reply-123',
    owner = 'user-123',
    thread = 'thread-123',
    date = '2021-08-08T07:19:09.775Z',
    content = 'some-content',
    reply = 'comment-123',
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,$5,$6,$7)',
      values: [
        id,
        owner,
        thread,
        date,
        content,
        reply,
        is_delete,
      ],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentTabelTestHelper;
