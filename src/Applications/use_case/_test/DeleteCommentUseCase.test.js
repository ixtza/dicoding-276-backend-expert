const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const id = 'comment-123';

    /** creating dependency of use case */
    const mockCommentRepository = {};

    /** mocking needed function */
    mockCommentRepository.getCommentStatus = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentReplyUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentReplyUseCase.execute(id, userId, threadId);

    // Assert
    expect(mockCommentRepository.getCommentStatus).toBeCalledWith(id, threadId, userId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(id, threadId, userId);
  });
});
