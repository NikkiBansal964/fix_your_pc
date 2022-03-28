const manager = require("../core/db");
const Complaints = require("../Models/complaints");
const Users = require("../Models/users");
const moment = require("moment");

module.exports = {
  async complaintRecord({ sDate, eDate, userid, type = "" }) {
    try {
      const complaintRepo = (await manager).getRepository(Complaints);
      let userRepo = (await manager).getRepository(Users);
      let { type } = await userRepo
        .createQueryBuilder("u")
        .select("u.type", "type")
        .where("u.id = :id", { id: userid })
        .getRawOne();
      console.log(type);
      let compRecord = await complaintRepo
        .createQueryBuilder("c")
        .select("COUNT(IF(c.status='closed' ,1 ,null)) ", "closed")
        .addSelect("COUNT(IF(c.status='unassigned' , 1 ,null)) ", "unassigned")
        .addSelect("COUNT(IF(c.status='assigned' , 1 ,null)) ", "assigned")
        .addSelect("COUNT(IF(c.status='pending' , 1 ,null)) ", "pending")
        .addSelect("COUNT(c.id) ", "total")
        .addSelect("COUNT(IF(c.status = 'working' ,1 ,null)) ", "working")
        .andWhere(
          `c.createdbyId = ${userid} OR c.engineerid=${userid}  OR ${
            type ? `  '${type}' in ('admin' ,'helpdesk') ` : " 1=1 "
          } AND (DATE(c.createdon) BETWEEN '${moment(sDate).format(
            "YYYY-MM-DD"
          )}' AND '${moment(eDate).format("YYYY-MM-DD")}')`
        )
        // .getQuery()
        .getRawMany();
      console.log("Record", compRecord);
      let monthRecord = await this.monthlyComplaintRecord({
        sDate,
        eDate,
        userid,
      });
      let record = {};
      record.monthName = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      record.totalComplaints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (monthRecord && monthRecord.length)
        monthRecord.forEach((rec) => {
          let index = record.monthName.indexOf(rec.month.substr(0, 3));
          if (index != -1) record.totalComplaints[index] += Number(rec.total);
        });

      return { ...compRecord[0], ...record };
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  },

  async monthlyComplaintRecord({
    sDate = new Date(),
    eDate = new Date(),
    userid,
  }) {
    try {
      const complaintRepo = (await manager).getRepository(Complaints);
      let userRepo = (await manager).getRepository(Users);
      let { type } = await userRepo
        .createQueryBuilder("u")
        .select("u.type", "type")
        .where("u.id = :id", { id: userid })
        .getRawOne();
      let compRecord = await complaintRepo
        .createQueryBuilder("c")
        .select("COUNT(IF(c.status='closed' ,1 ,null)) ", "closed")
        .addSelect("COUNT(IF(c.status='unassigned' , 1 ,null)) ", "unassigned")
        .addSelect("COUNT(IF(c.status='assigned' , 1 ,null)) ", "assigned")
        .addSelect("COUNT(IF(c.status='pending' , 1 ,null)) ", "pending")

        .addSelect("COUNT(c.id) ", "total")
        .addSelect("COUNT(IF(c.status = 'working' ,1 ,null)) ", "working")
        .addSelect("MonthName(c.createdon)", "month")
        .andWhere(
          `c.createdbyId = ${userid} OR c.engineerid=${userid}  OR ${
            type ? `  '${type}' in ('admin' ,'helpdesk') ` : " 1=1 "
          } AND (DATE(c.createdon) BETWEEN '${moment(sDate).format(
            "YYYY-MM-DD"
          )}' AND '${moment(eDate).format("YYYY-MM-DD")}')`
        )
        // .groupBy(`date_format(c.createdon , '%m')`)
        .getRawMany();
      // .getQuery()

      console.log("Mont ", compRecord);
      return compRecord;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
