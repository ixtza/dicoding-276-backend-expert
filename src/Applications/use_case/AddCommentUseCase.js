const PostComment = require('../../Domains/comments/entities/PostComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    const postComment = new PostComment(useCasePayload);
    await this._threadRepository.getThreadById(threadId);
    return this._commentRepository.addComment(userId, threadId, postComment);
  }
}

module.exports = AddCommentUseCase;
