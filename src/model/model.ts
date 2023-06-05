import { Classe } from "./classe.model";
import { Etudiant } from "./etudiant.model";
import { Emploi } from "./emploi/emploi.model";
import { Delegue } from "./role/delegue.model";
import { Role } from "./role/role.model";
import { User } from "./user.model";
import { Timeline } from "./emploi/timeline.model";
import { Forum } from "./forum/forum.mode";
import { Poste } from "./forum/post.model";
import { Matiere } from "./matiere/matiere.model";
import { Professeur } from "./matiere/professeur.model";
import { Acces } from "./forum/acces.model";
import { Document } from "./document.model";
import { Club } from "./club.model";
import { President } from "./role/president.model";


export function setupModelRelation() {
    //link to user
    Etudiant.belongsTo(User, { as: 'user' });

    //link students
    Classe.hasMany(Etudiant);

    //link roles to etudiants
    Etudiant.hasMany(Role);
    Role.belongsTo(Etudiant);

    //classe to delegue
    Classe.hasOne(Delegue);
    Delegue.belongsTo(Classe);

    //role to delegue
    Role.hasOne(Delegue);
    Delegue.belongsTo(Role);

    //role to president
    Role.hasOne(President);
    President.belongsTo(Role);
    
    //emploi to classe
    Classe.hasMany(Emploi);
    Emploi.belongsTo(Classe);
    
    //timeline to emploi
    Emploi.hasMany(Timeline);
    //Timeline.belongsTo(Emploi);
    
    //matiere to timeline
    Matiere.hasMany(Timeline);
    Timeline.belongsTo(Matiere);

    //forum to poste
    Forum.hasMany(Poste);
    Poste.belongsTo(Forum);

    //documents to poste
    Poste.hasMany(Document);

    //forum to access
    Forum.hasMany(Acces);
    Acces.belongsTo(Forum);

    //acess to etudiant
    Etudiant.hasMany(Acces);
    Acces.belongsTo(Etudiant);

    //link poste to etudiant (who made the post)
    Etudiant.hasMany(Poste);
    Poste.belongsTo(Etudiant);

    //matiere professeur
    Professeur.hasMany(Matiere);
    Matiere.belongsTo(Professeur);

    //club
    Club.belongsToMany(Etudiant, {
        through: 'ClubMembers'
    });
    Etudiant.belongsToMany(Club, {
        through: 'ClubMembers'
    });
}