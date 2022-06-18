class DeleteReplyUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(id, userId, replyId, threadId) {
    const comment = await this._commentRepository.getCommentById(id);
    if (comment.owner !== userId) {
      throw new Error('DELETE_REPLY_USE_CASE.USER_UNAUTHORIZED');
    }
    if (comment.thread !== threadId && comment.reply !== replyId) {
      throw new Error('DELETE_REPLY_USE_CASE.INVALID_REPLY');
    }
    const result = await this._commentRepository.deleteReply(id, threadId, replyId, userId);

    return result;
  }
}

module.exports = DeleteReplyUseCase;
