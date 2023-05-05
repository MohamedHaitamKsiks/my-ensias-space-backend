import { BelongsToGetAssociationMixin, DataTypes, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Role } from './role.model';
import { Classe } from '../classe.model';

//create user class
export class Delegue extends Model {
    declare roleId: number;
    //get classe
    declare getClasse: BelongsToGetAssociationMixin<Classe>;
    //get role
    declare getRole: BelongsToGetAssociationMixin<Role>;

}

//init model
Delegue.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
},
//params
{
    sequelize,
    modelName: 'Delegue'
});


