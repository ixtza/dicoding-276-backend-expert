const PostComment = require('../PostComment');

describe('a PostComment entities', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      body: 'sebuah comment',
    };

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: ['someone'],
    };
    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('it should create PostThread object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
    };
    // Action
    const { content } = new PostComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
