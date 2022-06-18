const DetailsThread = require('../DetailsThread');

describe('a DetailsThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'some-title',
      body: 'some-body',
      date: 'some-date',
      username: 'some-username',
      comments: ['some-name'],
    };

    // Action and Assert
    expect(() => new DetailsThread(payload)).toThrowError('DETAILS_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'some-body',
      title: 123,
      body: 321,
      date: 123,
      username: [],
      comments: 'some-body',
    };

    // Action and Assert
    expect(() => new DetailsThread(payload)).toThrowError('DETAILS_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create DetailsThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'some-id',
      title: 'some-title',
      body: 'some-body',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'some-username',
      comments: ['some-comments'],
    };

    // Action
    const detailsThread = new DetailsThread(payload);

    // Assert
    expect(detailsThread.id).toEqual(payload.id);
    expect(detailsThread.title).toEqual(payload.title);
    expect(detailsThread.body).toEqual(payload.body);
    expect(detailsThread.date).toEqual(payload.date);
    expect(detailsThread.username).toEqual(payload.username);
    expect(detailsThread.comments).toEqual(payload.comments);
  });
});
