import { BelongsToGetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Classe } from '../classe.model';
import { Timeline } from './timeline.model';


//create user class
export class Emploi extends Model {
    //data
    declare id: number;
    declare semaine: number;
    declare semestre: number;

    //get classe
    declare getClasse: BelongsToGetAssociationMixin<Classe>;

    //timlines
    declare getTimelines: HasManyGetAssociationsMixin<Timeline>;
    declare addTimeline: HasManyAddAssociationMixin<Timeline, number>;

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

