import { BelongsToGetAssociationMixin, DataTypes, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Role, RoleType } from './role.model';
import { Club } from '../club.model';

export interface PresidentInterface {
    id: number,
    roleId: number,
    type: RoleType,
    club: {
        id: number,
        nom: string
    }
}


export class President extends Model {
    declare id: number;
    declare roleId: number;
    //get club
    declare getClub: BelongsToGetAssociationMixin<Club>;
    //get role
    declare getRole: BelongsToGetAssociationMixin<Role>;

    async getPresidentInterface() {
        const _club = await this.getClub();
        const presidentInterface: PresidentInterface = {
            id: this.id,
            type: RoleType.PRESIDENT_CLUB,
            roleId: this.roleId,
            club: {
                id: _club.id,
                nom: _club.nom
            }
        }
        return presidentInterface;
    }

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


