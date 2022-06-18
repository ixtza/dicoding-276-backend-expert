const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTabelTestHelper = require('../../../../tests/CommentTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  let accessToken;
  beforeEach(async () => {
    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // get token
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const responseAuthJson = JSON.parse(responseAuth.payload);
    accessToken = responseAuthJson.data.accessToken;
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and new created comments', async () => {
      // Arrange
      const server = await createServer(container);
      userId = await UsersTableTestHelper.findIdByUsername('dicoding');
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {
          content: 'some-content',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentsId}', () => {
    it('should response 200 and seccess status', async () => {
      // Arrange
      const server = await createServer(container);

      userId = await UsersTableTestHelper.findIdByUsername('dicoding');
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentTabelTestHelper.addComment({
        id: 'comment-123',
        owner: userId,
        thread: 'thread-123',
        is_delete: false,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
      it('should response 201 and new created reply', async () => {
        // Arrange
        const server = await createServer(container);

        userId = await UsersTableTestHelper.findIdByUsername('dicoding');
        await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });
        await CommentTabelTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: userId });

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-123/comments/comment-123/replies',
          payload: {
            content: 'some-content',
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(201);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data.addedReply).toBeDefined();
      });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentsId}', () => {
      it('should response 200 and seccess status', async () => {
        // Arrange
        const server = await createServer(container);

        userId = await UsersTableTestHelper.findIdByUsername('dicoding');
        await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });
        await CommentTabelTestHelper.addComment({
          id: 'comment-123',
          owner: userId,
          thread: 'thread-123',
        });
        await CommentTabelTestHelper.addComment({
          id: 'reply-123',
          reply: 'comment-123',
          owner: userId,
        });

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
      });
    });
  });

  // describe('when GET /thread/{threadId}', () => {
  //   it('should response 200', async () => {
  //     // Arrange
  //     const server = await createServer(container);
  //     await UsersTableTestHelper.addUser({ id: 'user-123' });
  //     await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

  //     // Action
  //     const response = await server.inject({
  //       method: 'GET',
  //       url: '/threads/thread-123',
  //     });

  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(200);
  //     expect(responseJson.status).toEqual('success');
  //     expect(responseJson.data.thread).toBeDefined();
  //   });
  // });
});
