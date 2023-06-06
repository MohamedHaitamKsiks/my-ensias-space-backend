import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationMixin, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Etudiant, EtudiantInterface } from './etudiant.model';
import { President } from './role/president.model';
import { Role } from './role/role.model';
import { Forum, ForumInterface } from './forum/forum.mode';


export interface ClubInterface {
    id: number,
    nom: string,
    description: string,
    president?: EtudiantInterface,
    annonce?: ForumInterface,
    discussion?: ForumInterface
};

//create club
export class Club extends Model {
    //declar params
    declare id: number;
    declare nom: string;
    declare description: string;
    //forms
    private declare annonceId: number;
    private declare discussionId: number;

    async getClubInterface() {
        const clubInterface: ClubInterface = {
            id: this.id,
            nom: this.nom,
            description: this.description,
            president: await (await ((await (await this.getPresident()).getRole()).getEtudiant())).getEtudiantInterface(),
            annonce: (await this.getAnnonceForum())?.getForumInterface(),
            discussion: (await this.getDiscussionForum())?.getForumInterface()

        }
        return clubInterface;
    }

    //set forums
    setAnnonceForum(forum: Forum) {
        this.annonceId = forum.id
    }
    setDiscussionForum(forum: Forum) {
        this.discussionId = forum.id
    }

    //get forums
    async getAnnonceForum() {
        return await Forum.findByPk(this.annonceId);
    }
    async getDiscussionForum() {
        return await Forum.findByPk(this.discussionId);
    }

    //get president
    //...
    declare setPresident: HasOneSetAssociationMixin<President, number>;
    declare getPresident: HasOneGetAssociationMixin<President>;

    //get members
    declare getMembers: BelongsToManyGetAssociationsMixin<Etudiant>;
    declare addMember: BelongsToManyAddAssociationMixin<Etudiant, number>;
    declare removeMember: BelongsToManyRemoveAssociationMixin<Etudiant, number>;

}

//init model
Club.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
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
    modelName: 'Club'
});

Club.afterCreate(async (instance: Club) => {
    await Role.createPresident(instance);

    const annonce = await Forum.create({
        sujet: `${ instance.nom } Annonces`
    });
    instance.setAnnonceForum(annonce);

    const discussion = await Forum.create({
        sujet: `${instance.nom} Discussion`
    });
    instance.setDiscussionForum(discussion);

    await instance.save();
});

Club.beforeDestroy(async (instance: Club) => {
    const annonce = await instance.getAnnonceForum();
    await annonce?.destroy();

    const discussion = await instance.getDiscussionForum();
    await discussion?.destroy();
});