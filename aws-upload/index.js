const sharp = require("sharp");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = decodeURIComponent(event.Records[0].s3.object.key);
  const filename = Key.split("/").at(-1);
  const ext = Key.split(".").at(-1).toLowerCase();
  const requiredFormat = ext === "jpg" ? "jpeg" : ext;
  // sharp에서는 jpg 대신 jpeg를 사용합니다
  console.log("name", filename, "ext", ext);

  try {
    const s3Object = await s3.getObject({ Bucket, Key }); //버퍼로 가져오기
    console.log("original", s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body) //리사이징
      .resize(200, 200, { fit: "inside" })
      .toFormat(requiredFormat)
      .toBuffer();
    await s3.putObject({
      // thumb 폴더에 저장
      Bucket,
      Key: `thumb/${filename}`,
      Body: resizedImage,
    });
    console.log("put", resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.error(error);
    return callback(error);
  }
};