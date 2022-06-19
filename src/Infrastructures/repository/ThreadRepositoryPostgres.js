const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const Thread = require('../../Domains/threads/entities/Thread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, addThread) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, body, date, owner',
      values: [id, title, body, userId],
    };

    const result = await this._pool.query(query);

    return new Thread(result.rows[0]);
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
    return new Thread(result.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
