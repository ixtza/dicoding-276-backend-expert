const AddThread = require('../../Domains/threads/entities/AddThread');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const addThread = new AddThread(useCasePayload);
    const thread = await this._threadRepository.addThread(userId, addThread);
    return new CreatedThread({ ...thread });
  }
}

module.exports = AddThreadUseCase;
