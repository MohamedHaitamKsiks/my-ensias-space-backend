import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import fs from 'fs/promises';
import { resolve } from 'path';

//document type
export enum DocumentType {
    PDF,
    IMAGE,
    OTHER
} 

export interface DocumentInterface {
    id: number,
    nom: string,
    path: string,
    saved: boolean,
    type: DocumentType
};

//create user class
export class Document extends Model {
    //declar params
    declare id: number;
    declare nom: string;
    declare path: string;
    declare saved: boolean;
    declare type: DocumentType;

    getDocumentInterface(): DocumentInterface {
        return {
            id: this.id,
            nom: this.nom,
            path: this.path,
            saved: this.saved,
            type: this.type
        }
    }

    getFilePath() {
        return resolve((this.saved) ? `./uploads/documents/${this.path}` : `./uploads/.tmp/${this.path}`);
    }

    async saveDocument() {
        if (this.saved)
            return;

        try {
            await fs.copyFile(`uploads/.tmp/${this.path}`, `uploads/documents/${this.path}`);
            await fs.rm(`uploads/.tmp/${this.path}`);
            this.saved = true;
            await this.save();
        }
        catch(err) {
            await this.destroy();
            throw err;
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
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    saved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

