module.exports = (len) => {
    let otp = ''

    let mul = len
    for(let i = 0;i<len;i++){
        otp += i
        mul *= 10
    }
        
    otp += `${Math.round(Math.random()*mul)}`
    
    return otp.slice(0-len)
}