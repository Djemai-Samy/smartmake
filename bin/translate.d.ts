import * as i18next from "i18next";
export declare const languages: {
    name: string;
    value: string;
}[];
export declare const lang: {
    getInstance: (lng?: string) => Promise<typeof i18next>;
};
export declare const isValidLanguage: (language: string) => boolean;
//# sourceMappingURL=translate.d.ts.map