import { DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';


//create user class
export class Professeur extends Model {
    //declar params
    declare id: number;
    declare nom: string;
    declare prenom: string;
    declare email: string;
    declare phone: string;
}

//init model
Professeur.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
    },
    prenom: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    }
},
//params
{
    sequelize,
    modelName: 'Professeur'
});

