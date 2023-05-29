import { BelongsToGetAssociationMixin, DataTypes, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Role } from './role.model';
import { Club } from '../club.model';

export class President extends Model {
    declare id: number;
    declare roleId: number;
    //get club
    declare getClub: BelongsToGetAssociationMixin<Club>;
    //get role
    declare getRole: BelongsToGetAssociationMixin<Role>;

}

//init model
President.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
},
//params
{
    sequelize,
    modelName: 'President'
});


