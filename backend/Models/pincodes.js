const typeorm = require('typeorm')
const EntitySchema = typeorm.EntitySchema;

const pincodes = {
    name: "pincodes",
    columns: {
        id: {
            "primary": true,
            "type": "int",
            "generated": true
        },

        name: {
            'type': 'varchar'
        },

        districtid: {
            'type': 'int',
        },

        createdon: {
            "type": "datetime",
            "default": () => "CURRENT_TIMESTAMP"
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

module.exports = new EntitySchema(pincodes)