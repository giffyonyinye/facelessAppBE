import { CreatePostInput } from "../validators/post";
import { Types } from 'mongoose';

interface CreatePostParams extends CreatePostInput {
  userId?: string;
  sessionId?: string;
}

export const createPostService = ({ userId, sessionId, thoughts }: CreatePostParams) => {
  const postPayload = {
    userId: userId ? new Types.ObjectId(userId) : undefined,
    sessionId: sessionId ?? undefined,
    thoughts: thoughts.map(({ thought }) => ({ thought })),
  };

  return { post: postPayload };
};
