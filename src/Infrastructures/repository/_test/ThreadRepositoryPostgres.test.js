const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThraed = require('../../../Domains/threads/entities/AddThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return thread object correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const addThread = new AddThraed({
        title: 'some-title',
        body: 'some-body',
      });
      const fakerIdGenerator = () => '123'; // stub object bahaviour!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: userId });

      // Action
      const thread = await threadRepositoryPostgres.addThread(userId, addThread);

      // Assert
      expect(thread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: 'some-title',
        body: 'some-body',
        date: thread.date,
        owner: 'user-123',
      }));
      const data = await ThreadTableTestHelper.getThreadsById('thread-123');
      expect(data).toHaveLength(1);
    });
  });

  describe('verifyThreadAvaibility function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvaibility('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread object correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action
      const thread = await threadRepositoryPostgres.verifyThreadAvaibility('thread-123');

      // Assert
      expect(thread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: 'some-title',
        body: 'some-body',
        date: thread.date,
        owner: 'user-123',
      }));
    });
  });
});
