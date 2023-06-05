import {  DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyRemoveAssociationMixin, HasOneGetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Etudiant, EtudiantInterface } from './etudiant.model';
import { Delegue, DelegueInterface } from './role/delegue.model';
import { Emploi } from './emploi/emploi.model';
import { Forum, ForumInterface } from './forum/forum.mode';

export interface ClasseInterface {
    id: number,
    nom: string,
    delegue: EtudiantInterface,
    annonce?: ForumInterface,
    discussion?: ForumInterface
};

//create user class
export class Classe extends Model {
    //params
    declare id: number;
    declare nom: string;
    //forms
    private declare annonceId: number;
    private declare discussionId: number;

    async getClasseInterface() {
        const etudiant = await this.getEtudiantDelegue();
        const classeInterface: ClasseInterface = {
            id: this.id,
            nom: this.nom,
            delegue: await etudiant.getEtudiantInterface(),
            annonce: (await this.getAnnonceForum())?.getForumInterface(),
            discussion: (await this.getDiscussionForum())?.getForumInterface()

        }
        return classeInterface;
    }

    //get forums
    async getAnnonceForum() {
        return await Forum.findByPk(this.annonceId);
    }
    async getDiscussionForum() {
        return await Forum.findByPk(this.discussionId);
    }

    //get etudiants
    declare getEtudiants: HasManyGetAssociationsMixin<Etudiant>;
    //add etudiant
    declare addEtudiant: HasManyAddAssociationMixin<Etudiant, number>;
    //has etudiant
    declare hasEtudiant: HasManyHasAssociationMixin<Etudiant, number>;
    //remove etudiant
    declare removeEtudiant: HasManyRemoveAssociationMixin<Etudiant, number>;
    
    //get delegue
    declare getDelegue: HasOneGetAssociationMixin<Delegue>;

    //get etudiant delegue
    async getEtudiantDelegue() {
        const delegue = await this.getDelegue();
        const role = await delegue.getRole();
        const etudiant = await role.getEtudiant();
        return etudiant;
    };

    //emploi
    declare getEmplois: HasManyGetAssociationsMixin<Emploi>;
    declare addEmploi: HasManyAddAssociationMixin<Emploi, number>;
}

//init model
Classe.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    annonceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Forum,
            key: 'id'
        }
    },
    discussionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Forum,
            key: 'id'
        }
    }
},
//params
{
    sequelize,
    modelName: 'Classe'
});

