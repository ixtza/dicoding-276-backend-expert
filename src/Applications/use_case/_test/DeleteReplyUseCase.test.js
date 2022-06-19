const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const id = 'reply-123';
    const replyId = 'comment-123';

    /** creating dependency of use case */
    const mockCommentRepository = {};

    /** mocking needed function */
    mockCommentRepository.getReplyStatus = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteReply = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyUseCase.execute(id, userId, replyId, threadId);

    // Assert
    expect(mockCommentRepository.getReplyStatus).toBeCalledWith(id, threadId, replyId, userId);
    expect(mockCommentRepository.deleteReply).toBeCalledWith(id, threadId, replyId, userId);
  });
});
