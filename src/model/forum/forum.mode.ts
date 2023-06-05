import { DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../../database/connection';
import { Poste } from './post.model';
import { Acces } from './acces.model';
import { Etudiant } from '../etudiant.model';
import { Document } from '../document.model';

//
export interface ForumInterface {
    id: number,
    sujet: string,
    estFerme: boolean
};

//create user class
export class Forum extends Model {
    //data
    declare id: number;
    declare sujet: string;
    declare estFerme: boolean;

    getForumInterface(): ForumInterface {
        return {
            id: this.id,
            sujet: this.sujet,
            estFerme: this.estFerme
        }
    }

    //posts
    declare getPostes: HasManyGetAssociationsMixin<Poste>;
    declare addPoste: HasManyAddAssociationMixin<Poste, number>;

    //get desciption
    async getDescription() {
        return ( await this.getPostes({
            order: [
                ['createdAt', '']
            ]
        }) )[0];
    }

    //access
    declare getAcces: HasManyGetAssociationsMixin<Acces>;
    declare addAcces: HasManyAddAssociationMixin<Acces, number>;
    //get access specific user
    async getAccesOf(etudiant: Etudiant) {
        const acces = await this.getAcces({
            where: {
                EtudiantId: etudiant.id
            }
        });
        //return acces
        return acces.length > 0 ? acces[0] : null;
    }

}

//init model
Forum.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sujet: {
        type: DataTypes.STRING,
    },
    estFerme: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,

    }
},
//params
{
    sequelize,
    modelName: 'Forum'
});

