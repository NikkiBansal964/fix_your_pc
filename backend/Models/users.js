const typeorm = require("typeorm");
const EntitySchema = typeorm.EntitySchema;
const valueTransformer = require("../utils/boolToBit");

const user = {
  name: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
      // "unique": true
    },
    loginid: {
      type: "varchar",
    },
    mobile: {
      type: "varchar",
      unique: true,
    },
    allowedmodule: {
      type: "longtext",
      nullable: true,

      //   "unique": true
    },

    type: {
      type: "varchar",
    },
    isactive: {
      type: "int",
      default: 1,
    },
    createdon: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
    },
    password: {
      type: "varchar",
    },
    updatedon: {
      type: "datetime",
      nullable: true,
      onUpdate: "CURRENT_TIMESTAMP()",
    },
  },
  relations: {
    createdby: {
      target: "users",
      type: "many-to-one",
      nullable: true,
      joinTable: true,
      cascade: true,
    },
  },
};

module.exports = new EntitySchema(user);
