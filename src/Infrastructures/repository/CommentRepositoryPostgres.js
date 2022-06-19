const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
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
      text: 'SELECT comments.id, date, thread, content, reply, is_delete, users.username as owner FROM comments left join users on comments.owner = users.id WHERE comments.thread = $1 ORDER BY date ASC',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.map((comment) => (
      new Comment({ ...comment })
    ));
  }

  async getCommentStatus(id, threadId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1 AND thread = $2',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('user tidak memiliki hak akses');
    }

    return result.rows[0].owner;
  }

  async getReplyStatus(id, threadId, reply, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1 AND thread = $2 AND reply= $3',
      values: [id, threadId, reply],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('user tidak memiliki hak akses');
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

  async getLike(id) {
    const query = {
      text: `select comments.id as id, count(user_comment_likes.id) as likes 
      from comments 
      inner join user_comment_likes 
      on comments.id = user_comment_likes.comment_id 
      where comments.thread = $1
      group by comments.id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result;
  }

  async addLike(commentId, userId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO user_comment_likes (id, comment_id, user_id) VALUES ($1, $2, $3) Returning id',
      values: [id, commentId, userId],
    };

    const result = await this._pool.query(query);

    return result;
  }

  async removeLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING id',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    return result;
  }
}

module.exports = CommentRepositoryPostgres;
