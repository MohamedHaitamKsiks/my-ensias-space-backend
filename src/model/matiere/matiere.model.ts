import { BelongsToGetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Professeur, ProfesseurInterface } from './professeur.model';


export interface MatiereInterface {
    id: number,
    nom: string,
    professeur?: ProfesseurInterface
};

//create user class
export class Matiere extends Model {
    declare id: number;
    declare nom: string;
    
    declare getProfesseur: BelongsToGetAssociationMixin<Professeur>;

    async getMatiereInterface(withoutProfesseur = false) {
        let matierInterface: MatiereInterface = {
            id: this.id,
            nom: this.nom
        };

        if (!withoutProfesseur) {
            const professeur = await this.getProfesseur();
            matierInterface.professeur = await professeur?.getProfesseurInterface(true);
        } 

        return matierInterface;
    }

}

//init model
Matiere.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
//params
{
    sequelize,
    modelName: 'Matiere'
});

