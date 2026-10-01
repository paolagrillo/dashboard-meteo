"use client"

import { useState } from "react";
import { Weather } from "./types/weather";
import { cittaNote } from "./data/cittaNote";
import { traduciCodiceMeteo } from "./data/codiciMeteo";


export default function Home() {
  const [citta, setCitta] = useState("");
  const [meteo, setMeteo] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(false);

  async function cercaMeteo() {
    setLoading(true);
    setErrore(false);
    setMeteo(null);

    const chiave = citta.trim().toLowerCase();
    const coordinate = cittaNote[chiave];

    if (!coordinate) {
      setErrore(true);
      setLoading(false);
      return;
    }

    try {
      const risposta = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinate.lat}&longitude=${coordinate.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FRome`
      );
      const dati = await risposta.json();

   setMeteo({
  nomeCitta: citta,
  temperaturaAttuale: dati.current.temperature_2m,
descrizioneCondizioni: traduciCodiceMeteo(dati.current.weather_code).testo,
emoji: traduciCodiceMeteo(dati.current.weather_code).emoji,
  temperaturaMin: dati.daily.temperature_2m_min[0],
  temperaturaMax: dati.daily.temperature_2m_max[0],
});
    } catch (err) {
      setErrore(true);
    } finally {
      setLoading(false);
    }
  }

  return (

<main className="p-8 max-w-md mx-auto">
  <h1 className="text-2xl font-bold mb-4">Meteo</h1>

<div className="flex gap-2 mb-2">
  <input type="text"
  value={citta} 
  onChange={(e) => setCitta(e.target.value)}
  placeholder="Milano, Roma, Napoli..."
  className="flex-1 border-2 border-[var(--foreground)] p-2 rounded-lg"
  />
  <button 
  onClick={cercaMeteo}
  className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg">Cerca</button>
</div>

{loading && <p>Caricamento...</p>}
{errore && <p className="text-red-600">Città non trovata. Riprova</p>}

{meteo && (
  <div className="border-2 border-[var(--foreground)] p-4 rounded-lg">
   <h2 className="text-xl font-bold">{meteo.emoji} {meteo.nomeCitta}</h2>
<p className="text-4xl my-2">{meteo.temperaturaAttuale}°C</p>
<p className="mb-2">{meteo.descrizioneCondizioni}</p>
<p>Min {meteo.temperaturaMin}°C · Max {meteo.temperaturaMax}°C</p>
  </div>
)}

</main>


  );
  
}




/* 


dashboard-meteo/
│
├── app/
│   ├── layout.tsx              → cornice di tutte le pagine (Header qui dentro)
│   ├── page.tsx                → home: ricerca città + meteo attuale
│   ├── globals.css             → variabili colore, stile base
│   │
│   └── components/
│       ├── Header.tsx          → intestazione con nome app
│       ├── SearchBar.tsx       → input per cercare una città
│       ├── WeatherCard.tsx     → mostra temperatura/meteo di una città
│       └── CittaPreferite.tsx  → lista delle città salvate
│
├── types/
│   └── weather.ts              → tipo TypeScript per i dati meteo
│
└── context/ (eventuale, se usi Context per le città preferite)
    └── CittaContext.tsx


*/



// OBIETTIVI DASHBOARD METEO
// - Previsioni a 3-5 giorni, non solo oggi
// - Icona/emoji diversa in base al meteo (sole, pioggia, nuvoloso...)
// - Termometro visivo con i gradi attuali
// - Animazioni (nuvole, pioggia, transizioni)
// - Grafico temperature (libreria tipo Recharts) - più avanti
// - Geolocalizzazione automatica - più avanti
// - Confronto tra più città affiancate - più avanti
// - Sfondo dinamico in base al meteo - più avanti