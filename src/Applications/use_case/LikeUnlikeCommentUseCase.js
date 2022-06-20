class LikeUnlikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);

    switch (await this._commentRepository.getLikeStatus(commentId, userId)) {
      case false:
        await this._commentRepository.addLike(commentId, userId);
        break;
      default:
        await this._commentRepository.removeLike(commentId, userId);
        break;
    }
  }
}

module.exports = LikeUnlikeCommentUseCase;
