# Charts prototype

## Doel
In dit prototype onderzoek ik welke van vier verschillende JavaScript/React chart libraries het meest geschikt is voor het weergeven van grote hoeveelheden crypto-data. Het doel is om te onderzoeken welke library:
- Grote datasets het snelst kan weergeven;
- Het meest soepel omgaat met veel candles;
- Het minst belastend is voor de browser;
- Het eenvoudigst te implementeren is;
- Geschikt is voor interactieve crypto-grafieken met candlesticks.

De libraries waarmee wordt geëxperimenteerd zijn:
- Recharts
- TradingView Lightweight charts
- Echarts
- Plotly

Naast de chart libraries wordt ook onderzocht op welke manier historische candle-data het beste uit de database kan worden opgehaald en verwerkt.

## Onderzoeksvragen
1. Welke chart library kan grote hoeveelheden crypto-data het snelst weergeven?
2. Welke library geeft de beste gebruikerservaring bij grote datasets?
3. Welke library is het eenvoudigst te implementeren voor candlestick charts?
4. Welke library biedt de beste functionaliteit voor een interactieve crypto-grafiek?
5. Is het sneller om 1-uurs en 1-daagse candles vooraf op te slaan in de database?
6. Of is het sneller om de opgeslagen 1-minuut candles op te halen en deze tijdens het opvragen om te zetten 7. naar 1-uurs of 1-daagse candles?
8. Is het verschil tussen SQL-aggregatie en Python-aggregatie groot genoeg om een keuze in de architectuur te beïnvloeden?

## Data-extractie en verwerking
Naast de chart libraries wordt onderzocht hoe de candle-data het beste uit PostgreSQL kan worden opgehaald.
De database bevat 1-minuut candles. Daarnaast worden 1-uurs en 1-daagse candles gebruikt om verschillende manieren van data-opslag en verwerking te vergelijken.
Er worden drie methoden getest.

### Methode 1: Vooraf opgeslagen candles
De 1-uurs en 1-daagse candles worden vooraf uit de 1-minuut candles berekend en opgeslagen in de database.

Wanneer de applicatie bijvoorbeeld 1-uurs candles nodig heeft, worden deze rechtstreeks uit de database opgehaald.

```
1m candles
    ↓
eenmalige aggregatie
    ↓
database
    ↓
1h / 1d candles
    ↓
frontend
```
#### Voordelen
Bij het opvragen hoeft geen aggregatie meer plaats te vinden.
Minder CPU-belasting tijdens een request.
Geschikt wanneer dezelfde timeframes vaak worden opgevraagd.
De frontend ontvangt direct de gewenste timeframe.
#### Nadelen
Meer data wordt opgeslagen in de database.
Bij nieuwe 1-minuut data moeten de andere timeframes worden bijgewerkt.
Meer onderhoud van de database-data.
Meerdere timeframes kunnen dezelfde onderliggende data dupliceren.
### Methode 2: 1m candles aggregeren in PostgreSQL
Bij deze methode worden alleen de 1-minuut candles uit de database gehaald en worden deze tijdens het request in PostgreSQL geaggregeerd.

Bijvoorbeeld:
```
1m candles
    ↓
PostgreSQL
    ↓
SQL aggregatie
    ↓
1h / 1d candles
    ↓
frontend
```
Voor de aggregatie worden de OHLCV-waarden berekend:

- Open: eerste open-prijs binnen de periode.
- High: hoogste high binnen de periode.
- Low: laagste low binnen de periode.
- Close: laatste close-prijs binnen de periode.
- Volume: som van het volume binnen de periode.
#### Voordelen
Geen aparte opslag van geaggregeerde candles noodzakelijk.
De database doet de verwerking waar de data zich al bevindt.
Nieuwe 1-minuut data hoeft niet apart naar 1h en 1d te worden omgezet.
Minder dubbele data-opslag.
#### Nadelen
PostgreSQL moet bij ieder request de aggregatie uitvoeren.
Bij grote hoeveelheden 1-minuut data kan de query zwaar worden.
Performance is afhankelijk van de database, indexes en hoeveelheid data.
### Methode 3: 1m candles ophalen en aggregeren in Python
Bij deze methode worden de 1-minuut candles eerst uit PostgreSQL opgehaald. Vervolgens worden ze in de Python-backend geaggregeerd.
```
1m candles
    ↓
PostgreSQL
    ↓
Python backend
    ↓
Python aggregatie
    ↓
1h / 1d candles
    ↓
frontend
```
#### Voordelen
Aggregatielogica kan eenvoudig in Python worden aangepast.
Complexere berekeningen kunnen in Python worden uitgevoerd.
Geen extra opslag van 1h/1d candles nodig.
#### Nadelen
Alle benodigde 1-minuut data moet eerst naar de backend worden gestuurd.
Dit kan veel geheugen en netwerkverkeer gebruiken.
Python moet de aggregatie uitvoeren.
Bij grote datasets kan dit aanzienlijk langzamer zijn dan database-aggregatie.

## Werkwijze
### Installeren van de library's
De benodigde chart libraries en React-integraties worden geïnstalleerd met:
`npm install lightweight-charts recharts echarts echarts-for-react plotly.js-dist react-plotly.js`
### Documentatie onderzoeken
Van iedere library heb ik officiële documentatie bekeken.
### Databaseverbinding maken.
De React-frontend communiceert met een Python/FastAPI-backend. De backend maakt via SQLAlchemy verbinding met PostgreSQL.
### Candle-data ophalen
De backend kan Bitcoin-candles ophalen voor de timeframes 1 minuut, 1 uur en 1 dag. Daarnaast kan de backend verschillende databronnen gebruiken: candles direct uit de database, candles van 1 minuut geaggregeerd in SQL en candles van 1 minuut geaggregeerd in Python.
### Dezelfde data aan alle libraries aanbieden
Om de chart libraries eerlijk met elkaar te kunnen vergelijken, krijgen alle vier de charts dezelfde dataset. Hierdoor wordt geprobeerd het verschil in performance zoveel mogelijk aan de gebruikte library toe te schrijven.
### Render performance meten
De tijd die nodig is om iedere chart te renderen wordt afzonderlijk gemeten.De timer wordt beheerd door de parent component `App.jsx` en niet door de afzonderlijke chart libraries.Hierdoor wordt voorkomen dat iedere library zijn eigen meetmethode gebruikt.De resultaten worden weergegeven in milliseconden.
### Database-methoden benchmarken
De backend bevat daarnaast een aparte benchmark.
Deze vergelijkt:
- Stored 1h/1d
- 1m → SQL
- 1m → Python

## Gebruik van de applicatie
De applicatie bestaat uit een React-frontend en een Python/FastAPI-backend.

1. Backend starten

Start vanuit de backend-directory de FastAPI-applicatie met: `uvicorn main:app --reload --port 8001`

2. Frontend starten

Start vervolgens de React/Vite applicatie met: `npm run dev`

Open daarna de URL die Vite toont, bijvoorbeeld: http://localhost:5173

3. Chart experiment uitvoeren

In de applicatie kunnen de volgende instellingen worden gekozen:
**Timeframe**
- 1 minuut
- 1 uur
- 1 dag'

**Data source**
- Stored candles
- 1m → SQL
- 1m → Python
Aantal candles

Hiermee wordt bepaald hoeveel candles aan de charts worden aangeboden. Daarna kan Load Data worden gebruikt om de vier charts te laden. De render-tijd van iedere library wordt vervolgens afzonderlijk weergegeven.

4. Database benchmark uitvoeren

Met Benchmark DB worden alle drie de data-extractiemethoden getest. De gekozen `source` heeft geen invloed op deze benchmark.
De benchmark test altijd:
1. Stored candles
2. 1m → SQL
3. 1m → Python

De benchmark geeft vervolgens aan welke methode het snelst was.

## Experimenten
Om de performance bij verschillende hoeveelheden data te onderzoeken, kunnen meerdere datasets worden getest door het aantal candles aan te passen. Bij iedere test worden de resultaten van de vier chart libraries vergeleken. Een belangrijk aandachtspunt is dat zeer grote datasets in de browser kunnen leiden tot hoge geheugendruk. Daarom wordt niet alleen gekeken naar de snelste initiële render, maar ook naar de praktische bruikbaarheid van de grafiek.

## Resultaten
### Chart libraries
|Library|Render snelheid|Gebruiksgemak|Crypto geschikt|Interactie|Grote datasets|
|---|---|---|---|---|---|
|Recharts|Laag|Gemiddeld|Ongeschikt|Gemiddeld|Ongeschikt|
|TradingView Lightweight Charts|Hoog|Gemiddeld|Zeer geschikt|Zeer goed|Zeer geschikt|
|ECharts|Gemiddeld|Eenvoudig|Gemiddeld|Gemiddeld|Geschikt|
|Plotly|Gemiddeld|Eenvoudig|Gemiddeld|Gemiddeld|Minder geschikt|
### Data-extractie
|Methode|Snelheid 10k candles 1h|Snelheid 10k candles 1d|Aggregatie snelheid|Data-opslag |Geheugengebruik backend|
|---|---|---|---|---|---|
|All timeframes stored in DB|26.96ms|12.31ms|N.v.t.|Hoog|Laag|
|1m timeframe omzetten naar 1h/1d in SQL|429.85ms|7119.46ms|6338.42ms|Laag|Laag|
|1m timeframe omzetten naar 1h/1d in Python|7354.98ms|101464.55ms|130500.82ms|Laag|Hoger|
### Korte toelichting
- **Recharts**: relatief eenvoudig te gebruiken met React, maar minder specifiek gericht op financiële/tijdreeksdata. Bij grote datasets duurt het erg lang voordat de SVG is gerenderd, waardoor de pagina kan vastlopen.
- **TradingView Lightweight Charts**: specifiek ontworpen voor financiële grafieken en daardoor zeer geschikt voor crypto/koersdata. Het ondersteunt native zooming, scrolling en candlestick charts. Het enige nadeel wat ik kon vinden is dat het geen ingebouwde range slider heeft, maar dit wordt wel opgelost doordat de chart zelf scrollable is.
- **ECharts**: veel ingebouwde interactiemogelijkheden, waaronder dataZoom, en geschikt voor interactieve tijdreeksen.
- **Plotly**: zeer veel ingebouwde interactie en relatief eenvoudig om verschillende grafiektypes te maken, maar kan bij zeer grote datasets zwaarder zijn.
- **All timeframes stored in DB**: de backend hoeft bij het opvragen van bijvoorbeeld 1h geen aggregatie uit te voeren. Daar staat tegenover dat dezelfde marktdata op meerdere timeframes wordt opgeslagen.
- **1m timeframe omzetten naar 1h/1d in SQL**: alleen de basisdata wordt opgeslagen en aggregatie gebeurt in PostgreSQL. Hierdoor blijft het backend-geheugengebruik laag, maar het kost alsnog extra verwerkingstijd.
- **1m timeframe omzetten naar 1h/1d in Python**: aggregatie gebeurt nadat de 1m-data naar Python is gehaald. Dit kan meer backendgeheugen en verwerkingstijd kosten, vooral bij grote datasets.

## Conclusie
Uit het prototype blijkt dat TradingView Lightweight Charts de meest geschikte chart library is voor de beoogde crypto-backtestingapplicatie. De library is specifiek ontwikkeld voor financiële data en biedt native ondersteuning voor candlestick charts, zooming en scrolling. Daarnaast presteert Lightweight Charts verruit het beste bij grote hoeveelheden candles. In vergelijking met de drie andere charts biedt Lightweight Charts daarmee de beste combinatie van performance, gebruiksgemak en functionaliteit voor interactieve crypto-grafieken.

Voor de data-extractie blijkt uit de benchmark dat het rechtstreeks ophalen van vooraf opgeslagen 1h- en 1d-candles uit de database duidelijk het snelst is. Voor 10.000 candles werd ongeveer 41,56 ms gemeten voor 1h en 63,56 ms voor 1d. Dit is aanzienlijk sneller dan het tijdens een request aggregeren van 1-minuut candles in PostgreSQL of Python. Vooral Python-aggregatie is bij grote datasets veel trager en gebruikt daarnaast meer geheugen in de backend.

Hoewel het vooraf opslaan van meerdere timeframes leidt tot extra database-opslag en het onderhouden van meerdere datasets vereist, wegen deze nadelen in dit project minder zwaar dan de performancevoordelen. De applicatie is gericht op het interactief bekijken en backtesten van historische marktdata. Hierbij is een snelle respons bij het opvragen van candles belangrijk. Door de 1h- en 1d-candles vooraf te berekenen, hoeft tijdens een request geen aggregatie meer plaats te vinden.

Daarom wordt voor de verdere ontwikkeling gekozen voor de combinatie van TradingView Lightweight Charts en direct opgeslagen candles uit de database. Deze combinatie zorgt voor de hoogste performance en praktische toepassing.

## Bronnen
- Top 15 JavaScript Data Visualization Libraries. (2020, 1 oktober). Codersera Blogs. Geraadpleegd op 10 september 2026, van https://codersera.com/blog/javascript-data-visualization-libraries/

- Get started | Advanced Charts Documentation. (z.d.). Geraadpleegd op 10 september 2026, van https://www.tradingview.com/charting-library-docs/latest/quick-start

- Time scale | Advanced Charts Documentation. (z.d.). Geraadpleegd op 11 september 2026, van https://www.tradingview.com/charting-library-docs/latest/ui_elements/Time-Scale/

- Chart | Advanced Charts Documentation. (z.d.). Geraadpleegd op 11 september 2026, van https://www.tradingview.com/charting-library-docs/latest/ui_elements/Chart

- Recharts. (z.d.-b). Geraadpleegd op 12 september 2026 https://recharts.github.io/en-US/guide/

- Recharts. (z.d.). Geraadpleegd op 12 september 2026 https://recharts.github.io/en-US/examples/Candlestick/

- AnyPlot. (z.d.). Basic Candlestick Chart. Geraadpleegd op 12 september 2026, van https://anyplot.ai/candlestick-basic/javascript/echarts

- Examples - Apache ECharts. (z.d.). Geraadpleegd op 12 september 2026, van https://echarts.apache.org/examples/en/index.html#chart-type-candlestick

- React Plotly.js in JavaScript. (z.d.). Geraadpleegd op 13 september 2026  https://plotly.com/javascript/react/

- Candlestick charts in JavaScript. (z.d.). Geraadpleegd op 13 september 2026, van https://plotly.com/javascript/candlestick-charts/

- Zivkovic, M. (2026, 13 juli). 34 Top Chart Types for Data Visualization. Luzmo. Geraadpleegd op 10 september 2026, van https://www.luzmo.com/blog/chart-types