import { BelongsTo, BelongsToGetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyRemoveAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Document, DocumentInterface } from '../document.model';
import { Etudiant, EtudiantInterface } from '../etudiant.model';

export interface PosteInterface {
    id: number,
    texte: string,
    documents: Array<DocumentInterface>;
    postedBy: EtudiantInterface
}


//create user class
export class Poste extends Model {
    //data
    declare id: number;
    declare texte: string;

    async getPosteInterface() {
        let posteInterface: PosteInterface = {
            id: this.id,
            texte: this.texte,
            postedBy: await (await this.getEtudiant()).getEtudiantInterface(),
            documents: []
        };

        const documents = await this.getDocuments();
        for (let i = 0; i < documents.length; i++) {
            posteInterface.documents.push(documents[i].getDocumentInterface());
        }

        return posteInterface;
    }

    //etudiants
    declare getEtudiant: BelongsToGetAssociationMixin<Etudiant>;

    //documents
    declare getDocuments: HasManyGetAssociationsMixin<Document>;
    declare addDocument: HasManyAddAssociationMixin<Document, number>;
    declare removeDocument: HasManyRemoveAssociationMixin<Document, number>;
    
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

