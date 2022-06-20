class DetailsComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      username,
      content,
      date,
      likeCount,
      replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.content = content;
    this.date = date;
    this.likeCount = likeCount === undefined ? 0 : likeCount;
    this.replies = replies;
  }

  _verifyPayload({
    id,
    username,
    content,
    date,
    replies,
  }) {
    if (
      !id
      || !username
      || !content
      || !date
      || !replies
    ) {
      throw new Error('DETAILS_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'object'
      || Array.isArray(replies) !== true
    ) {
      throw new Error('DETAILS_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailsComment;
