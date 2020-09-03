const express = require('express');
const fs = require('fs');
const path = require('path')
const app = express();
const router = express.Router();

const videoFolder = process.argv.slice(2).join(" ")
console.log("videofolder", videoFolder)
router.get('/api', ((req, res) => {

  const root = path.join(videoFolder)
  const folders = fs.readdirSync(root);
  let fileList = [];

  folders.forEach((item) => {
    const filePath = path.join(root , item);
    let category = {
      category: '',
      videos: []
    };

    if (fs.statSync(filePath).isDirectory()) {
      category.category = item;

      const files = fs.readdirSync(filePath);
      files.forEach((file) => {
        const [name, extension] = [file.substr(0, file.lastIndexOf('.')), file.substr(file.lastIndexOf('.')+1)];


        if (extension === 'mp4') {

          const relativePath = path.join('videos',filePath.replace(videoFolder,''))
          const videoItem = {
            file:  path.join(relativePath, file),
            name,
            subtitle: path.join(relativePath, name) + '.vtt'
          };

          category.videos.push(videoItem);
        }
      });

    }
    fileList.push(category);
  });
  res.send({videos:fileList}

  );
}));
app.use(router);
app.use('/videos',express.static(videoFolder))
app.listen(3001, () => {
  console.log(`Serving files in ${videoFolder}`);
});
