import { BelongsToGetAssociationMixin, DataTypes, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Role, RoleType } from './role.model';
import { Classe } from '../classe.model';


export interface DelegueInterface {
    id: number,
    roleId: number,
    type: RoleType,
    classe: {
        id: number,
        nom: string
    }
};

//create user class
export class Delegue extends Model {
    declare id: number;
    declare roleId: number;
    //get classe
    declare getClasse: BelongsToGetAssociationMixin<Classe>;
    //get role
    declare getRole: BelongsToGetAssociationMixin<Role>;
    
    async getDelegueInterface() {
        const classe = await this.getClasse();

        const delegueInterface: DelegueInterface = {
            id: this.id,
            roleId: this.roleId,
            type: RoleType.DELEGUE,
            classe: {
                id: classe.id,
                nom: classe.nom
            }
        }

        return delegueInterface;
    }
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


