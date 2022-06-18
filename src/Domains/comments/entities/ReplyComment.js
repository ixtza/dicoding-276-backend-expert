class ReplyComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      username,
      content,
      date,
    } = payload;

    this.id = id;
    this.username = username;
    this.content = content;
    this.date = date;
  }

  _verifyPayload({
    id,
    username,
    content,
    date,
  }) {
    if (
      !id
      || !username
      || !content
      || !date
    ) {
      throw new Error('REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'object'
    ) {
      throw new Error('REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyComment;
