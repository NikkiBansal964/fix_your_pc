module.exports = (res , {statusCode , message , data }) => {
        if(!statusCode) {
            res.statusMessage = `Invalid response parameters`
            res.statusCode = 500
            res.send()
            return
        } 

        res.statusCode = statusCode
        if(message)
            res.statusMessage = message
        
        if(Array.isArray(data))
            res.send(data)
        else 
            res.send(data?[data]:[{message}])    
}