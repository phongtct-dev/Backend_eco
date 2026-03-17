const {createHmac} = require('crypto');// Import hàm tạo HMAC từ thư viện crypto
const {hash, compare} = require('bcryptjs')//Import hàm hash và compare từ thư viện bcryptjs


exports.doHash = (value, saltValue) => {// Hàm tạo hash
    const result = hash(value,saltValue);//So sánh password với hash
    return result;// Trả về chuỗi hash
}


exports.doHashValidation = (value, hashedValue) => {//kiểm tra mật khẩu với hash
    const result = compare(value,hashedValue);
    return result;//Trả về true/false
}

exports.hmacProcess = (value,key) =>{// Hàm tạo HMAC với thuật toán SHA-256
    const result = createHmac("sha256",key)
    .update(value)
    .digest("hex")// Xuất kết quả dưới dạng chuỗi hex
    return result// Trả về chuỗi HMAC
}