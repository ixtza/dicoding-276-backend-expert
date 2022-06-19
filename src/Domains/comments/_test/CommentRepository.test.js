const CommentRepository = require('../CommentRepository');

describe('', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.addReply({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.deleteComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.deleteReply('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getCommentByThreadId('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getCommentStatus('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getReplyStatus('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getCommentById('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getLike('')).rejects.toThrowError('GET_LIKE.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.addLike('')).rejects.toThrowError('ADD_LIKE.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.removeLike('')).rejects.toThrowError('REMOVE_LIKE.METHOD_NOT_IMPLEMENTED');
  });
});
