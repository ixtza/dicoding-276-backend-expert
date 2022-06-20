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
    const dataThread = await this._threadRepository.getThreadById(threadId);
    const dataComment = await this._commentRepository.getCommentByThreadId(threadId);
    const dataLike = await this._commentRepository.getLike(threadId);

    const comments = dataComment.filter((commentData) => commentData.reply == null);
    const getLikes = (commentId) => dataLike.filter((like) => like.id === commentId).map((data) => data.likes)[0];
    const getReplies = (commentId) => dataComment
      .filter((commentData) => commentData.reply === commentId)
      .map((reply) => new ReplyComment({
        ...reply,
        content: (reply.is_delete ? '**balasan telah dihapus**' : reply.content),
        username: reply.owner,
      }));

    const commentsWithReply = comments.map((comment) => new DetailsComment({
      ...comment,
      content: (comment.is_delete ? '**komentar telah dihapus**' : comment.content),
      username: comment.owner,
      likeCount: (getLikes(comment.id) ? parseInt(getLikes(comment.id), 10) : 0),
      replies: getReplies(comment.id),
    }));
    return new DetailsThread({
      ...dataThread,
      username: await this._userRepository.getUsernameById(dataThread.owner),
      comments: commentsWithReply,
    });
  }
}

module.exports = GetThreadByIdUseCase;
