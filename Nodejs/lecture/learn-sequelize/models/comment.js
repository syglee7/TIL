module.exports = (sequelize, Datatypes) => {
    return sequelize.define('comment' , {
        comment: {
            type: Datatypes.STRING(100),
            allowNull: false,
        },
        created_at: {
            type: Datatypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),

        }
    },{
        timestamps: false,
        underscored: true,
    });
};