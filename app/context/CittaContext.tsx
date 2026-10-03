"use client"

import { createContext, useContext, useState, ReactNode } from "react";

interface CittaContextType {
    preferite: string[];
    aggiungiPreferita: (citta: string) => void;
}

const CittaContext = createContext<CittaContextType | undefined>(undefined);

export function CittaProvider({ children }: { children: ReactNode }) {
    const [preferite, setPreferite] = useState<string[]>([]);

    function aggiungiPreferita(citta: string) {
        setPreferite((prev) => {
            if (prev.includes(citta)) return prev;
            return [...prev, citta];
        });
    }

return (
    <CittaContext.Provider value={{ preferite, aggiungiPreferita }}>
        {children}
    </CittaContext.Provider>
);
}

export function useCittaPreferite() {
    const context = useContext(CittaContext);
    if (!context) {
        throw new Error("useCittaPreferite deve essere usato dentro un CittaProvider");
    }
    return context;
}