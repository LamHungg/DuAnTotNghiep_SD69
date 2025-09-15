const axios = require('axios');

async function testBackend() {
    console.log('🔍 Kiểm tra Backend...\n');

    try {
        const response = await axios.get('http://localhost:8080/zmen/test');
        console.log('✅ Backend đang chạy:', response.data);
        
        try {
            const tongQuanResponse = await axios.get('http://localhost:8080/zmen/tong-quan');
            console.log('✅ Endpoint /tong-quan hoạt động');
            console.log('   Dữ liệu:', tongQuanResponse.data);
        } catch (error) {
            console.log('❌ Lỗi /tong-quan:', error.response?.status, error.response?.data || error.message);
        }
        
    } catch (error) {
        console.log('❌ Backend không chạy:', error.message);
    }
}

testBackend();
