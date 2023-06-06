import { BelongsToGetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Emploi } from './emploi.model';

export interface TimelineInterface {
    id: number,
    jour: number,
    debut: number,
    fin: number
};

//create user class
export class Timeline extends Model {
    //data
    declare id: number;
    declare jour: number;
    declare debut: number;
    declare fin: number;

    getTimelineInterface(): TimelineInterface {
        return {
            id: this.id,
            jour: this.jour,
            debut: this.debut,
            fin: this.debut
        }
    }

    //
    declare getEmploi: BelongsToGetAssociationMixin<Emploi>;
}

//init model
Timeline.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jour: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    debut: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    fin: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
},
//params
{
    sequelize,
    modelName: 'Timeline'
});

