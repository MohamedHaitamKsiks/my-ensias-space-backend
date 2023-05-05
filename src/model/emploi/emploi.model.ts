import { DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';


//create user class
export class Emploi extends Model {
    //data
    declare id: number;
    declare semaine: number;
    declare semestre: number;   


}

//init model
Emploi.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    semaine: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semestre: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
//params
{
    sequelize,
    modelName: 'Emploi'
});

