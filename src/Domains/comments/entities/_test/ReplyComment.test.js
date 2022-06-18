const ReplyComment = require('../ReplyComment');

describe('a RepliesComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'some-id',
      content: 'some-content',
    };
    // Action and Assert
    expect(() => new ReplyComment(payload)).toThrowError('REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'asdas',
      username: ['true'],
      date: 321,
      content: 'benar',
    };
    // Action and Assert
    expect(() => new ReplyComment(payload)).toThrowError('REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create RepliesComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'some-id',
      username: 'some-username',
      date: new Date('2021-08-08T07:19:09.775Z'),
      content: 'some-content',
    };

    // Action
    const replyComment = new ReplyComment(payload);

    // Assert
    expect(replyComment.id).toEqual(payload.id);
    expect(replyComment.username).toEqual(payload.username);
    expect(replyComment.date).toEqual(payload.date);
    expect(replyComment.content).toEqual(payload.content);
  });
});
