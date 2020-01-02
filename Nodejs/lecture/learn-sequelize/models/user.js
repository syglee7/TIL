module.exports = (sequelize, Datatypes) => {
    return sequelize.define('user' , {
        name : {
            type: Datatypes.STRING(20),
            allowNull: false,
            unique: true,
        },

        age : {
            type: Datatypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        married: {
            type: Datatypes.BOOLEAN,
            allowNull: false,
        },
        comment: {
            type : Datatypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: Datatypes.TEXT,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        },
    }, {
        timestamps : false,
        underscored: true,
    });
};