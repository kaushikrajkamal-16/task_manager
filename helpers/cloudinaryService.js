const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async ({ mimetype, imgBuffer }) => {
  const dataUrl = `data:${mimetype};base64,${imgBuffer.toString("base64")}`;

  return await cloudinary.uploader.upload(dataUrl);
};

const destroyFromCloudinary = (url) => {
  const publicId = url.split("/").pop().split(".").shift();
  console.log(publicId);
  cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      {
        message: ("Destroy from Cloudinary", error);
      }
    }
  });
};

module.exports = { uploadToCloudinary, destroyFromCloudinary };
