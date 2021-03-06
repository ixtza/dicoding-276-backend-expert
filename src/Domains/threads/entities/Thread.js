class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, date, owner,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.owner = owner;
  }

  _verifyPayload({
    id, title, body, date, owner,
  }) {
    if (!id || !title || !date || !body || !owner) {
      throw new Error('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'object' || typeof owner !== 'string') {
      throw new Error('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
