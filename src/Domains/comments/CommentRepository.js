/* eslint-disable no-unused-vars */

class CommentRepository {
  async addComment(userId, threadId, comment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addReply(userId, threadId, commentId, comment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteComment(id, theadId, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(id, threadId, reply, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentByThreadId(threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentStatus(id, theadId, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getReplyStatus(id, threadId, reply, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentById(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLike(threadId) {
    throw new Error('GET_LIKE.METHOD_NOT_IMPLEMENTED');
  }

  async addLike(commentId, userId) {
    throw new Error('ADD_LIKE.METHOD_NOT_IMPLEMENTED');
  }

  async removeLike(commentId, userId) {
    throw new Error('REMOVE_LIKE.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
