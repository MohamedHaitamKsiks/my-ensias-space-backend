import { DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyRemoveAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Document } from '../document.model';


//create user class
export class Poste extends Model {
    //data
    declare id: number;
    declare texte: string;

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

