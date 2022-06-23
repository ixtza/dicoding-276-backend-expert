/* eslint-disable max-len */
const PostComment = require('../../Domains/comments/entities/PostComment');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId, useCasePayload) {
    const postComment = new PostComment(useCasePayload);
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    return this._commentRepository.addReply(userId, threadId, commentId, postComment);
  }
}

module.exports = AddReplyUseCase;
