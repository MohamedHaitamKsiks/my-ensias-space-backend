import { BelongsToGetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Classe, ClasseInterface } from '../classe.model';
import { Timeline } from './timeline.model';


export interface EmploiInterface {
    id: number,
    semaine: number,
    semestre: number,
    classe: ClasseInterface
}


//create user class
export class Emploi extends Model {
    //data
    declare id: number;
    declare semaine: number;
    declare semestre: number;

    //get interface
    async getEmploiInterface() {
        const emploiInterface: EmploiInterface = {
            id: this.id,
            semaine: this.semaine,
            semestre: this.semestre,
            classe: await (await this.getClasse()).getClasseInterface()
        };
        return emploiInterface;
    }

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

