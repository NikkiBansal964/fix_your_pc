const typeorm = require('typeorm')
const EntitySchema = typeorm.EntitySchema;
const valueTransformer = require('../utils/boolToBit')

const user = {
    name: "complaints",
    columns: {
        id: {
            "primary": true,
            "type": "int",
            "generated": true
        },
        contactpersonname: {
            "type": "varchar",
            nullable: false,
        },
        complaintno: {
            "type": "varchar",
            nullable: false,
            "unique": true
        },
        contactpersonmobile: {
            "type": "varchar",
        },
        department: {
            "type": "varchar",
        },
        status: {
            "type": "varchar",
        },
        systemtype: {
            "type": "varchar",
            nullable: false,
        },
        serialno: {
            "type": "varchar",
            nullable: false,
        },
        modelno: {
            "type": "varchar",
            nullable: false,
        },
        issue: {
            "type": "varchar",
            nullable: false,
        },
        pic: {
            "type": "longtext",
            nullable: true,
        },
        engineerid: {
            "type": "int",
            nullable: true,

        },
        allocatedby: {
            "type": "int",
            nullable: true,

        },
        createdon: {
            "type": "datetime",
            "default": () => "CURRENT_TIMESTAMP"
        },
        closedon: {
            "type": "datetime",
            nullable: true,

        },
        closedremark: {
            "type": "longtext",
            nullable: true,

        },
        workingon: {
            "type": "datetime",
            nullable: true,

        },
        workingremark: {
            "type": "longtext",
            nullable: true,

        },
        pendingon: {
            "type": "datetime",
            nullable: true,

        },
        pendingremark: {
            "type": "longtext",
            nullable: true,

        },
        reopenon: {
            "type": "datetime",
            nullable: true,

        },
        reopenremark: {
            "type": "longtext",
            nullable: true,

        },
        updatedon: {
            "type": "datetime",
            "nullable": true,
            onUpdate: "CURRENT_TIMESTAMP()"
        },
        updatedby: {
            "type": "int",
            nullable: true,
        },
    },
    relations: {
        createdby: {
            target: "users",
            type: "many-to-one",
            nullable: true,
            joinTable: true,
            cascade: true
        }
    }
}

module.exports = new EntitySchema(user)