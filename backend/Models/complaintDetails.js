const typeorm = require('typeorm')
const EntitySchema = typeorm.EntitySchema;
const valueTransformer = require('../utils/boolToBit')

const user = {
    name: "complaintdatails",
    columns: {
        id: {
            "primary": true,
            "type": "int",
            "generated": true
        },

        compid: {
            "type": "int",
        },

        status: {
            "type": "varchar",
        },
        remarks: {
            "type": "longtext",
        },
        createdby: {
            "type": "int",
        },
        createdon: {
            "type": "datetime",
            "default": () => "CURRENT_TIMESTAMP"
        }
    },
    // relations: {
    //     compid: {
    //         target: "complaints",
    //         type: "one-to-many",
    //         nullable: true,
    //         joinTable: true,
    //     }
    // }
}

module.exports = new EntitySchema(user)