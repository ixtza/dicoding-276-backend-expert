// const CommentRepository = require("../../../Domains/comments/CommentRepository");
// const DeleteCommentUseCase = require("../DeleteReplyCommentUseCase");

const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if the user is not the comment owner', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const id = 'comment-123';
    const expectedComment = {
      id: 'comment-123',
      owner: 'user-321',
      thread: 'thread-123',
      date: new Date('2021-08-08T00:19:09.775Z'),
      content: 'some-content',
      reply: null,
      is_delete: false,
    };

    /** creating dependency of use case */
    const mockCommentRepository = {};

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    /** creating use case instance */
    const deleteCommentReplyUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentReplyUseCase.execute(id, userId, threadId))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.USER_UNAUTHORIZED');
    expect(mockCommentRepository.getCommentById).toBeCalledWith(id);
  });

  it('should throw error if the thread is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const id = 'comment-123';
    const expectedComment = {
      id: 'comment-123',
      owner: 'user-123',
      thread: 'thread-321',
      date: new Date('2021-08-08T00:19:09.775Z'),
      content: 'some-content',
      reply: null,
      is_delete: false,
    };

    /** creating dependency of use case */
    const mockCommentRepository = {};

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    /** creating use case instance */
    const deleteCommentReplyUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentReplyUseCase.execute(id, userId, threadId))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.INVALID_COMMENT');
    expect(mockCommentRepository.getCommentById).toBeCalledWith(id);
  });

  it('should return expected result', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const id = 'comment-123';
    const expectedResult = {
      id: 'comment-123',
      is_delete: true,
    };

    /** creating dependency of use case */
    const mockCommentRepository = {};

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
        date: new Date('2021-08-08T00:19:09.775Z'),
        content: 'some-content',
        reply: null,
        is_delete: false,
      }));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123',
        is_delete: true,
      }));

    /** creating use case instance */
    const deleteCommentReplyUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await deleteCommentReplyUseCase.execute(id, userId, threadId);

    // Assert
    expect(result).toStrictEqual(expectedResult);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(id);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(id, threadId, userId);
  });
});
