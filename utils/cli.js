// https://github.com/saengmotmi/my-next-blog-example/blob/main/src/utils/cli.js 참조

import fs from 'fs-extra';
import matter from 'gray-matter';
import dayjs from 'dayjs';
import inquirer from 'inquirer';
import datePrompt from 'inquirer-date-prompt';
import log from 'signale';

const prompt = inquirer.createPromptModule();
prompt.registerPrompt('date', datePrompt);

const DEST_DIR = process.cwd();
const CONTENTS_DIR = DEST_DIR + '/_pre_release';

// TODO: 태그 선택지 만들기
const getTags = () => {};

const processAnswers = async ({ title, timestamp }) => {
  const createContentsDir = () => fs.ensureDir(CONTENTS_DIR);
  const isDestDirExists = await fs.pathExists(CONTENTS_DIR);
  const isDestContentExist = await fs.pathExists(`${CONTENTS_DIR}/${title}.md`);

  if (!isDestDirExists) {
    await createContentsDir();
  }

  if (isDestContentExist) {
    log.error(`${title}.md already exists.`);
    return;
  }

  createPost({ title, timestamp });
};

const createPost = async ({ title, timestamp }) => {
  const refineMetaData = (rawData) =>
    matter.stringify('', rawData).split("'").join('');

  const meta = refineMetaData({
    title,
    description: '',
    categories: [],
    tags: [],
    timestamp,
    publishedDate: '',
    lastModifiedAt: '',
  });

  fs.writeFile(`${CONTENTS_DIR}/${title}.md`, meta, (err) => {
    if (err) {
      log.error('Unknown Error: Cannot write file!', err);
      return;
    }

    log.success('Success to create new post!');
    log.note(`${CONTENTS_DIR}/${title}.md\n${meta}`);
  });
};

const questions = [
  {
    type: 'input',
    name: 'title',
    message: '포스트 제목을 입력해주세요',
    validate: (title) => title.length > 0,
  },
  {
    type: 'date',
    name: 'timestamp',
    message: '포스트 작성 시각을 입력해주세요',
    locale: 'ko-KR',
    format: { month: 'short', hour: undefined, minute: undefined },
    filter: (d) => dayjs(d).format('YYYY/MM/DD'),
    default: new Date(),
    clearable: true,
  },
];

const execute = () => prompt(questions).then(processAnswers);

execute();
