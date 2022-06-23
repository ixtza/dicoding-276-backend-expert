const LikeUnlikeCommentUseCase = require('../LikeUnlikeCommentUseCase');

describe('LikeUnlikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    /** creating dependency of use case */
    const mockCommentRepository = {};
    const mockThreadRepository = {};

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'some-title',
      body: 'some-body',
      date: new Date('2021-08-08T07:19:09.775Z'),
      owner: 'user-123',
    }));
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve({
      id: 'comment-123',
      owner: 'username',
      thread: 'thread-123',
      date: new Date('2021-08-08T07:19:09.775Z'),
      content: 'some-content',
      reply: null,
      is_delete: false,
    }));
    mockCommentRepository.getLikeStatus = jest.fn(() => Promise.resolve((false)));
    mockCommentRepository.addLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUnlikeCommentUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.getLikeStatus).toHaveBeenCalledWith(commentId, userId);
    expect(mockCommentRepository.addLike).toHaveBeenCalledWith(commentId, userId);
  });
  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    /** creating dependency of use case */
    const mockCommentRepository = {};
    const mockThreadRepository = {};

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'some-title',
      body: 'some-body',
      date: new Date('2021-08-08T07:19:09.775Z'),
      owner: 'user-123',
    }));
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve({
      id: 'comment-123',
      owner: 'username',
      thread: 'thread-123',
      date: new Date('2021-08-08T07:19:09.775Z'),
      content: 'some-content',
      reply: null,
      is_delete: false,
    }));
    mockCommentRepository.getLikeStatus = jest.fn(() => Promise.resolve((true)));
    mockCommentRepository.removeLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUnlikeCommentUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.getLikeStatus).toHaveBeenCalledWith(commentId, userId);
    expect(mockCommentRepository.removeLike).toHaveBeenCalledWith(commentId, userId);
  });
});
