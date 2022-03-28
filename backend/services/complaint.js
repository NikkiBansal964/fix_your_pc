const manager = require('../core/db')
// const complaint = require('../Models/complaints')
const moment = require('moment')
const Users = require('../Models/users')

module.exports = {
    async create({ complaintno, systemtype, serialno, modelno, issue, mobile, pic, createdby, name, department, contactpersonmobile, contactpersonname }) {
        try {
            const userRepo = (await manager).getRepository(Users)
            let user = await userRepo.findOne({ id: createdby })
            if (user.type == 'engineer') throw new Error(`You are not allowed to create complaint Please contact service`)

            const status = 'unassigned'
            const Complaint = require('../Models/complaints')
            const complaintRepo = (await manager).getRepository(Complaint)

            let prevComplaint = await complaintRepo.findOne({ complaintno })
            console.log("Complaint ")
            if (!prevComplaint) {
                let today = new Date()
                let complaintNo = await this.uniqueComplaintNo()
                let comp = { complaintno: complaintNo, systemtype, serialno, modelno, issue, createdby, department, status, contactpersonmobile, contactpersonname }
                if (pic) comp.pic = pic
                let createdComplaint = await complaintRepo.save(comp)
                return createdComplaint
            }
            else {
                throw new Error(`Error while saving`)
            }
        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    async getComplaints({ userid, sDate, eDate }) {
        try {
            const Complaint = require('../Models/complaints')
            const complaintRepo = (await manager).getRepository(Complaint)
            let userRepo = (await manager).getRepository(Users)
            let { type } = await userRepo.createQueryBuilder('u').select('u.type', 'type').where('u.id = :id', { id: userid }).getRawOne()

            let complaints = await complaintRepo
                .createQueryBuilder("c")
                .leftJoinAndSelect(Users, "u", "c.createdbyId = u.id")
                .leftJoinAndSelect(Users, "engineer", "c.engineerid = engineer.id")
                .andWhere(`c.createdbyId = ${userid} OR c.engineerid=${userid}  OR ${type ? `  '${type}' in ('admin' ,'helpdesk') ` : ' 1=1 '}`)
                .andWhere(`${sDate ? ` DATE(c.createdon) >= '${moment(sDate).format('YYYY-MM-DD')}' ` : ' 1=1 '}  AND  ${eDate ? ` DATE(c.createdon) <= '${moment(eDate).format('YYYY-MM-DD')}' ` : ' 1=1 '} `)
                .orderBy('c.createdon', 'DESC')
                .getRawMany();
            // .getQuery()
            return complaints
        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    async getComplaintDetailsById({ complaintid, userid }) {
        try {
            const Complaint = require('../Models/complaints')
            const complaintRepo = (await manager).getRepository(Complaint)

            let userRepo = (await manager).getRepository(Users)
            let { type } = await userRepo.createQueryBuilder('u').select('u.type', 'type').where('u.id = :id', { id: userid }).getRawOne()

            let complaints = await complaintRepo
                .createQueryBuilder("c")
                .leftJoinAndSelect(Users, "u", "c.createdbyId = u.id")
                .leftJoinAndSelect(Users, "engineer", "c.engineerid = engineer.id")
                .andWhere(`c.id = ${complaintid} `)
                .getRawMany();
            return complaints
        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    async uniqueComplaintNo() {
        try {
            const Complaint = require('../Models/complaints')
            const complaintRepo = (await manager).getRepository(Complaint)

            let complaints = await complaintRepo.find()
            let today = new Date()
            let month = `${today.getMonth() + 1}`
            let preComplaintnos = complaints.filter(c => `${c.complaintno}`.includes(`${today.getFullYear()}${month.padStart(2, "0")}`))

            let uniqueNo = ''
            if (preComplaintnos.length) {
                let length = `${preComplaintnos.length + 1}`
                uniqueNo = `${today.getFullYear()}${month.padStart(2, '0')}${length.padStart(4, '0')}`
            }
            else uniqueNo = `${today.getFullYear()}${month.padStart(2, 0)}0001`

            return uniqueNo

        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    async allocateComplaints({ engineerid, id, allocatedby, status, remarks }) {
        try {
            const Complaint = require('../Models/complaints')
            const complaintRepo = (await manager).getRepository(Complaint)

            let complaints = await complaintRepo.createQueryBuilder()
                .update('complaints')
                .set({ engineerid, allocatedby, status })
                .where('id = :id', { id: id })
                .execute()

            return complaints

        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    async updateComplaints(comp) {
        try {
            const Complaint = require('../Models/complaints')
            const complaintRepo = (await manager).getRepository(Complaint)

            if (comp.status == 'closed') {
                comp.closedon = new Date()
                comp.reopenon = ''
            }
            if (comp.status == 'unassigned') {
                comp.closedon = new Date()
                comp.reopenon = new Date()
            }
            if (comp.status) {
                const ComplaintDetails = require('../Models/complaintDetails')
                const complaintDetailRepo = (await manager).getRepository(ComplaintDetails)
                let complaintDetails = await complaintDetailRepo.save({ compid: comp.id, status: comp.status, remarks: comp.remarks, createdby: comp.updatedby })
            }
            delete comp.remarks
            let complaints = await complaintRepo.createQueryBuilder()
                .update('complaints')
                .set(comp)
                .where('id = :id', { id: comp.id })
                .execute()
            return complaints

        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    async insertComplaintDetails({ remarks, status, compid, createdby }) {
        try {
            const ComplaintDetails = require('../Models/complaintDetails')
            const complaintDetailRepo = (await manager).getRepository(ComplaintDetails)

            let complaintDetails = await complaintDetailRepo.save({ remarks, status, compid, createdby })
            return complaintDetails
        }
        catch (e) {
            throw new Error(e.message)
        }
    },
    async getComplaintDetailsByCompid(compid) {
        try {
            const ComplaintDetails = require('../Models/complaintDetails')
            const complaintDetailRepo = (await manager).getRepository(ComplaintDetails)

            let complaintDetails = await complaintDetailRepo.createQueryBuilder('cd')
                .where(`cd.compid = ${compid}`)
                .orderBy('cd.createdon', 'DESC')
                .getRawMany()
            return complaintDetails
        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    async getCorporates() {
        try {
            const user = require('../Models/users')
            const userRepo = (await manager).getRepository(Users)

            let users = await userRepo.createQueryBuilder('u')
                .where(`u.type = 'corporate'`)
                .orderBy('u.name')
                .getRawMany()
            return users
        }
        catch (e) {
            throw new Error(e.message)
        }
    }
}
