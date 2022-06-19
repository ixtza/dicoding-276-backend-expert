const DetailsThread = require('../../../Domains/threads/entities/DetailsThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entities/Comment');
const DetailsComment = require('../../../Domains/comments/entities/DetailsComment');
const ReplyComment = require('../../../Domains/comments/entities/ReplyComment');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  it('should return DetailsThread correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const expectedThreadDetails = new DetailsThread({
      id: 'thread-123',
      title: 'some-title',
      body: 'some-body',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'username',
      comments: [
        new DetailsComment({
          id: 'comment-123',
          username: 'username',
          content: 'some-content',
          date: new Date('2021-08-08T07:19:09.775Z'),
          replies: [
            new ReplyComment({
              id: 'reply-123',
              username: 'username',
              content: 'some-content',
              date: new Date('2021-08-08T08:19:09.775Z'),
            }),
          ],
        }),
        new DetailsComment({
          id: 'comment-321',
          username: 'username',
          content: '**komentar telah dihapus**',
          date: new Date('2021-08-08T08:19:10.775Z'),
          replies: [
            new ReplyComment({
              id: 'reply-321',
              username: 'username',
              content: '**balasan telah dihapus**',
              date: new Date('2021-08-08T08:19:12.775Z'),
            }),
          ],
        }),
      ],
    });

    /** creating dependency of use case */
    const mockCommentRepository = {};
    const mockThreadRepository = {};
    const mockUserRepository = {};

    /** mocking needed function */
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        new Comment({
          id: 'comment-123',
          owner: 'username',
          thread: 'thread-123',
          date: new Date('2021-08-08T07:19:09.775Z'),
          content: 'some-content',
          reply: null,
          is_delete: false,
        }),
        new Comment({
          id: 'reply-123',
          owner: 'username',
          thread: 'thread-123',
          date: new Date('2021-08-08T08:19:09.775Z'),
          content: 'some-content',
          reply: 'comment-123',
          is_delete: false,
        }),
        new Comment({
          id: 'comment-321',
          owner: 'username',
          thread: 'thread-123',
          date: new Date('2021-08-08T08:19:10.775Z'),
          content: 'some-content',
          reply: null,
          is_delete: true,
        }),
        new Comment({
          id: 'reply-321',
          owner: 'username',
          thread: 'thread-123',
          date: new Date('2021-08-08T08:19:12.775Z'),
          content: 'some-content',
          reply: 'comment-321',
          is_delete: true,
        }),
      ]));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new Thread({
        id: 'thread-123',
        title: 'some-title',
        body: 'some-body',
        date: new Date('2021-08-08T07:19:09.775Z'),
        owner: 'user-123',
      })));
    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve('username'));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const createdThreadDetail = await getThreadByIdUseCase.execute(threadId);

    // Assert
    expect(createdThreadDetail).toStrictEqual(expectedThreadDetails);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockUserRepository.getUsernameById).toHaveBeenNthCalledWith(1, 'user-123');
  });
});
