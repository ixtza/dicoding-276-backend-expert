class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(id, userId, threadId) {
    const comment = await this._commentRepository.getCommentById(id);
    if (comment.owner !== userId) {
      throw new Error('DELETE_COMMENT_USE_CASE.USER_UNAUTHORIZED');
    }
    if (comment.thread !== threadId) {
      throw new Error('DELETE_COMMENT_USE_CASE.INVALID_COMMENT');
    }
    const result = await this._commentRepository.deleteComment(id, threadId, userId);

    return result;
  }
}

module.exports = DeleteCommentUseCase;
