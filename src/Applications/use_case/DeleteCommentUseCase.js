class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(id, userId, threadId) {
    await this._commentRepository.getCommentStatus(id, threadId, userId);
    await this._commentRepository.deleteComment(id, threadId, userId);
  }
}

module.exports = DeleteCommentUseCase;
