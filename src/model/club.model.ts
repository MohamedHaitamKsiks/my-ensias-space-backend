import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationMixin, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Etudiant, EtudiantInterface } from './etudiant.model';
import { President } from './role/president.model';


export interface ClubInterface {
    id: number,
    nom: string,
    description: string,
    president?: EtudiantInterface
};

//create club
export class Club extends Model {
    //declar params
    declare id: number;
    declare nom: string;
    declare description: string;

    async getClubInterface() {
        const clubInterface: ClubInterface = {
            id: this.id,
            nom: this.nom,
            description: this.description,
            president: await (await ((await (await this.getPresident()).getRole()).getEtudiant())).getEtudiantInterface()
        }
        return clubInterface;
    }

    //get president
    //...
    declare setPresident: HasOneSetAssociationMixin<President, number>;
    declare getPresident: HasOneGetAssociationMixin<President>;

    //get members
    declare getMembers: BelongsToManyGetAssociationsMixin<Etudiant>;
    declare addMember: BelongsToManyAddAssociationMixin<Etudiant, number>;
    declare removeMember: BelongsToManyRemoveAssociationMixin<Etudiant, number>;

}

//init model
Club.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    }
},
//params
{
    sequelize,
    modelName: 'Club'
});

Club.afterCreate((instance: Club) => {
    
});