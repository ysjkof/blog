import { PostMetadata } from '../models/post.model';

type ArrayOfString = string[];
type SpreadKey = keyof Pick<PostMetadata, 'categories' | 'tags'>;

function spreadArray(data: PostMetadata[], key: SpreadKey) {
  const initialTags: string[] = [];
  return data.reduce((prev, cur) => [...prev, ...cur[key]], initialTags);
}

function addCountInValue(
  duplicatedTags: ArrayOfString,
  uniqueValue: ArrayOfString
) {
  return uniqueValue.map((value) => {
    const count = duplicatedTags.filter((_value) => _value === value).length;
    return { name: value, count };
  });
}

export function getUniqueValue(data: PostMetadata[], key: SpreadKey) {
  const duplicatedValue = spreadArray(data, key);
  const uniqueValue = duplicatedValue.filter(
    (tag, index) => duplicatedValue.indexOf(tag) === index
  );
  const uniqueValueWithCount = addCountInValue(duplicatedValue, uniqueValue);
  return uniqueValueWithCount;
}
