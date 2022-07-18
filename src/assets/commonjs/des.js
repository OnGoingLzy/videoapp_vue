import cryptoJs from 'crypto-js'
export default {
    /*
* message:需要加密的字符串，对象加密需要转成json字符串
* key： 密钥（加密解密密钥同一个）
*/
    encryptDes : function (message, key = '51522zzwlwlbb') {
        const keyHex = cryptoJs.enc.Utf8.parse(key)
        const option = { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 }
        const encrypted = cryptoJs.DES.encrypt(message, keyHex, option)
        return encrypted.ciphertext.toString() // 返回hex格式密文，如需返回base64格式：encrypted.toString()
    },
    /*
* message:需要解密的字符串，
* key： 密钥（加密解密密钥同一个）
*/
    decryptDes : function (message, key = '51522zzwlwlbb') {
        const keyHex = cryptoJs.enc.Utf8.parse(key)
        const decrypted = cryptoJs.DES.decrypt(
            {
                ciphertext: cryptoJs.enc.Hex.parse(message)
            },// 若message是base64格式，则无需转16进制hex，直接传入message即可
            keyHex,
            {
                mode: cryptoJs.mode.ECB,
                padding: cryptoJs.pad.Pkcs7
            }
        )
        return decrypted.toString(cryptoJs.enc.Utf8)
    }

}
