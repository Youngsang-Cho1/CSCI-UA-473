// query.mjs
import { v4 as uuidv4 } from 'uuid';

export class Query {
    constructor (id, question, genre, answers){
        this.id = id;
        this.question = question;
        this.genre = genre;
        this.answers = answers;
    }

}