import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';


//document type
export enum DocumentType {
    PDF,
    IMAGE,
    OTHER
} 

export interface DocumentInterface {
    id: number,
    path: string,
    type: DocumentType
};

//create user class
export class Document extends Model {
    //declar params
    declare id: number;
    declare path: string;
    declare type: DocumentType;

    getDocumentInterface(): DocumentInterface {
        return {
            id: this.id,
            path: this.path,
            type: this.type
        }
    }
}

//init model
Document.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: DocumentType.OTHER
    }
},
//params
{
    sequelize,
    modelName: 'Document'
});

