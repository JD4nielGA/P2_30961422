"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const axios_1 = __importDefault(require("axios"));
const ContactsModel_1 = require("../models/ContactsModel");
const validators_1 = require("../utils/validators");
require("dotenv/config");
class ContactService {
    constructor() {
        this.model = new ContactsModel_1.ContactsModel();
        this.COMMENT_MIN = 10;
        this.COMMENT_MAX = 500;
        this.NAME_MIN = 2;
        this.NAME_MAX = 100;
        this.IPSTACK_API_KEY = process.env.IPSTACK;
    }
    async add(email, name, comment, ipAddress) {
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
        const country = await this.getCountryFromIp(ipAddress);
        const dbResult = await this.model.add(email, name, comment, country, ipAddress);
        return {
            id: dbResult.id,
            country: country,
            message: 'Comentario enviado exitosamente'
        };
    }
    async getCountryFromIp(ip) {
        try {
            const response = await axios_1.default.get(`http://api.ipstack.com/${ip}?access_key=${this.IPSTACK_API_KEY}`);
            return response.data.country_name || 'Desconocido';
        }
        catch (error) {
            console.error('Error al obtener país:', error);
            return 'Desconocido'; // Manejo seguro si falla ipstack
        }
    }
    async get() {
        return this.model.get();
    }
}
exports.ContactService = ContactService;
