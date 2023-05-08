import { DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';


export enum Permission {
    NONE = 0,
    LIRE = 1,
    ECRIRE = 2,
    ADMIN = 4
};


//create user class
export class Acces extends Model {
    //data
    declare id: number;
    declare permission: Permission;

    //get acces
    isAdmin() {
        return (this.permission & Permission.ADMIN) != 0;
    }
    canRead() {
        return (this.permission & Permission.LIRE) != 0 || this.isAdmin();
    }
    canWrite() {
        return (this.permission & Permission.ECRIRE) != 0 || this.isAdmin();
    }
}

//init model
Acces.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    permission: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
//params
{
    sequelize,
    modelName: 'Acces'
});

