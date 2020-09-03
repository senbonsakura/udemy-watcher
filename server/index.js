const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();

const videoExtensions = ['.mp4'];
const subExtensions = ['.vtt', '.srt'];
const videoFolder = process.argv.slice(2).join(' ');
router.get('/api', ((req, res) => {

  const root = path.join(videoFolder);
  const folders = fs.readdirSync(root);
  let fileList = [];

  folders.forEach((item) => {
    const filePath = path.join(root, item);
    let category = {};
    let videos = []
    if (fs.statSync(filePath).isDirectory()) {

      category.category = item;

      const files = fs.readdirSync(filePath).filter(item=>[...subExtensions,...videoExtensions].includes(path.extname(item).toLowerCase()));
      const relativePath = path.join('videos', filePath.replace(videoFolder, ''));
      files.forEach((file) => {
        const extension = path.extname(file);
        const name = path.basename(file, extension);
        let objIndex = videos.findIndex(item=>item.name=name)
        if (objIndex === -1) {
          videos.push({name})
          objIndex = videos.length - 1
        }
        let relativeFile = path.join(relativePath, file);
        if (videoExtensions.includes(extension.toLowerCase())) {
          videos[objIndex].file = relativeFile
        } else if (subExtensions.includes(extension.toLowerCase())) {
          videos[objIndex].subtitle = relativeFile
        }

      });

    }
    if (videos.length > 0) {
      category.videos = videos
      fileList.push(category);
    }


  });
  res.send({videos: fileList}
  );
}));
app.use(router);
app.use('/videos', express.static(videoFolder));
app.listen(3001, () => {
  console.log(`Serving files in ${videoFolder}`);
});
