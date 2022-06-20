/* eslint-disable max-len */
const CommentTabelTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UserCommentLikeTableTestHelper = require('../../../../tests/UserCommentLikeTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const Comment = require('../../../Domains/comments/entities/Comment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTabelTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment funcion', () => {
    it('should persist add comment and return CreatedComment object correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const postComment = new PostComment({
        content: 'some-content',
      });
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ id: threadId });

      // Action
      const comment = await commentRepositoryPostgres.addComment(userId, threadId, postComment);

      // Assert
      expect(comment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: postComment.content,
        owner: userId,
      }));
      const data = await CommentTabelTestHelper.findCommentById('comment-123');
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe('comment-123');
    });
  });
  describe('addReply funcion', () => {
    it('should persist add reply and return CreatedComment object correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const postComment = new PostComment({
        content: 'some-content',
      });
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ id: threadId });
      await CommentTabelTestHelper.addComment({ id: commentId });

      // Action
      const comment = await commentRepositoryPostgres.addReply(userId, threadId, commentId, postComment);

      // Assert
      expect(comment).toStrictEqual(new CreatedComment({
        id: 'reply-123',
        content: postComment.content,
        owner: userId,
      }));
      const data = await CommentTabelTestHelper.findCommentById('reply-123');
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe('reply-123');
      expect(data[0].reply).toBe('comment-123');
      expect(data[0].thread).toBe('thread-123');
      expect(data[0].content).toBe('some-content');
    });
  });
  describe('deleteComment function', () => {
    it('should throw InvariantError when to be deleted comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment('comment-123', 'thead-123', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);

      const data = await CommentTabelTestHelper.findCommentById('comment-123');
      expect(data).toHaveLength(0);
    });
    it('should return deleted comment information', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);

      // Action
      const deleted = await commentRepositoryPostgres.deleteComment('comment-123', 'thread-123', 'user-123');

      // Assert
      expect(deleted.id).toEqual('comment-123');
      expect(deleted.is_delete).toEqual(true);

      const data = await CommentTabelTestHelper.findCommentById('comment-123');
      expect(data).toHaveLength(1);
    });
  });
  describe('deleteReply function', () => {
    it('should throw InvariantError when to be deleted reply not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteReply('reply-123', 'thread-123', 'comment-123', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
    it('should return deleted reply information', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });
      await CommentTabelTestHelper.addReply({ id: 'reply-123' });
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);

      // Action
      const deleted = await commentRepositoryPostgres.deleteReply('reply-123', 'thread-123', 'comment-123', 'user-123');

      // Assert
      expect(deleted.id).toEqual('reply-123');
      expect(deleted.is_delete).toEqual(true);

      const data = await CommentTabelTestHelper.findCommentById('reply-123');
      expect(data).toHaveLength(1);
      expect(data[0].is_delete).toBe(true);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return empty array of comment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments).toEqual([]);
    });
    it('should return array of comment object correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments).toStrictEqual([new Comment({
        id: 'comment-123',
        owner: 'dicoding',
        thread: 'thread-123',
        date: new Date('2021-08-08T07:19:09.775Z'),
        content: 'some-content',
        reply: null,
        is_delete: false,
      }),
      ]);
    });
  });
  describe('getCommentById function', () => {
    it('should return NotFoundError when comment is not found', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
    it('should return comment object correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });

      // Action
      const comments = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comments).toStrictEqual(new Comment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
        date: new Date('2021-08-08T07:19:09.775Z'),
        content: 'some-content',
        reply: null,
        is_delete: false,
      }));
    });
  });

  describe('getCommentStatus function', () => {
    it('should return NotFoundError when comment is not found', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentStatus('comment-123', 'thread-123', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
    it('should return AuthorizationError when user is not the owner', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentStatus('comment-123', 'thread-123', 'user-321'))
        .rejects
        .toThrowError(AuthorizationError);
    });
    it('should return correct comment owner', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });

      // Action
      const owner = await commentRepositoryPostgres.getCommentStatus('comment-123', 'thread-123', 'user-123');
      // Assert
      expect(owner).toEqual('user-123');
    });
  });
  describe('getReplyStatus function', () => {
    it('should return NotFoundError when comment is not found', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.getReplyStatus('reply-123', 'thread-123', 'comment-123', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
    it('should return AuthorizationError when user is not the owner', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });
      await CommentTabelTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      await expect(commentRepositoryPostgres.getReplyStatus('reply-123', 'thread-123', 'comment-123', 'user-321'))
        .rejects
        .toThrowError(AuthorizationError);
    });
    it('should return correct comment owner', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });
      await CommentTabelTestHelper.addReply({ id: 'reply-123' });

      // Action
      const owner = await commentRepositoryPostgres.getReplyStatus('reply-123', 'thread-123', 'comment-123', 'user-123');
      // Assert
      expect(owner).toEqual('user-123');
    });
  });

  describe('getLikeStatus', () => {
    it('should return false', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });

      // Action
      const result = await commentRepositoryPostgres.getLikeStatus('comment-123', 'user-123');

      // Assert
      expect(result).toBeFalsy();
    });
    it('should return true', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });
      await UserCommentLikeTableTestHelper.addLike({ comment_id: 'comment-123', user_id: 'user-123' });

      // Action
      const result = await commentRepositoryPostgres.getLikeStatus('comment-123', 'user-123');

      // Assert
      expect(result).toBeTruthy();
    });
  });
  describe('getLike', () => {
    it('should return correct value', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });
      await UserCommentLikeTableTestHelper.addLike({ comment_id: 'comment-123', user_id: 'user-123' });

      // Action
      const result = await commentRepositoryPostgres.getLike('thread-123');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('comment-123');
      expect(result[0].likes).toBe('1');
    });
  });
  describe('addLike', () => {
    it('should return correct value', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123' });

      // Action
      const result = await commentRepositoryPostgres.addLike('comment-123', 'user-123');
      // Assert
      expect(result.rows[0].id).toEqual('like-123');
    });
  });
  describe('removeLike', () => {
    it('should return correct value', async () => {
      // Arrange
      const fakerIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakerIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentTabelTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      await UserCommentLikeTableTestHelper.addLike({ comment_id: 'comment-123', user_id: 'user-123' });

      // Action
      const result = await commentRepositoryPostgres.removeLike('comment-123', 'user-123');

      // Assert
      expect(result.rows[0].id).toEqual('like-123');
    });
  });
});
