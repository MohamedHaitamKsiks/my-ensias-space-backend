import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationMixin, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Etudiant } from './etudiant.model';
import { President } from './role/president.model';


//create club
export class Club extends Model {
    //declar params
    declare id: number;
    declare name: string;
    declare description: string;

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
    path: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
//params
{
    sequelize,
    modelName: 'Club'
});

