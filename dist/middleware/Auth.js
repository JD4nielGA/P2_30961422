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
exports.validateRecaptcha = validateRecaptcha;
function validateRecaptcha(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recaptchaResponse = req.body["g-recaptcha-response"];
            if (!recaptchaResponse) {
                console.error("⚠️ Error: Token reCAPTCHA no recibido.");
                req.session.message = "Verificación reCAPTCHA fallida: No se recibió el token.";
                req.session.success = false;
                return res.redirect("/");
            }
            const secretKey = "6LcqO08rAAAAAGEzZ46ORGLwR_DvctfPEPfW3MqG"; // 🔒 Nunca la expongas en el frontend
            const googleUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
            console.log("🔍 Enviando solicitud a Google reCAPTCHA...");
            const googleResponse = yield fetch(googleUrl, { method: "POST" });
            const data = yield googleResponse.json();
            console.log("📜 Respuesta de Google reCAPTCHA:", data);
            if (!data.success) {
                console.error("🚫 Verificación fallida.");
                req.session.message = "Verificación reCAPTCHA fallida.";
                req.session.success = false;
                return res.redirect("/");
            }
            console.log("✅ reCAPTCHA validado correctamente.");
            next(); // Continuar con la ejecución de la siguiente función
        }
        catch (error) {
            console.error("❌ Error en la verificación de reCAPTCHA:", error);
            req.session.message = "Error al procesar reCAPTCHA.";
            req.session.success = false;
            return res.redirect("/");
        }
    });
}
