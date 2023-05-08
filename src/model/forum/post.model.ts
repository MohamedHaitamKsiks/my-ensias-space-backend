import { DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';


//create user class
export class Poste extends Model {
    //data
    declare id: number;
    declare texte: string;
    
}

//init model
Poste.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    texte: {
        type: DataTypes.STRING,
    }
},
//params
{
    sequelize,
    modelName: 'Poste'
});

