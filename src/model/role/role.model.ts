import { BelongsToGetAssociationMixin, DataTypes, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Etudiant } from '../etudiant.model';
import { Delegue } from './delegue.model';
import { Classe } from '../classe.model';

export enum RoleType {
    PRESIDENT_CLUB,
    DELEGUE
}

//create user class
export class Role extends Model {
    declare id: number;
    declare type: RoleType;
    //get etudiant owner
    declare getEtudiant: BelongsToGetAssociationMixin<Etudiant>;
    //get delegue
    declare getDelegue: HasOneGetAssociationMixin<Delegue>;
    //create delegue
    static async createDelegue(classe: Classe) {
        //create role row
        const newRole = await Role.create({
            type: RoleType.DELEGUE
        });
        
        //create delegue row
        const newDelegue = await Delegue.create({
            RoleId: newRole.id,
            ClasseId: classe.id
        });

        console.log('new role: ', newRole.id);
        console.log('new delegue: ', newDelegue.getDataValue('id'));
        return newDelegue;
    }
    //create president club
}


//init model
Role.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},
//params
{
    sequelize,
    modelName: 'Role'
});


