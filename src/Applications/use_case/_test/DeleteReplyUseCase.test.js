const Comment = require('../../../Domains/comments/entities/Comment');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if the user is not the reply owner', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const id = 'reply-123';
    const replyId = 'comment-123';

    /** creating dependency of use case */
    const mockCommentRepository = {};

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(new Comment({
        id: 'reply-123',
        owner: 'user-321',
        thread: 'thread-123',
        date: new Date('2021-08-08T00:19:09.775Z'),
        content: 'some-content',
        reply: 'comment-123',
        is_delete: false,
      })));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(id, userId, replyId, threadId))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.USER_UNAUTHORIZED');
    expect(mockCommentRepository.getCommentById).toBeCalledWith(id);
  });

  it('should throw error if the thread or comment is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const id = 'reply-123';
    const replyId = 'comment-123';

    /** creating dependency of use case */
    const mockCommentRepository = {};

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(new Comment({
        id: 'reply-123',
        owner: 'user-123',
        thread: 'thread-321',
        date: new Date('2021-08-08T00:19:09.775Z'),
        content: 'some-content',
        reply: 'comment-321',
        is_delete: false,
      })));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(id, userId, replyId, threadId))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.INVALID_REPLY');
    expect(mockCommentRepository.getCommentById).toBeCalledWith(id);
  });

  it('should return expected result', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const id = 'reply-123';
    const replyId = 'comment-123';

    /** creating dependency of use case */
    const mockCommentRepository = {};

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(new Comment({
        id: 'reply-123',
        owner: 'user-123',
        thread: 'thread-123',
        date: new Date('2021-08-08T00:19:09.775Z'),
        content: 'some-content',
        reply: 'comment-123',
        is_delete: false,
      })));
    mockCommentRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        is_delete: true,
      }));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await deleteReplyUseCase.execute(id, userId, replyId, threadId);

    // Assert
    expect(result).toStrictEqual({
      id: 'reply-123',
      is_delete: true,
    });
    expect(mockCommentRepository.getCommentById).toBeCalledWith(id);
    expect(mockCommentRepository.deleteReply).toBeCalledWith(id, threadId, replyId, userId);
  });
});
