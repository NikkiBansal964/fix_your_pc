const manager = require('../core/db')
const States = require('../Models/states')
const Cities = require('../Models/cities')
const Districts = require('../Models/district')
const Pincodes = require('../Models/pincodes')
// const Cities = require('../Models/')


const Users = require('../Models/users')
const moment = require('moment')

module.exports = {
    async states() {
        try {
            let stateRepo = (await manager).getRepository(States)
            let states = stateRepo.find()

            return states
        } catch (e) {
            console.log(e)
            throw new Error(e.message)
        }
    },

    async cities() {
        try {
            let cityRepo = (await manager).getRepository(Cities)
            let cities = cityRepo.find()

            return cities
        } catch (e) {
            console.log(e)
            throw new Error(e.message)
        }
    },

    async districts() {
        try {
            let districtRepo = (await manager).getRepository(Districts)
            let districts = districtRepo.find()
            return districts
        } catch (e) {
            console.log(e)
            throw new Error(e.message)
        }
    },

    async pincodes() {
        try {
            let pincodeRepo = (await manager).getRepository(Pincodes)
            let pincodes = pincodeRepo.find()

            return pincodes
        } catch (e) {
            console.log(e)
            throw new Error(e.message)
        }
    },

    // async states() {
    //     try {
    //         let stateRepo = (await manager).getRepository(States)
    //         let states = stateRepo.find()

    //         return states
    //     } catch (e) {
    //         console.log(e)
    //         throw new Error(e.message)
    //     }
    // },
}