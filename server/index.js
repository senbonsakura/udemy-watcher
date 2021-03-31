const express = require('express');
const cache = require('./cache')
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const app = express();
const router = express.Router();
const { getVideoDurationInSeconds } = require('get-video-duration')

const videoExtensions = ['.mp4'];
const subExtensions = ['.vtt', '.srt'];

//const [, , videoPath] = process.argv
//
function is_dir (path) {
  try {
    var stat = fs.lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false;
  }
}



async function getVideoDuration(path) {

  return await getVideoDurationInSeconds(path)

}

const sortNumerical = (a, b) => {
  const regex = /[0-9]+/m;
  return regex.exec(a) - regex.exec(b);
};

function getVideoFileList (videoFolder) {

  const unsorted_folders = fs.readdirSync(videoFolder);
  const folders = unsorted_folders.sort(sortNumerical);
  let fileList = [];
  let promises = []
  folders.forEach((item) => {
    const filePath = path.join(videoFolder, item);
    let category = {};
    let videos = [];

    if (fs.statSync(filePath).isDirectory()) {

      category.category = item;

      const files = fs.readdirSync(filePath)
        .filter(item => [...subExtensions, ...videoExtensions]
          .includes(path.extname(item).toLowerCase()))
        .sort(sortNumerical);

      const relativePath = path.join('videos', filePath.replace(videoFolder, ''));
      files.forEach((file) => {
        const extension = path.extname(file);
        let name = path.basename(file, extension);
        if (subExtensions.includes(extension)) {
          name = path.basename(file, extension).replace(/\.[a-zA-Z]{2,3}$/gm, '');
        }
        const realPath = path.join(filePath, file);
        let objIndex = videos.findIndex(item => item.name === name);
        if (objIndex === -1) {
          videos.push({name});
          objIndex = videos.length - 1;
        }
        let relativeFile = path.join(relativePath, file);
        if (videoExtensions.includes(extension.toLowerCase())) {
          videos[objIndex].file = relativeFile;
          promises.push(getVideoDuration(realPath).then(duration => {
            videos[objIndex].duration = duration;
          }))


        } else if (subExtensions.includes(extension.toLowerCase())) {
          videos[objIndex].subtitle = relativeFile;
        }


      });

    }
    if (videos.length > 0) {
      category.videos = videos;
      fileList.push(category);
    }

  });
  return new Promise(resolve => Promise.all(promises).then(()=> {
    resolve(fileList)
  }))

}

router.get('/api',cache(3600), ((req, res) => {
  const videoFolder = path.normalize(req.query.path);

  const isdir = is_dir(videoFolder);
  if (!isdir) {
    res.status(500).send('Invalid Folder');
    return;
  }

  getVideoFileList(videoFolder).then(fileList=> {
    app.use('/videos', express.static(videoFolder));
    res.send({videos: fileList});
  })


}));
app.use(router);

app.listen(4001, () => {
  // console.log(`Serving files in ${videoFolder}`);
});
