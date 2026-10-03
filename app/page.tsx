"use client"

import { useState } from "react";
import { Weather } from "./types/weather";
import { cittaNote } from "./data/cittaNote";
import { traduciCodiceMeteo } from "./data/codiciMeteo";
import { useCittaPreferite } from "./context/CittaContext";


export default function Home() {
  const [citta, setCitta] = useState("");
  const [meteo, setMeteo] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(false);
  const { preferite, aggiungiPreferita } = useCittaPreferite();

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
  `https://api.open-meteo.com/v1/forecast?latitude=${coordinate.lat}&longitude=${coordinate.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Europe%2FRome`
      );
      const dati = await risposta.json();

   setMeteo({
  nomeCitta: citta,
  temperaturaAttuale: dati.current.temperature_2m,
descrizioneCondizioni: traduciCodiceMeteo(dati.current.weather_code).testo,
emoji: traduciCodiceMeteo(dati.current.weather_code).emoji,
  temperaturaMin: dati.daily.temperature_2m_min[0],
  temperaturaMax: dati.daily.temperature_2m_max[0],
previsioni: dati.daily.time.map((data: string, index: number) => ({
data: data,
min: dati.daily.temperature_2m_min[index],
max: dati.daily.temperature_2m_max[index],
emoji: traduciCodiceMeteo(dati.daily.weather_code[index]).emoji,
})),
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

  {preferite.length > 0 && (
    <div className="flex gap-2 mb-4 flex-wrap">
      {preferite.map((nomeCitta) => (
        <button
          key={nomeCitta}
          onClick={() => setCitta(nomeCitta)}
          className="text-sm bg-white text-black px-3 py-1 rounded-full"
        >
          {nomeCitta}
        </button>
      ))}
    </div>
  )}

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
    
<button onClick={() => aggiungiPreferita(meteo.nomeCitta)}
className="text-sm text-[var(--primary)] underline mb-2" >
 ☆ Salva nei preferiti
</button>
    <p className="text-4xl my-2">{meteo.temperaturaAttuale}°C</p>
    <p className="mb-2">{meteo.descrizioneCondizioni}</p>
    <p>Min {meteo.temperaturaMin}°C · Max {meteo.temperaturaMax}°C</p>

    <div className="flex gap-2 mt-4 overflow-x-auto">
      {meteo.previsioni.map((giorno) => (
        <div key={giorno.data} className="flex-shrink-0 text-center border border-[var(--foreground)] rounded-lg p-2 w-20">
          <p className="text-xs">{giorno.data.slice(5)}</p>
          <p className="text-2xl">{giorno.emoji}</p>
          <p className="text-sm">{giorno.max}°</p>
          <p className="text-xs text-gray-500">{giorno.min}°</p>


        </div>
      ))}


    </div>
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



// OBIETTIVI DASHBOARD METEO (da fare)
// - Termometro visivo con i gradi attuali
// - Animazioni (nuvole, pioggia, transizioni)
// - Grafico temperature (libreria tipo Recharts) - più avanti
// - Geolocalizzazione automatica - più avanti
// - Confronto tra più città affiancate - più avanti
// - Sfondo dinamico in base al meteo - più avanti