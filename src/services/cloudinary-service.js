const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'sample', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

exports.upload = () => {
    cloudinary.uploader.upload("my_image.jpg", (error, result) => {
        console.log(result, error)
    });
}