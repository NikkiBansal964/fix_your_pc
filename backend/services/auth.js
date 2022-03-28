const fs = require("fs");
const User = require("../Models/users");
const manager = require("../core/db");
const crypter = require("../utils/bCrypt");
const uuid = require("uuid").v4;
const Cryptr = require("cryptr");
const cryptr = new Cryptr(fs.readFileSync("configs/key.txt", "utf8"));
const jwt = require("../utils/jwt");

module.exports = {
  async createUser({ name, mobile, password, loginid }) {
    try {
      const User = require("../Models/users");
      const userRepositery = (await manager).getRepository(User);

      let user = await userRepositery.findOne({ loginid });
      if (user) throw new Error("User already exist");
      if (!user) {
        user = {};
        user.name = name;
        user.mobile = mobile;
        user.type = "enduser";

        user.loginid = loginid || mobile;
        // user.allowedmodule = ["corporate", "individual"].includes(
        //   (type || "").toLowerCase().trim()
        // )
        //   ? "Dashboard,Compalaints-Register,Compalaints-View"
        //   : "Dashboard,Compalaints-View";

        user.password = await crypter.generateHash(password);
        console.log("user", user);
        let createdUser = await userRepositery.save(user);
        return createdUser;
      } else {
        throw new Error(`Mobile number already exist`);
      }
    } catch (e) {
      console.log(e);
      if ((e.sqlMessage || "").includes("users.IDX_1f611b37d90e889b93e9917285"))
        throw new Error("Email Id Already Exists");
      throw new Error(e.message);
    }
  },

  async getUsers() {
    try {
      const User = require("../Models/users");
      const userRepositery = (await manager).getRepository(User);
      let users = await userRepositery.find();
      return users;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async signin({ password, loginid }) {
    try {
      const userRepositery = (await manager).getRepository(User);
      console.log("Login id ", loginid);
      let user = await userRepositery.findOne({ loginid });
      console.log("user", user);
      const errorMessage = "Invalid loginid or password";
      if (user) {
        if (user.isactive == 0)
          throw new Error("You are not allowed to login please contact admin");
        let valid = await crypter.compareText(password, user.password);
        if (valid) {
          delete user.password;
          return {
            ...user,
            token: await jwt.generateJWT({
              userId: user.id,
              usertype: user.type,
            }),
          };
        } else throw new Error(errorMessage);
      } else throw new Error(errorMessage);
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async updatePassword(userId, password) {
    try {
      const User = require("../Models/users");
      const userRepositery = (await manager).getRepository(User);

      let user = {};
      user.id = userId;
      user.password = await crypter.generateHash(password);
      let suc = await userRepositery.save(user);

      if (suc) return { success: true };
      else {
        throw new Error(`Error while updating user.`);
      }
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async changePassword({ oldPassword, newPassword, userid }) {
    try {
      const User = require("../Models/users");
      const userRepositery = (await manager).getRepository(User);
      console.log({ oldPassword, newPassword, userid });
      let user = await userRepositery.findOne({ id: userid });

      if (!user) {
        throw new Error(`Invalid user.`);
      } else if (user.id != userid) {
        throw new Error(`Invalid user.`);
      } else {
        let valid = await crypter.compareText(oldPassword, user.password);
        if (valid) {
          let suc = await this.updatePassword(user.id, newPassword);
          if (suc) return { success: true };
          else {
            return { success: false };
          }
        } else {
          throw new Error(`Old password not matched`);
        }
      }
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async getUserByType(type) {
    try {
      const User = require("../Models/users");
      const userRepositery = (await manager).getRepository(User);

      let users = await userRepositery
        .createQueryBuilder()
        .where(`type IN (${type.map((t) => "'" + t + "'")}) `)
        .andWhere(`isactive=1`)
        .getMany();
      return users;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  },

  async update(user) {
    try {
      console.log(user);
      const User = require("../Models/users");
      const userRepositery = (await manager).getRepository(User);

      let users = userRepositery.save(user);
      return users;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  },
};
