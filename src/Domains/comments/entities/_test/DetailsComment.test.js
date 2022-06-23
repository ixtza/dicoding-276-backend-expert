const DetailsComment = require('../DetailsComment');

describe('a DetailsComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'some-id',
      content: 'some-content',
    };
    // Action and Assert
    expect(() => new DetailsComment(payload)).toThrowError('DETAILS_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'asdas',
      username: ['true'],
      content: 'benar',
      date: 321,
      replies: true,
      likeCount: true,
    };
    // Action and Assert
    expect(() => new DetailsComment(payload)).toThrowError('DETAILS_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create DetailsComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'some-id',
      username: 'some-username',
      content: 'some-content',
      date: new Date('2021-08-08T07:19:09.775Z'),
      replies: ['some-array'],
      likeCount: 1,
    };

    // Action
    const detailsComment = new DetailsComment(payload);

    // Assert
    expect(detailsComment.id).toEqual(payload.id);
    expect(detailsComment.username).toEqual(payload.username);
    expect(detailsComment.content).toEqual(payload.content);
    expect(detailsComment.date).toEqual(payload.date);
    expect(detailsComment.replies).toEqual(payload.replies);
  });
});
