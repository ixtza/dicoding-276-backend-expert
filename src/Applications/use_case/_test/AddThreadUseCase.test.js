const AddThread = require('../../../Domains/threads/entities/AddThread');
const CreatedThraed = require('../../../Domains/threads/entities/CraetedThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correcty', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'some-title',
      body: 'some-body',
    };
    const expectedCreatedThread = new CreatedThraed({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = {};

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new Thread({
        id: 'thread-123',
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: userId,
        date: new Date('2021-08-08T07:19:09.775Z'),
      })));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await addThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(userId, new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
