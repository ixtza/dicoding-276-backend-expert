/* eslint-disable camelcase */
class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      owner,
      thread,
      date,
      content,
      reply,
      is_delete,
    } = payload;

    this.id = id;
    this.owner = owner;
    this.thread = thread;
    this.date = date;
    this.content = content;
    this.reply = reply;
    this.is_delete = is_delete;
  }

  _verifyPayload({
    id,
    owner,
    thread,
    date,
    content,
    reply,
    is_delete,
  }) {
    if (
      !id
      || !owner
      || !thread
      || !date
      || !content
      || !(typeof is_delete !== 'undefined')
    ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof id !== 'string'
      || typeof owner !== 'string'
      || typeof thread !== 'string'
      || typeof date !== 'object'
      || typeof content !== 'string'
      || typeof is_delete !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (id.substr(0, 5) === 'reply' && typeof reply !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (id.substr(0, 7) === 'comment' && reply !== null) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
