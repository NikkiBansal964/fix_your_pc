const fs = require('fs')
const apiKeys = JSON.parse(fs.readFileSync('./configs/apikey.txt','utf8').replace('\n',''))
const axios = require('axios')
const manager = require('../core/connect-db')
const userTransaction =  require('../Models/usertransactions')

const pullEthTransaction = async (address) => {
    try {
        let resp = await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKeys.eth}`)
        return { data :  resp.data.result , message : resp.data.message }   
    }catch(e){
        throw new Error(e.message)
    }
}

const pullBscTransaction = async (address) => {
    try {
        let resp =  await axios.get(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${apiKeys.bsc}`)
        return { data :  resp.data.result , message : resp.data.message }   
    }catch(e){
        throw new Error(e.message)
    }
}


const saveTransaction = async (userId , newData ,type) => {
    const transRepo = (await manager).getRepository(userTransaction)

    let data = await transRepo.find({user : userId })
    console.log(data.length)

    let hashs = data.map(item => item.hash)
    if(typeof newData == 'string')
            return 
    let insertData = newData.filter(item => !hashs.includes(item.hash) && item.isError == "0" )

    insertData.forEach(item => {
            item.user = userId
            item.txtype = type
    });
    if(insertData.length)
        await  (await manager).getRepository('usertransactions')
                                .createQueryBuilder()
                                .insert()
                                .into("usertransactions")
                                .values(insertData).execute()
    return
}

module.exports  = async (userId,address,isCallFromCron) => {
    const Logs = require('../Models/logs')
    const logRepo = (await manager).getRepository(Logs)
    let newLog = await logRepo.save({ user : userId , cron : isCallFromCron  })

    try {
        let t1 = await pullEthTransaction(address)
        let t2 = await pullBscTransaction(address)

        if(t1.data.length)
            await saveTransaction(userId , t1.data,'eth')
        if(t2.data.length)    
            await saveTransaction(userId,t2.data,'bsc')

        let log = {
            id : newLog.id ,
            ethmsg:  t1.message ,
            bscmsg : t2.message ,
            ethcount : t1.data.length ,
            bsccount : t2.data.length
        }
        
        await logRepo.save(log)
        
        return [...t1.data,...t2.data]
    } catch(e){
        
        let log = {
            id : newLog.id ,
            'error' : e.message
        }
        await logRepo.save(log)
        throw new Error(e.message)
    }
}