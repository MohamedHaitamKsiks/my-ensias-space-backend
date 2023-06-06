import { BelongsToGetAssociationMixin, DataTypes, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Etudiant } from '../etudiant.model';
import { Delegue, DelegueInterface } from './delegue.model';
import { Classe } from '../classe.model';
import { President, PresidentInterface } from './president.model';
import { Club } from '../club.model';

export enum RoleType {
    PRESIDENT_CLUB,
    DELEGUE
}

export type RoleInterface = DelegueInterface | PresidentInterface 

//create user class
export class Role extends Model {

    declare id: number;
    declare type: RoleType;
    //get etudiant owner
    declare getEtudiant: BelongsToGetAssociationMixin<Etudiant>;

    declare getDelegue: HasOneGetAssociationMixin<Delegue>;
    declare getPresident: HasOneGetAssociationMixin<President>;

    async getRoleInterface(): Promise<RoleInterface> {
        if (this.type == RoleType.DELEGUE) {
            const delegue = await this.getDelegue();
            return await delegue.getDelegueInterface();
        }
        const president = await this.getPresident();
        return await president.getPresidentInterface();
    }
    
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

        return newDelegue;
    }
    //create president club
    static async createPresident(club: Club) {
        //create role row
        const newRole = await Role.create({
            type: RoleType.PRESIDENT_CLUB
        });

        //create delegue row
        const newPresident = await President.create({
            RoleId: newRole.id,
            ClubId: club.id
        });

        return newPresident;
    }
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


