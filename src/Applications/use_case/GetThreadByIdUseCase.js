/* eslint-disable indent */
/* eslint-disable max-len */
const DetailsThread = require('../../Domains/threads/entities/DetailsThread');
// const Thread = require('../../Domains/threads/entities/Thread');
// const Comment = require('../../Domains/comments/entities/Comment');
const DetailsComment = require('../../Domains/comments/entities/DetailsComment');
const ReplyComment = require('../../Domains/comments/entities/ReplyComment');

class GetThreadByIdUseCase {
  constructor({
    commentRepository,
    threadRepository,
    userRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(threadId) {
    const dataThread = await this._threadRepository.verifyThreadAvaibility(threadId);
    const dataComment = await this._commentRepository.getCommentByThreadId(threadId);
    const correctComment = await Promise.all(dataComment.filter((commentData) => commentData.reply == null).map(async (comment) => new DetailsComment({
        ...comment,
        content: (comment.is_delete ? '**komentar telah dihapus**' : comment.content),
        username: await this._userRepository.getUsernameById(comment.owner),
        replies: await Promise.all(dataComment.filter((commentData) => commentData.reply === comment.id).map(async (reply) => new ReplyComment({
          ...reply,
          content: (reply.is_delete ? '**balasan telah dihapus**' : reply.content),
          username: await this._userRepository.getUsernameById(reply.owner),
        }))),
      })));
    return new DetailsThread({
      ...dataThread,
      username: await this._userRepository.getUsernameById(dataThread.owner),
      comments: correctComment,
    });
  }
}

module.exports = GetThreadByIdUseCase;
