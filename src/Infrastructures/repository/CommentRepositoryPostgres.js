const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const Comment = require('../../Domains/comments/entities/Comment');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, threadId, postComment) {
    const { content } = postComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, owner, thread, content) VALUES ($1, $2, $3, $4) Returning id, content, owner',
      values: [id, userId, threadId, content],
    };

    const result = await this._pool.query(query);

    return new CreatedComment(result.rows[0]);
  }

  async addReply(userId, threadId, commentId, postComment) {
    const { content } = postComment;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, owner, thread, reply, content) VALUES ($1, $2, $3, $4, $5) Returning id, content, owner',
      values: [id, userId, threadId, commentId, content],
    };

    const result = await this._pool.query(query);

    return new CreatedComment(result.rows[0]);
  }

  async deleteComment(id, theadId, owner) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 AND thread = $2 AND owner = $3 RETURNING id, is_delete',
      values: [id, theadId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteReply(id, threadId, reply, owner) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 AND thread = $2 AND reply= $3 AND owner = $4 RETURNING id, is_delete',
      values: [id, threadId, reply, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return result.rows[0];
  }

  async getCommentByThreadId(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread = $1 ORDER BY date ASC',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.map((comment) => (
      new Comment({ ...comment })
    ));
  }

  async getCommentOwner(id, threadId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1 AND thread = $2 AND owner = $3',
      values: [id, threadId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return result.rows[0].owner;
  }

  async getReplyOwner(id, threadId, reply, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1 AND thread = $2 AND reply= $3 AND owner = $4',
      values: [id, threadId, reply, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return result.rows[0].owner;
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    return new Comment(result.rows[0]);
  }
}

module.exports = CommentRepositoryPostgres;
