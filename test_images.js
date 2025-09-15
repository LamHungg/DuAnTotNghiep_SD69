// Test script để kiểm tra hình ảnh sản phẩm
const axios = require("axios");

async function testImages() {
  try {
    console.log("Testing images endpoint...");
    const response = await axios.get(
      "http://localhost:8080/api/pos/test-images"
    );
    console.log("Response:", response.data);

    if (response.data.totalImages > 0) {
      console.log(`Found ${response.data.totalImages} images in database`);
      response.data.images.forEach((img, index) => {
        console.log(
          `${index + 1}. Product: ${img.sanPhamName} (ID: ${img.sanPhamId})`
        );
        console.log(`   URL: ${img.url}`);
        console.log(`   Is Thumbnail: ${img.isThumbnail}`);
        console.log("---");
      });
    } else {
      console.log("No images found in database");
    }
  } catch (error) {
    console.error(
      "Error testing images:",
      error.response?.data || error.message
    );
  }
}

testImages();
