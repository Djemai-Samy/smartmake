var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as i18next from 'i18next';
import * as path from 'path';
import Backend from 'i18next-node-fs-backend';
import { fileURLToPath } from 'url';
export const lang = (function () {
    var instance;
    function createInstance(lng) {
        return __awaiter(this, void 0, void 0, function* () {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.resolve(path.dirname(__filename), `locales`);
            yield i18next.use(Backend).init({
                lng: lng,
                fallbackLng: 'en',
                debug: false,
                keySeparator: '.',
                backend: {
                    loadPath: path.join(__dirname, `/${lng}/translation.json`)
                }
            });
            return i18next;
        });
    }
    const getInstance = (lng) => __awaiter(this, void 0, void 0, function* () {
        if (!instance) {
            instance = yield createInstance(lng);
        }
        return instance;
    });
    return {
        getInstance
    };
})();
