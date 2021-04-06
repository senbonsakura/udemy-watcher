const express = require('express');
const cache = require('./cache');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();
const {getVideoDurationInSeconds} = require('get-video-duration');

const videoExtensions = ['.mp4'];
const subExtensions = ['.vtt', '.srt'];

function is_dir (path) {
  try {
    var stat = fs.lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false;
  }
}

const sortNumerical = (a, b) => {
  const regex = /[0-9]+/m;
  return regex.exec(a) - regex.exec(b);
};
const getSubtitleFile = (absolutePath) => {

  const [subtitleRoot, folder, videoFile] = absolutePath;
  const name = videoFile
    .split('.').slice(0, -1).join('.');
  for (let ext of subExtensions) {
    try {
      const subtitlePath = [subtitleRoot, folder, name + ext];
      if (fs.existsSync(path.join(...subtitlePath))) {
        return subtitlePath;
      }
    } catch {

    }

  }

};

const getRelativePath = (filePath) => {
  if (filePath) {
    const [root, ...relativePath] = filePath;
    return path.join('videos', ...relativePath);
  }
};

const toVideo = async (absolutePath) => {
  const video = path.join(...absolutePath).split(path.sep).slice(-1)[0];
  const name = video.split('.').slice(0, -1).join('.');
  const file = getRelativePath(absolutePath);

  const subtitle = getRelativePath(getSubtitleFile(absolutePath));

  return {name, file, subtitle, duration: await getVideoDurationInSeconds(path.join(...absolutePath))};
};

async function getVideoFileList (rootFolder) {

  const unsorted_folders = fs.readdirSync(rootFolder);
  const folders = unsorted_folders.sort(sortNumerical);
  let fileList = [];
  let videos = [];
  for (const folder of folders) {
    const filePath = [rootFolder, folder];
    let category = {videos: []};

    if (fs.statSync(path.join(...filePath)).isDirectory()) {

      category.category = folder;

      const files = fs.readdirSync(path.join(...filePath))
        .filter(item => [...videoExtensions]
          .includes(path.extname(item).toLowerCase()))
        .sort(sortNumerical);

      for await (let video of files.map(video => toVideo([...filePath, video]))) {
        category.videos.push(video);
      }

      if (category.videos.length > 0) {

        fileList.push(category);
      }

    }

  }
  return fileList;

}

router.get('/api', cache(3600), ((req, res) => {
  const rootFolder = path.normalize(req.query.path);

  if (!is_dir(rootFolder)) {
    res.status(500).send('Invalid Folder');
    return;
  }

  app.use('/videos', express.static(rootFolder));
  getVideoFileList(rootFolder).then(videoList => {
    res.send({videos: videoList});
  });

}));
app.use(router);

app.listen(4001, () => {
  // console.log(`Serving files in ${videoFolder}`);
});
