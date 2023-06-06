import { DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyRemoveAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Matiere, MatiereInterface } from './matiere.model';


export interface ProfesseurInterface {
    id: number,
    nom: string,
    prenom: string,
    email: string,
    phone: string,
    matieres?: Array<MatiereInterface>
}

//create user class
export class Professeur extends Model {
    //declar params
    declare id: number;
    declare nom: string;
    declare prenom: string;
    declare email: string;
    declare phone: string;

    declare getMatieres: HasManyGetAssociationsMixin<Matiere>;
    declare addMatiere: HasManyAddAssociationMixin<Matiere, number>;
    declare removeMatiere: HasManyRemoveAssociationMixin<Matiere, number>;

    async getProfesseurInterface(withoutMatiere = false) {
        let professeurInterface: ProfesseurInterface = {
            id: this.id,
            nom: this.nom,
            prenom: this.prenom,
            email: this.email,
            phone: this.phone
        };

        if (!withoutMatiere) {
            professeurInterface.matieres = []
            const matieres = await this.getMatieres();
            for (let i = 0; i < matieres.length; i++) {
                professeurInterface.matieres.push(await matieres[i].getMatiereInterface(true));
            }
        }

        return professeurInterface;
    
    }
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

