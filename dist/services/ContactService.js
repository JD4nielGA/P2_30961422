"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const ContactsModel_1 = require("../models/ContactsModel");
const validators_1 = require("../utils/validators");
class ContactService {
    constructor() {
        this.model = new ContactsModel_1.ContactsModel();
        this.COMMENT_MIN = 10;
        this.COMMENT_MAX = 500;
        this.NAME_MIN = 2;
        this.NAME_MAX = 100;
    }
    add(email, name, comment, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones
            if (!(0, validators_1.validateEmail)(email)) {
                throw new Error('Email inválido');
            }
            if (!(0, validators_1.validateText)(name, this.NAME_MIN, this.NAME_MAX)) {
                throw new Error(`Nombre debe tener entre ${this.NAME_MIN}-${this.NAME_MAX} caracteres`);
            }
            if (!(0, validators_1.validateText)(comment, this.COMMENT_MIN, this.COMMENT_MAX)) {
                throw new Error(`Comentario debe tener entre ${this.COMMENT_MIN}-${this.COMMENT_MAX} caracteres`);
            }
            const dbResult = yield this.model.add(email, name, comment, ipAddress);
            return {
                id: dbResult.id,
                message: 'Comentario enviado exitosamente'
            };
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.get();
        });
    }
}
exports.ContactService = ContactService;
