/* eslint-disable max-len */
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'some-content',
    };
    const expectedCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: 'some-content',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = {};
    const mockThreadRepository = {};

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new CreatedComment({
        id: 'comment-123',
        content: 'some-content',
        owner: 'user-123',
      })));
    mockThreadRepository.verifyThreadAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUsecase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdComment = await addCommentUsecase.execute(userId, threadId, useCasePayload);

    // Assert
    expect(createdComment).toStrictEqual(expectedCreatedComment);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(userId, threadId, new PostComment({
      content: useCasePayload.content,
    }));
    expect(mockThreadRepository.verifyThreadAvaibility).toHaveBeenCalledWith(threadId);
  });
});
