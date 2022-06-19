/* eslint-disable max-len */
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
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
    const createdComment = await this._commentRepository.addReply(userId, threadId, commentId, postComment);
    return new CreatedComment({ ...createdComment });
  }
}

module.exports = AddReplyUseCase;
