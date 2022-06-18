const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'some-id',
      owner: 'some-owner',
      thread: 'some-thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-id',
      owner: 'some-owner',
      thread: 'some-thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      content: 'some-content',
      reply: [],
      is_delete: true,
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-id',
      owner: 'some-owner',
      thread: 'some-thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      content: 'some-content',
      reply: true,
      is_delete: true,
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      owner: 'some-owner',
      thread: 'some-thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      content: 'some-content',
      reply: true,
      is_delete: true,
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-id',
      owner: 'some-owner',
      thread: 'some-thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      content: 'some-content',
      reply: null,
      is_delete: true,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.owner).toEqual(payload.owner);
    expect(comment.thread).toEqual(payload.thread);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.reply).toEqual(payload.reply);
    expect(comment.is_delete).toEqual(payload.is_delete);
  });
});
