const express = require('express');
const PhotosService = require('./photos-service');

const photosRouter = express.Router();

photosRouter.route('/').post((req, res, next) => {
  console.log(req.body, 'get url photo');
  const aws = require('aws-sdk');
  var s3Params = {
    Bucket: req.body.location,
    Key: req.body.name,
    ContentType: req.body.type,
  };
  aws.config = {
    accessKeyId: 'AKIAJKON4ODYPQTLBE2A',
    secretAccessKey: '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',
    region: 'us-east-2',
  };
  const s3 = new aws.S3();
  let uploadUrl = s3.getSignedUrl('putObject', s3Params);
  res.status(200).json({ url: uploadUrl });
});
photosRouter.route('/get-photo-url').post((req, res, next) => {
  console.log(req.body, 'get url photo');
  const knexInstance = req.app.get('db');
  const aws = require('aws-sdk');
  let pic = req.body.fileName;
  var s3Params = {
    Bucket: req.body.location,
    Key: pic,
    ContentType: req.body.type,
    // ResponseContentDisposition: "attachment;",
  };
  aws.config = {
    accessKeyId: 'AKIAJKON4ODYPQTLBE2A',
    secretAccessKey: '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',
    region: 'us-east-2',
  };
  const s3 = new aws.S3();
  // let uploadUrl = s3.getObject(s3Params, (error, data) => {
  //   console.log(data);

  //   res.status(200).json({ url: data });
  // });
  let uploadUrl = s3.getSignedUrl('putObject', s3Params);
  PhotosService.getAllphotos(knexInstance)
    .then((photo) => {
      res.status(200).json({ url: uploadUrl, photo });

    })
    .catch(next);

  
});
module.exports = photosRouter;
