const cloudinary = require("cloudinary").v2;

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: "de6pz8har",
    api_key: "299241471366287",
    api_secret: "8L4P3p4zYoQ7KMc2V0bQ3TpAobE",
  });
};

module.exports = cloudinaryConfig;
