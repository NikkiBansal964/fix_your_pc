const typeorm = require('typeorm')
const EntitySchema = typeorm.EntitySchema;

const cities = {
    name: "cities",
    columns: {
        id: {
            "primary": true,
            "type": "int",
            "generated": true
        },

        name: {
            'type': 'varchar'
        },
        state: {
            'type': 'varchar',
        },
        city: {
            'type': 'varchar',
        },
        district: {
            'type': 'varchar',
        },
        gps: {
            'type': 'varchar',
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

module.exports = new EntitySchema(cities)