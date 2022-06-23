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
    this.likeCount = likeCount;
    this.replies = replies;
  }

  _verifyPayload({
    id,
    username,
    content,
    date,
    replies,
    likeCount,
  }) {
    if (
      !id
      || !username
      || !content
      || !date
      || !replies
      || (typeof likeCount === 'undefined')
    ) {
      throw new Error('DETAILS_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'object'
      || typeof likeCount !== 'number'
      || Array.isArray(replies) !== true
    ) {
      throw new Error('DETAILS_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailsComment;
