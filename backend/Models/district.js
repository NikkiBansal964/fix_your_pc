const typeorm = require('typeorm')
const EntitySchema = typeorm.EntitySchema;

const districts = {
    name: "districts",
    columns: {
        id: {
            "primary": true,
            "type": "int",
            "generated": true
        },

        name: {
            'type': 'varchar'
        },

        stateid: {
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

module.exports = new EntitySchema(districts)