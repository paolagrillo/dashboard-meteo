export function traduciCodiceMeteo(codice: number): { testo: string; emoji: string } {
    if (codice === 0) return { testo: "Cielo sereno", emoji: "☀️" };
    if (codice <= 3) return { testo: "Parzialmente nuvoloso", emoji: "⛅" };
    if (codice <= 48) return { testo: "Nebbia", emoji: "🌫️" };
  if (codice <= 57) return { testo: "Pioggerella", emoji: "🌦️" };
  if (codice <= 67) return { testo: "Pioggia", emoji: "🌧️" };
  if (codice <= 77) return { testo: "Neve", emoji: "❄️" };
  if (codice <= 82) return { testo: "Rovesci", emoji: "🌧️" };
  if (codice <= 99) return { testo: "Temporale", emoji: "⛈️" };
  return { testo: "Sconosciuto", emoji: "❓" };
}