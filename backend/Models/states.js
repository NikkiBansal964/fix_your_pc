const typeorm = require('typeorm')
const EntitySchema = typeorm.EntitySchema;

const states = {
    name: "states",
    columns: {
        id: {
            "primary": true,
            "type": "int",
            "generated": true
        },

        name: {
            'type': 'varchar'
        },

        gstcode: {
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

module.exports = new EntitySchema(states)