import { BelongsToGetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './user.model';
import { Role } from './role/role.model';

//create user class
export class Etudiant extends Model {
    //declar params
    declare id: number;
    declare nom: string;
    declare prenom: string;
    declare cin: string;
    declare phone: string;
    declare userId: number;

    //get user
    declare getUser: BelongsToGetAssociationMixin<User>;

    //role
    declare getRoles: HasManyGetAssociationsMixin<Role>;
    declare hasRole: HasManyHasAssociationMixin<Role, number>;
    declare addRole: HasManyAddAssociationMixin<Role, number>;
}

//init model
Etudiant.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
    },
    prenom: {
        type: DataTypes.STRING
    },
    cin: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    }
},
//params
{
    sequelize,
    modelName: 'Etudiant'
});

