/* eslint-disable max-len */
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      content: 'some-content',
    };
    const expectedCreatedReply = new CreatedComment({
      id: 'reply-123',
      content: 'some-content',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = {};
    const mockThreadRepository = {};

    /** mocking needed function */
    mockCommentRepository.addReply = jest.fn(() => Promise.resolve(new CreatedComment({
      id: 'reply-123',
      content: 'some-content',
      owner: 'user-123',
    })));
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve());

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addReplyUsecase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdReply = await addReplyUsecase.execute(userId, threadId, commentId, useCasePayload);

    // Assert
    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockCommentRepository.addReply).toHaveBeenCalledWith(userId, threadId, commentId, new PostComment({
      content: useCasePayload.content,
    }));
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(commentId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
  });
});
