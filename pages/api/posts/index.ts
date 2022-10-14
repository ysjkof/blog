import type { NextApiRequest, NextApiResponse } from 'next';
import { getMetadata, getPostFiles } from '../../../utils/posts.utils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const postFiles = getPostFiles();
  const data = getMetadata(postFiles);

  res.status(200).json(data);
}
