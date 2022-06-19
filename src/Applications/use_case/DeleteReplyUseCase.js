class DeleteReplyUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(id, userId, replyId, threadId) {
    await this._commentRepository.getReplyStatus(id, threadId, replyId, userId);
    await this._commentRepository.deleteReply(id, threadId, replyId, userId);
  }
}

module.exports = DeleteReplyUseCase;
