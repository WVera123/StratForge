# Benchmarkonderzoek naar functies — StratForge

**Laatst bijgewerkt:** 10 november 2026  

---

## 1. Onderzoeksdoel en afbakening

### 1.1 Doel

Dit onderzoek bekijkt hoe bestaande platforms voor cryptocurrency
trading en backtesting gebruikers ondersteunen bij het
configureren van strategieën, het bekijken van marktgegevens, het
uitvoeren van backtests en het interpreteren van resultaten.

Het doel is om interfacepatronen, functionele benaderingen en mogelijke
usabilityproblemen te identificeren die kunnen bijdragen aan
verbeteringen van StratForge.

Het onderzoek is niet bedoeld om vast te stellen welk platform de
hoogste handelsrendementen oplevert, de meest nauwkeurige marktgegevens
heeft of het beste execution model biedt. De focus ligt op de functies,
presentatie en workflows van de platforms.

### 1.2 Centrale onderzoeksvraag

**Hoe ondersteunen gratis toegankelijke platforms gebruikers bij het configureren van handelsstrategieën, uitvoeren van backtests, begrijpen van resultaten en opnieuw bekijken van experimenten, en welke benaderingen kunnen StratForge verbeteren?**

### 1.3 Onderzoeksdoelen

Het onderzoek heeft de volgende doelen:

1.  Relevante functies en workflows van vergelijkbare platforms
    identificeren.
2.  Observeren hoe strategieconfiguratie, marktgegevens en
    backtestresultaten worden gepresenteerd.
3.  Sterke en zwakke punten van interfaces en mogelijke bronnen van
    frictie identificeren.
4.  Terugkerende patronen en verschillen tussen platforms vergelijken.
5.  Relevante bevindingen vertalen naar geprioriteerde ontwerp- en
    functionele requirements voor StratForge.
6.  Gebieden identificeren waarvoor aanvullend onderzoek of validatie
    met gebruikers nodig is.

### 1.4 Beoogde gebruikers en relevantie voor StratForge

StratForge is bedoeld voor gebruikers die
cryptocurrency-handelsstrategieën willen configureren en onderzoeken
door middel van historische backtesting.

De interface moet gebruikers daarom ondersteunen bij:

- Het selecteren van een geschikt strategieprincipe.
- Het begrijpen en configureren van relevante features en parameters.
- Het bekijken van historische prijsbewegingen en strategie signalen.
- Het configureren en uitvoeren van een backtest.
- Het interpreteren van prestaties en risico.
- Het inspecteren van individuele trades.
- Het opnieuw bekijken van eerdere experimenten en de bijbehorende
  configuraties.

De benchmark wordt gebruikt om te onderzoeken hoe vergelijkbare
platforms deze activiteiten ondersteunen. Dit betekent niet dat iedere
elders waargenomen functie noodzakelijk is voor StratForge.

### 1.5 Afbakening en beperkingen

Alleen platforms die zonder betaling konden worden verkend, zijn
meegenomen. Een betaald abonnement of een gratis proefperiode waarvoor
betaalgegevens nodig waren om verder te gaan, was geen vereiste voor
opname.

Een platform bleef in aanmerking komen wanneer slechts een deel van de
functionaliteit gratis toegankelijk was. Functionaliteit die niet
toegankelijk of niet getest was, wordt echter niet beschouwd als bewijs
dat het platform deze functionaliteit niet ondersteunt.

Het onderzoek is beperkt tot de interfaces en functionaliteit die
tijdens de beoordeling konden worden waargenomen. Het beoordeelt niet:

- De daadwerkelijke winstgevendheid van trading.
- De nauwkeurigheid of volledigheid van historische marktgegevens.
- De kwaliteit van live execution.
- De correctheid van iedere onderliggende statistische berekening.
- De veiligheid of betrouwbaarheid van de platforms.
- Functies die niet toegankelijk waren of niet zijn getest.

De bevindingen zijn verkennend en moeten worden beschouwd als input voor
ontwerpbeslissingen, niet als definitief bewijs van usability.

------------------------------------------------------------------------

## 2. Platformselectie

### 2.1 Selectiecriteria

Platforms zijn geselecteerd aan de hand van de volgende criteria:

| Criterium                            | Toelichting                                                                                          |
| :----------------------------------- | :--------------------------------------------------------------------------------------------------- |
| Relevantie                           | Het platform ondersteunt cryptocurrency trading, charting, strategieconfiguratie of backtesting.     |
| Toegankelijkheid                     | Relevante functionaliteit kan zonder betaling worden verkend.                                        |
| Geen betaalafhankelijke proefperiode | Het onderzoek is niet afhankelijk van een proefperiode waarvoor betaling nodig is om verder te gaan. |
| Onderzoekswaarde                     | De interface bevat workflows of functies die kunnen bijdragen aan het ontwerp van StratForge.        |

De shortlist is een selectie van relevante voorbeelden en geen ranglijst
van de beste platforms.

### 2.2 Geselecteerde platforms

| Platform                                        | Reden voor opname                                                                                     | Belangrijkste onderzochte onderdelen                                                                                                                            |
| :---------------------------------------------- | :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Pruviq ](https://pruviq.com/)                  | Tijdens de beoordeling waren een strategy builder en een backtestingworkflow toegankelijk.            | Presets, custom strategies, chart feedback, backtestmetrics, multi-asset testing, validatie, optimalisatie, trade log en run history.                           |
| [Stratsemble](https://stratsemble.com/)         | Workflows voor strategieconfiguratie en backtesting konden worden verkend.                            | Interfacemodi, natural-language input, form- en canvas-editors, rule configuration, risk settings, metrics, drawdown, maandelijkse vergelijkingen en trade log. |
| [StrategyNodes](https://app.strategynodes.com/) | Tijdens de beoordeling waren een node-based strategy builder en een backtestingworkflow toegankelijk. | Begeleide walkthrough, node editor, workspace layouts, chart tools, samenvatting en geavanceerde statistieken, kosten, position timeline en trade log.          |

De selectie omvat drie verschillende benaderingen van
strategieconfiguratie:

- Pruviq combineert presets met configuratie van custom strategies.
- Stratsemble biedt gestructureerde en visuele configuratieopties,
  evenals natural-language input.
- StrategyNodes gebruikt een visuele node-based editor.

Hierdoor zijn de platforms geschikt om verschillende manieren te
vergelijken waarop strategiecreatie en backtestanalyse kunnen worden
ondersteund.

------------------------------------------------------------------------

## 3. Onderzoeksmethode

### 3.1 Onderzoeksaanpak

Het onderzoek maakt gebruik van een **verkennende vergelijkende
platformbeoordeling**.

Elk platform is verkend via de beschikbare interface. Relevante
workflows en functies zijn geïnspecteerd en observaties zijn vastgelegd
aan de hand van een gemeenschappelijke set onderzoeksvragen.

De aanpak combineert:

- **Beschrijvende observatie:** vastleggen wat zichtbaar aanwezig is en
  hoe de interface zich gedraagt.
- **Vergelijkende analyse:** overeenkomsten en verschillen tussen
  platforms identificeren.
- **Interpretatie:** nadenken over wat een bepaalde ontwerpbenadering
  voor gebruikers kan betekenen.
- **Vertaling naar ontwerp:** bepalen of een waargenomen patroon moet
  worden overgenomen, aangepast, verder onderzocht of vermeden in
  StratForge.

### 3.2 Beoordelingsprocedure

Voor ieder platform is de volgende procedure gebruikt:

1.  Het platform openen met de beschikbare gratis toegang.
2.  De relevante workflows voor strategiecreatie en backtesting
    verkennen.
3.  De schermen en bedieningselementen inspecteren die verband houden
    met de onderzoekstaken in hoofdstuk 4.
4.  Zichtbare interface-elementen en waargenomen gedrag vastleggen.
5.  Directe observaties scheiden van interpretaties en mogelijke
    ontwerpimplicaties.
6.  Relevante sterke punten, zwakke punten en onzekerheden vastleggen.
7.  Relevante bevindingen vertalen naar mogelijke verbeteringen voor
    StratForge.

Wanneer een functie niet toegankelijk was of het gedrag ervan niet kon
worden vastgesteld, is deze gemarkeerd als **Niet beoordeeld** of is de
onzekerheid expliciet beschreven.

De beoordeling was verkennend en geen strikt gecontroleerde test.
Daardoor kon niet iedere taak op ieder platform met dezelfde diepgang
worden onderzocht.

### 3.3 Observatiekader

Iedere observatie is beoordeeld aan de hand van de volgende velden:

| Veld               | Doel                                                                                  |
| :----------------- | :------------------------------------------------------------------------------------ |
| Observatie         | Wat was direct zichtbaar of wat gebeurde er tijdens de beoordeling?                   |
| Gebruikersbehoefte | Welke informatie of activiteit lijkt de functie te ondersteunen?                      |
| Sterke punten      | Wat is mogelijk nuttig aan de waargenomen aanpak?                                     |
| Zwakke punten      | Wat is onduidelijk, moeilijk te ontdekken of mogelijk inefficiënt?                    |
| Verkennende score  | Hoe effectief ondersteunt de waargenomen interface het specifieke onderzochte aspect? |
| Mogelijke les      | Wat kan StratForge van deze aanpak leren?                                             |
| Beslissing         | Overnemen, aanpassen, verder onderzoeken of vermijden.                                |
| Betrouwbaarheid    | Hoe zeker zijn de observatie en de interpretatie ervan?                               |

**Belangrijk onderscheid:** de gebruikersbehoefte en de mogelijke
usability-impact zijn interpretaties. Ze vormen geen direct bewijs dat
gebruikers een bepaald probleem of voordeel hebben ervaren.

### 3.4 Beoordelingsrubriek

De scores zijn verkennende beoordelingen van de onderzoeker. Het zijn
geen metingen uit een usabilitytest met deelnemers en ze mogen niet
worden geïnterpreteerd als objectieve beoordelingen van de
platformkwaliteit.

| Score                    | Betekenis                                                                                                                    |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| 1 — Slecht               | De waargenomen interface biedt zeer beperkte ondersteuning voor de specifieke taak of bevat aanzienlijke, zichtbare frictie. |
| 2 — Zwak                 | Er is enige nuttige ondersteuning aanwezig, maar belangrijke problemen met duidelijkheid of interactie blijven bestaan.      |
| 3 — Voldoende            | De taak kan worden uitgevoerd, hoewel merkbare verbeteringen mogelijk zijn.                                                  |
| 4 — Sterk                | De interface biedt duidelijke en nuttige ondersteuning voor de specifieke taak, met enkele beperkingen.                      |
| 5 — Uitstekend           | De waargenomen aanpak biedt bijzonder duidelijke en effectieve ondersteuning voor de specifieke taak.                        |
| N.v.t. — Niet beoordeeld | De functionaliteit was niet toegankelijk, is onvoldoende onderzocht of kon niet betrouwbaar worden beoordeeld.               |

Een score is uitsluitend van toepassing op het aspect dat in de
observatie wordt genoemd. Een score voor chart clarity vertegenwoordigt
bijvoorbeeld niet de algehele usability van het platform.

De beschikbaarheid van een functie alleen rechtvaardigt geen hoge score.
Een functie kan technisch beschikbaar zijn, terwijl de usability of
effectiviteit ervan niet is getest.

### 3.5 Betrouwbaarheidsniveaus

| Niveau    | Betekenis                                                                                        |
| :-------- | :----------------------------------------------------------------------------------------------- |
| Hoog      | De functie of het gedrag is direct waargenomen en duidelijk vastgelegd.                          |
| Gemiddeld | De observatie is gedaan, maar de bredere usability-implicaties of interpretatie blijven onzeker. |
| Laag      | Het beschikbare bewijs is beperkt of een belangrijk deel van het gedrag blijft onduidelijk.      |

### 3.6 Onderzoekstaken

Dezelfde taakcategorieën zijn gebruikt als gemeenschappelijk kader. Niet
ieder platform ondersteunde iedere taak of stelde alle relevante
functionaliteit beschikbaar.

**Taak A: Marktgegevens en signalen bekijken**

- Hoeveel ruimte wordt besteed aan de price chart?
- Zijn candlesticks goed leesbaar?
- Worden features over de price chart weergegeven of in afzonderlijke
  panelen?
- Kunnen gebruikers de timeframe en zichtbare date range wijzigen?
- Zijn buy-, sell- en exitmarkers van elkaar te onderscheiden?
- Kunnen gebruikers een grafieksignaal koppelen aan een trade in de trade
  log?
- Blijft de chart bruikbaar wanneer veel candles of markers worden
  weergegeven?

**Taak B: Een strategie configureren**

- Hoe selecteert of identificeert de gebruiker een strategie?
- Zijn parameters logisch gegroepeerd?
- Zijn labels, eenheden, standaardwaarden en geldige bereiken duidelijk?
- Zijn geavanceerde instellingen verborgen totdat ze nodig zijn?
- Toont het inschakelen van een functie alleen de relevante
  instellingen?
- Kunnen gebruikers de configuratie controleren voordat ze een test
  uitvoeren?
- Worden ongeldige instellingen uitgelegd bij de relevante
  bedieningselementen?

**Taak C: Een backtest vinden en starten**

- Is duidelijk waar de gebruiker moet beginnen?
- Is de primaire actie visueel herkenbaar?
- Hoe worden markten, assets en timeframes geselecteerd?
- Zijn date ranges en startkapitaal eenvoudig te configureren?
- Worden verplichte en optionele instellingen van elkaar onderscheiden?
- Worden instellingen in begrijpelijke taal uitgelegd?
- Zijn de standaardinstellingen logisch en kunnen gebruikers zien wat er
  daarna gebeurt?

**Taak D: Backtestresultaten begrijpen**

- Welke samenvattende metrics worden als eerste getoond?
- Worden rendement en risico samen gepresenteerd?
- Is de equity curve begrijpelijk?
- Zijn drawdowns zichtbaar en duidelijk uitgelegd?
- Kunnen gebruikers individuele trades inspecteren?
- Worden fees, slippage en aannames vermeld?
- Zijn eenheden, percentages en valuta’s gelabeld?
- Voorkomt de interface dat historische resultaten worden gepresenteerd
  als garantie voor toekomstige prestaties?

**Taak E: Experimenten opnieuw bekijken en vergelijken**

- Kunnen eerdere backtests opnieuw worden geopend?
- Is ieder resultaat gekoppeld aan de exacte strategieconfiguratie?
- Zijn asset, timeframe en date range zichtbaar?
- Kunnen runs worden vergeleken?
- Kunnen gebruikers nieuwe runs onderscheiden van oudere runs?
- Zijn namen, tijdstempels of versie-identificaties beschikbaar?
- Kunnen resultaten worden geëxporteerd of gedeeld zonder relevante
  context te verliezen?

**Taak F: Omgaan met laadschermen, fouten en lege toestanden**

- Is de voortgang zichtbaar tijdens een langlopende backtest?
- Legt de interface uit wat gebruikers kunnen doen tijdens het wachten?
- Worden lege grafieken en tabellen toegelicht?
- Zijn foutmeldingen bruikbaar en actiegericht?
- Blijft de configuratie van de gebruiker behouden na een fout?
- Worden ontbrekende gegevens of niet-ondersteunde perioden duidelijk
  gecommuniceerd?

Deze taken bieden een consistente beoordelingsstructuur. Een taak die
niet voldoende is onderzocht, mag niet als een negatieve bevinding
worden beschouwd.

------------------------------------------------------------------------

## 4. Platformobservaties

# 4.1 Pruviq

**Beoordelingsdatum:** 14 oktober 2026  
**Workflow:** Custom Strategy Builder en Backtesting

### A. Marktgegevens en chart feedback

**Observatie 1.1 — De chart weerspiegelt ingeschakelde features niet
zichtbaar**

- **Observatie:** Het inschakelen van features in de
  strategieconfiguratie veranderde de candlestick chart tijdens de
  beoordeling niet zichtbaar.
- **Gebruikersbehoefte:** Gebruikers moeten mogelijk begrijpen hoe
  geselecteerde features zich verhouden tot historische
  prijsbewegingen.
- **Sterke punten:** De chart en strategieconfiguratie zijn beschikbaar
  binnen dezelfde workflow.
- **Zwakke punten:** De chart gaf geen zichtbare feedback die
  overeenkwam met de ingeschakelde features. Het bleef onduidelijk of
  de features niet werden geplot, niet op de chart werden toegepast
  of pas na een andere actie werden bijgewerkt.
- **Verkennende score:** 2/5 voor zichtbare chart feedback.
- **Mogelijke les:** Toon ingeschakelde features op de chart wanneer
  dat relevant is. Maak onderscheid tussen features die intern worden
  gebruikt om signalen te genereren en features die visueel op de
  chart worden weergegeven.
- **Beslissing:** Verder onderzoeken en aanpassen.
- **Betrouwbaarheid:** Hoge betrouwbaarheid dat de chart tijdens de
  beoordeling onveranderd leek; de onderliggende oorzaak is niet
  vastgesteld.

**Observatie 1.2 — De chart heeft geen verklarende legenda**

- **Observatie:** De chart bevatte geen legenda die uitlegde wat de
  weergegeven lijnen voorstelden.
- **Gebruikersbehoefte:** Gebruikers moeten prijsreeksen, features en
  andere geplotte informatie kunnen identificeren.
- **Sterke punten:** Meerdere lijnen kunnen mogelijk verschillende
  soorten informatie in één chart communiceren.
- **Zwakke punten:** Zonder legenda weten gebruikers mogelijk niet welke
  lijn bij welke indicator hoort of wat deze voorstelt.
- **Verkennende score:** 2/5 voor het identificeren van chart-elementen.
- **Mogelijke les:** Bied een legenda met indicatornamen en, waar
  nuttig, parameterwaarden. Gebruik consistente kleuren in instellingen,
  legenda en chart. Sta gebruikers toe afzonderlijke reeksen te
  verbergen of weer te geven.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor het ontbreken van de legenda; gemiddeld
  voor de bredere usability-impact.

**Observatie 1.3 — Het bereik van de grafiek wijkt af van de
geselecteerde backtestperiode**

- **Observatie:** Er kon een startdatum voor een backtest in 2020 worden
  geselecteerd, terwijl de chart slechts een beperkt aantal candles
  toonde en niet zichtbaar de volledige geselecteerde historische
  periode weergaf.
- **Gebruikersbehoefte:** Gebruikers moeten begrijpen welke historische
  periode de chart weergeeft en welke periode voor de backtest wordt
  gebruikt.
- **Sterke punten:** Er is een chart beschikbaar om marktgegevens te
  inspecteren.
- **Zwakke punten:** Het zichtbare bereik leek niet overeen te komen met
  het geselecteerde backtestbereik. Daardoor is het moeilijker om te
  controleren welke gegevens worden bekeken.
- **Verkennende score:** 1/5 voor duidelijkheid over de date range,
  ervan uitgaande dat de chart bedoeld is om de volledige geselecteerde
  periode weer te geven.
- **Mogelijke les:** Toon het zichtbare char bereik en het
  daadwerkelijke backtestbereik duidelijk. Leg uit wanneer gegevens zijn
  afgekapt of niet beschikbaar zijn en bied bedieningselementen om door
  de volledige periode te navigeren.
- **Beslissing:** Verder onderzoeken; reproduceer het gedrag voordat het
  als een bevestigd technisch probleem wordt beschouwd.
- **Betrouwbaarheid:** Hoog dat het weergegeven bereik tijdens de
  beoordeling afweek; laag wat betreft de oorzaak.

**Observatie 1.4 — De chart staat ver onder de strategieconfiguratie**

- **Observatie:** De candlestick chart en toegepaste features stonden
  aanzienlijk lager dan de strategieconfiguratie. Gebruikers moesten
  omlaag scrollen om de chart te bekijken.
- **Gebruikersbehoefte:** Gebruikers willen mogelijk hun geconfigureerde
  features vergelijken met historische prijsbewegingen terwijl ze
  instellingen aanpassen.
- **Sterke punten:** Configuratie en chartinspectie zijn beschikbaar
  binnen dezelfde workflow.
- **Zwakke punten:** De verticale afstand tussen de bedieningselementen
  en de chart vereist extra scrollen en kan het configuratieproces
  onderbreken.
- **Verkennende score:** 2/5 voor de waargenomen layout.
- **Mogelijke les:** Overweeg op desktop een layout waarin
  strategieconfiguratie en chart naast elkaar zichtbaar zijn. Gebruik op
  kleinere schermen een gestapelde layout.
- **Beslissing:** De geïntegreerde workflow aanpassen en een geschikte
  layout onderzoeken.
- **Betrouwbaarheid:** Hoog voor de waargenomen positionering; gemiddeld
  voor de usability-impact.

### B. Strategieconfiguratie

**Observatie 1.5 — Aanvankelijk zijn slechts zes presets zichtbaar**

- **Observatie:** Na het opnieuw laden van de pagina werden aanvankelijk
  zes presets weergegeven. Meer presets werden zichtbaar nadat een
  uitklapbediening was gebruikt.
- **Gebruikersbehoefte:** Gebruikers moeten beschikbare startpunten
  kunnen ontdekken zonder aan te nemen dat de aanvankelijk zichtbare
  opties de volledige selectie vormen.
- **Sterke punten:** De ingeklapte weergave houdt de initiële interface
  compacter.
- **Zwakke punten:** Aanvullende presets kunnen over het hoofd worden
  gezien wanneer de uitklapbediening niet voldoende opvalt.
- **Verkennende score:** 3/5 voor de balans tussen compactheid en
  vindbaarheid.
- **Mogelijke les:** Toon eerst nuttige presets, label de
  uitklapbediening duidelijk en vermeld het totale aantal beschikbare
  presets. Overweeg categorieën of zoekfunctionaliteit wanneer de lijst
  groeit.
- **Beslissing:** Aanpassen en valideren.
- **Betrouwbaarheid:** Hoog voor het waargenomen gedrag; gemiddeld voor
  de impact.

**Observatie 1.6 — Presets, custom strategies en signal exits**

- **Observatie:** Pruviq biedt ingebouwde strategy presets, configuratie
  van custom strategies en de mogelijkheid om signal exits te
  configureren.
- **Gebruikersbehoefte:** Gebruikers willen mogelijk zowel een snel
  startpunt als de flexibiliteit om hun eigen entry- en exitlogica te
  definiëren.
- **Sterke punten:** Presets kunnen de initiële configuratie-inspanning
  verminderen, terwijl custom configuratie meer controle biedt.
  Exitconfiguratie biedt meer dan alleen het definiëren van
  entry-signalen.
- **Zwakke punten:** De relatie tussen presets, custom strategies en
  exitregels moet mogelijk explicieter worden gemaakt.
- **Verkennende score:** 4/5 voor de verscheidenheid aan
  configuratiebenaderingen; het algehele gebruiksgemak is niet volledig
  beoordeeld.
- **Mogelijke les:** Bied een duidelijke overgang van het selecteren van
  een preset naar het aanpassen van entry conditions en exit rules. Vat
  de resulterende strategielogica samen voordat een backtest wordt
  uitgevoerd.
- **Beslissing:** Verder onderzoeken en overwegen om aan te passen.
- **Betrouwbaarheid:** Hoog voor de beschikbaarheid van functies;
  gemiddeld voor de usability-implicaties.

**Observatie 1.7 — Strategiecreatie en backtesting zijn beschikbaar op
één pagina**

- **Observatie:** Gebruikers kunnen een strategie creëren en de
  bijbehorende backtest uitvoeren op dezelfde pagina.
- **Gebruikersbehoefte:** Gebruikers moeten van configuratie naar
  evaluatie kunnen gaan zonder onnodig hun context te verliezen.
- **Sterke punten:** Een verbonden workflow kan navigatie verminderen en
  iteratie ondersteunen.
- **Zwakke punten:** Een lange pagina kan gerelateerde
  bedieningselementen en resultaten verticaal van elkaar scheiden. Het
  probleem met de positionering van de chart uit observatie 1.4
  illustreert deze mogelijke afweging.
- **Verkennende score:** 3/5 voor de workflowstructuur.
- **Mogelijke les:** Houd strategiecreatie en backtesting binnen één
  verbonden workflow, maar organiseer de pagina in duidelijke secties en
  houd belangrijke feedback toegankelijk.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de structuur op één pagina; gemiddeld
  voor het algehele usabilityvoordeel.

### C. Backtestresultaten

**Observatie 1.8 — Equity curve vergelijkt strategieprestaties met
Bitcoin buy-and-hold**

- **Observatie:** De equity curve toont zowel de prestaties van de
  strategie als een Bitcoin buy-and-hold-benchmark.
- **Gebruikersbehoefte:** Gebruikers hebben context nodig om te
  beoordelen of een strategie beter presteerde dan simpelweg een asset
  aanhouden.
- **Sterke punten:** Een benchmark biedt aanvullende context naast
  alleen het rendement van de strategie.
- **Zwakke punten:** Bitcoin is mogelijk geen geschikte benchmark voor
  iedere geteste cryptocurrency. De asset, het startkapitaal, de date
  range en de verwerking van kosten moeten duidelijk zijn.
- **Verkennende score:** Niet beoordeeld als volledige analytische
  functie.
- **Mogelijke les:** Vergelijk de strategie met buy-and-hold voor de
  geselecteerde asset over dezelfde periode en met hetzelfde
  startkapitaal. Andere benchmarks kunnen afzonderlijk worden aangeboden
  wanneer hun doel duidelijk is.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de aanwezigheid van de vergelijking;
  gemiddeld voor de geschiktheid ervan voor verschillende assets.

**Observatie 1.9 — Maximum drawdown heeft een afzonderlijke chart**

- **Observatie:** Onder de equity curve wordt een maximum-drawdown-chart
  weergegeven.
- **Gebruikersbehoefte:** Gebruikers moeten verliezen ten opzichte van
  eerdere equity peaks begrijpen, in plaats van alleen het totale
  rendement te zien.
- **Sterke punten:** Een afzonderlijke chart geeft neerwaartse
  prestaties een eigen visuele ruimte.
- **Zwakke punten:** De bruikbaarheid hangt af van duidelijk gelabelde
  assen, percentages en de relatie tussen de drawdown- en
  equitytijdlijn.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Toon een duidelijk gelabelde drawdown-curve onder
  de equity curve en lijn de tijdassen op elkaar uit.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de aanwezigheid van de chart; gemiddeld
  voor de analytische effectiviteit.

**Observatie 1.10 — Backtestresultaten worden samenvattend
gepresenteerd**

- **Observatie:** Backtestresultaten bevatten een snelle samenvatting
  met toegang tot meer gedetailleerde informatie.
- **Gebruikersbehoefte:** Gebruikers moeten de belangrijkste uitkomst
  snel kunnen begrijpen, terwijl toegang tot diepgaandere analyses
  behouden blijft.
- **Sterke punten:** Een aanpak die begint met een samenvatting kan
  zowel snelle inspectie als gedetailleerder onderzoek ondersteunen.
- **Zwakke punten:** De effectiviteit hangt af van de geselecteerde
  metrics, hun uitleg en de vindbaarheid van de gedetailleerde
  informatie.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Presenteer eerst de belangrijkste performance- en
  riskmetrics, gevolgd door gedetailleerde trades, diagnostische
  informatie en aannames.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de waargenomen structuur; de
  effectiviteit van de presentatie is niet rechtstreeks met gebruikers
  getest.

**Observatie 1.11 — Eén strategie kan op meerdere coins worden getest**

- **Observatie:** Pruviq maakt het mogelijk dezelfde strategie in één
  run op tien coins te testen. De resultatentabel bevat coin, aantal
  trades, win rate, profit factor, rendement en TP/SL/TO-waarden.
- **Gebruikersbehoefte:** Gebruikers willen mogelijk vergelijken hoe één
  strategie zich gedraagt op verschillende assets zonder de volledige
  workflow te herhalen.
- **Sterke punten:** Batch testing vermindert repetitief werk en biedt
  een gemeenschappelijk resultatenformaat.
- **Zwakke punten:** Het hoogste rendement kan misleidend zijn wanneer
  het is gebaseerd op weinig trades, een hoger risico of andere
  marktomstandigheden. De betekenis en eenheden van TP/SL/TO moeten
  duidelijk zijn.
- **Verkennende score:** 4/5 voor de aanpak van batch testing.
- **Mogelijke les:** Ondersteun batch backtesting met een sorteerbare
  resultatentabel. Presenteer rendement samen met drawdown, aantal
  trades en andere relevante risicomaatstaven.
- **Beslissing:** Aanpassen; overwegen als latere functionele
  uitbreiding.
- **Betrouwbaarheid:** Hoog voor de beschreven functie en kolommen;
  gemiddeld voor het algehele analytische voordeel.

**Observatie 1.12 — Er worden strategiecijfers toegekend**

- **Observatie:** De backtest kent een score toe aan de strategie.
- **Gebruikersbehoefte:** Gebruikers willen mogelijk een snelle
  indicatie van hoe veelbelovend een resultaat lijkt.
- **Sterke punten:** Een score kan een resultatenpagina met veel
  informatie makkelijker scanbaar maken.
- **Zwakke punten:** Zonder uitleg van de beoordelingscriteria kunnen
  gebruikers de score interpreteren als garantie voor strategiekwaliteit
  of toekomstige winstgevendheid.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Leg, als StratForge een strategierating
  introduceert, de factoren erachter uit en behoud toegang tot de
  onderliggende metrics. Laat één score de risico- en
  robuustheidsanalyse niet vervangen.
- **Beslissing:** De beoordelingsmethodiek onderzoeken voordat deze
  wordt overgenomen.
- **Betrouwbaarheid:** Gemiddeld voor de aanwezigheid van de functie;
  laag voor de analytische validiteit omdat de beoordelingsformule
  onbekend is.

**Observatie 1.13 — Gedetailleerde trade list**

- **Observatie:** De trade list bevat symbol, entry time, exit time,
  PnL-percentage, PnL in dollars, reason en het aantal bars.
- **Gebruikersbehoefte:** Gebruikers moeten individuele trades kunnen
  inspecteren om te begrijpen hoe geaggregeerde resultaten tot stand
  zijn gekomen.
- **Sterke punten:** Zowel winst/verlies in percentages als in
  geldbedragen wordt weergegeven. Entry- en exittijden en redenen bieden
  aanvullende context.
- **Zwakke punten:** Tijdens de beoordeling kon de tabel niet worden
  gesorteerd of gefilterd en konden trades niet rechtstreeks worden
  gekoppeld aan de bijbehorende chartmarkers. De betekenis van sommige
  labels, waaronder “bars” en “reason”, werd niet volledig uitgelegd.
- **Verkennende score:** 2/5 voor interactie met en vindbaarheid van de
  trade list.
- **Mogelijke les:** Bied een sorteerbare en filterbare tradetabel met
  duidelijke eenheden en toelichtingen. Laat het selecteren van een
  trade waar praktisch mogelijk de entry en exit op de chart markeren.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de vermelde kolommen; gemiddeld voor de
  bredere usability-impact.

### D. Validatie en optimalisatie

**Observatie 1.14 — Out-of-sample-validatie**

- **Observatie:** Gebruikers kunnen een strategie valideren op
  out-of-sample (OOS)-gegevens en de OOS-splitsing selecteren. De
  resultaten bevatten het aantal trades, win rate, rendement, profit
  factor, maximum drawdown en OOS retention.
- **Gebruikersbehoefte:** Gebruikers moeten kunnen beoordelen of de
  prestaties van een strategie ook standhouden op gegevens die niet zijn
  gebruikt om de strategie te ontwikkelen.
- **Sterke punten:** Het onderscheid tussen ontwikkelresultaten en
  validatieresultaten wordt zichtbaar gemaakt. OOS retention biedt een
  aanvullende vergelijking.
- **Zwakke punten:** Gebruikers begrijpen mogelijk niet hoe de splitsing
  werkt of waarom de resultaten kunnen verschillen. De chronologische
  relatie tussen de in-sample- en OOS-perioden moet duidelijk zijn. Ook
  is niet vastgesteld of validatie een optionele uitbreiding is of
  onderdeel van iedere backtest.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Toon de in-sample- en OOS-perioden chronologisch,
  leg de splitsing uit en presenteer beide sets resultaten naast elkaar.
- **Beslissing:** Het presentatiepatroon aanpassen; de methodologie
  onderzoeken voordat specifieke metrics worden overgenomen.
- **Betrouwbaarheid:** Hoog voor de beschreven bedieningselementen en
  resultaten; gemiddeld voor de usability-implicaties.

**Observatie 1.15 — Monte Carlo-simulatie**

- **Observatie:** Gebruikers kunnen het aantal Monte Carlo-simulaties
  selecteren. De output bevat het mediane resultaat, de win probability,
  het pessimistische resultaat op het 5e percentiel en de maximum
  drawdown op het 95e percentiel.
- **Gebruikersbehoefte:** Gebruikers willen mogelijk begrijpen hoe
  gevoelig resultaten zijn voor variatie, in plaats van te vertrouwen op
  één historische uitkomst.
- **Sterke punten:** Percentielen en win probability kunnen minder
  gunstige uitkomsten communiceren naast een centrale uitkomst.
- **Zwakke punten:** Monte Carlo-output kan worden aangezien voor
  voorspellingen van toekomstige rendementen. De betekenis ervan hangt
  af van de simulatiemethode en aannames.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Leg de simulatiemethode uit in begrijpelijke taal,
  label percentielen duidelijk en maak onderscheid tussen gesimuleerde
  uitkomsten en voorspellingen of garanties.
- **Beslissing:** Het patroon voor het presenteren van onzekerheid
  aanpassen.
- **Betrouwbaarheid:** Hoog voor de beschreven output; gemiddeld voor de
  begrijpelijkheid ervan.

**Observatie 1.16 — Optimalisatie van stop-loss en take-profit**

- **Observatie:** Pruviq kan stop-loss- en take-profitparameters
  optimaliseren. De output bevat een Deflated Sharpe Ratio (DSR),
  informatie over uitgevoerde trials, het aantal observaties en
  gevoeligheidswaarden voor verschillende aantallen trials.
- **Gebruikersbehoefte:** Gebruikers moeten risk-managementparameters
  kunnen verkennen en tegelijkertijd het risico begrijpen van het
  selecteren van een configuratie die tijdens de optimalisatie simpelweg
  het beste presteerde.
- **Sterke punten:** De interface toont een statistische correctie voor
  multiple testing en geeft informatie over het aantal trials.
  Geselecteerde stop-loss- en take-profitwaarden kunnen worden toegepast
  voor verdere aanpassingen.
- **Zwakke punten:** De stop-loss- en take-profitbedieningselementen
  hadden tijdens de beoordeling geen direct zichtbare uitleg in de buurt
  van de velden. DSR, aantallen trials en gevoeligheidswaarden zijn
  geavanceerde concepten waarvoor contextuele hulp nodig is. Het
  weergegeven aantal trials vertegenwoordigt mogelijk niet ieder
  verworpen ontwikkelingsexperiment, en DSR alleen valideert de backtest
  niet.
- **Verkennende score:** 2/5 voor de vindbaarheid van parameteruitleg.
  De statistische validiteit en de algehele usability van de
  optimalisatie zijn niet beoordeeld.
- **Mogelijke les:** Label Stop-loss (SL) en Take-profit (TP)
  rechtstreeks en leg het doel ervan uit bij de bedieningselementen.
  Bied contextuele hulp voor DSR, aantallen trials en observaties.
  Vermeld aannames en beperkingen bij de resultaten.
- **Beslissing:** De contextuele uitleg aanpassen; de
  optimalisatiemethodologie onderzoeken voordat de statistische
  maatstaven worden overgenomen.
- **Betrouwbaarheid:** Hoog voor de weergegeven informatie en het
  waargenomen ontbreken van uitleg in de directe omgeving; gemiddeld
  voor de bredere impact.

### E. Experimentgeschiedenis

**Observatie 1.17 — Geschiedenis van backtestruns**

- **Observatie:** Gebruikers kunnen een geschiedenis van eerdere
  backtestruns bekijken.
- **Gebruikersbehoefte:** Gebruikers moeten experimenten opnieuw kunnen
  bekijken en begrijpen welke configuraties bepaalde resultaten hebben
  opgeleverd.
- **Sterke punten:** Een run history vermindert de noodzaak om eerdere
  experimenten te onthouden of handmatig vast te leggen.
- **Zwakke punten:** Tijdens de beoordeling was het niet mogelijk een
  eerdere run te bewerken of de bijbehorende features en instellingen
  voldoende te inspecteren.
- **Verkennende score:** 2/5 voor de waargenomen mogelijkheid om
  configuraties opnieuw te bekijken.
- **Mogelijke les:** Sla iedere run op met de strategieconfiguratie,
  data-periode, asset, timeframe en belangrijkste aannames. Laat
  gebruikers eerdere runs opnieuw openen en vergelijken.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de aanwezigheid van de run history en
  de waargenomen beperkingen; gemiddeld voor de bredere workflow-impact.

------------------------------------------------------------------------

# 4.2 Stratsemble

**Beoordelingsdatum:** 15 oktober 2026  
**Workflow:** Custom Strategy Builder en Backtesting

### A. Strategieconfiguratie

**Observatie 2.1 — Vier interfacemodi**

- **Observatie:** Gebruikers kunnen kiezen tussen de modi Simple,
  Advanced, Research en Quant. Iedere modus heeft een korte uitleg van
  het doel.
- **Gebruikersbehoefte:** Gebruikers hebben verschillende
  ervaringsniveaus en analytische behoeften.
- **Sterke punten:** Beschrijvingen helpen gebruikers het beoogde doel
  van iedere modus te begrijpen voordat ze een keuze maken.
  Verschillende modi kunnen het platform toegankelijker maken, terwijl
  geavanceerde functionaliteit behouden blijft.
- **Zwakke punten:** De mate waarin de interface en beschikbare
  functionaliteit tussen de modi verschillen, is niet volledig
  beoordeeld.
- **Verkennende score:** 5/5 voor de duidelijkheid van de
  modusbeschrijvingen.
- **Mogelijke les:** Overweeg progressive disclosure of duidelijk
  onderscheiden interfacemodi. Leg het doel van iedere modus uit en
  behoud configuraties wanneer gebruikers wisselen.
- **Beslissing:** Het concept aanpassen; verder onderzoeken hoe de modi
  in de praktijk verschillen.
- **Betrouwbaarheid:** Hoog voor de aanwezigheid van de vier modi en hun
  beschrijvingen; gemiddeld voor het bredere usabilityvoordeel.

**Observatie 2.2 — Natural-language strategy input**

- **Observatie:** Gebruikers kunnen een strategie in natuurlijke taal
  beschrijven. Stratsemble probeert de beschrijving te vertalen naar
  herkenbare regels en geeft aan welke onderdelen het niet kon
  interpreteren. Wanneer de interpretatie slaagt, worden de relevante
  strategievelden automatisch ingevuld.
- **Gebruikersbehoefte:** Gebruikers begrijpen mogelijk een handelsidee,
  maar vinden het lastig dit te vertalen naar technische
  regelconfiguratie.
- **Sterke punten:** Een succesvolle interpretatie kan handmatige
  configuratie verminderen. Niet-herkende onderdelen tonen is beter dan
  stilzwijgend gokken welke regels bedoeld zijn.
- **Zwakke punten:** Het geaccepteerde invoerformaat was moeilijk te
  voorspellen. Tijdens de beoordeling was de herkenning inconsistent en
  leverden sommige beschrijvingen niet de bedoelde regels op.
- **Verkennende score:** 2/5 op basis van de prompts die tijdens de
  beoordeling zijn geprobeerd.
- **Mogelijke les:** Behandel natural-language input als optionele
  snelkoppeling en niet als enige configuratiemethode. Toon de
  geïnterpreteerde regels ter controle, leg niet-herkende formuleringen
  uit en maak handmatige correctie mogelijk. Geef voorbeelden van
  ondersteunde beschrijvingen.
- **Beslissing:** Voorzichtig aanpassen; voorspelbare gestructureerde
  configuratie prioriteit geven.
- **Betrouwbaarheid:** Hoog voor het inconsistente gedrag bij de geteste
  prompts; gemiddeld voor de totaalscore omdat de promptsteekproef
  beperkt was.

**Observatie 2.3 — Form-based en canvas-editors**

- **Observatie:** Gebruikers kunnen kiezen tussen een form-based editor
  en een visuele canvas-editor. Beide vertegenwoordigen dezelfde
  onderliggende technische regels, maar de interactie verschilt. Het
  formulier gebruikt velden en bedieningselementen, terwijl de canvas
  drag-and-drop-elementen gebruikt die van links naar rechts zijn
  gerangschikt.
- **Gebruikersbehoefte:** Gebruikers kunnen verschillende voorkeuren
  hebben voor het definiëren en begrijpen van strategieregels.
- **Sterke punten:** Het formulier ondersteunt directe, gestructureerde
  configuratie. De canvas kan relaties en volgorde tussen regels
  visueler maken.
- **Zwakke punten:** Het onderhouden van twee editors kan de leercurve
  vergroten wanneer bedieningselementen of terminologie zich
  verschillend gedragen.
- **Verkennende score:** 4/5 voor de beschikbaarheid van alternatieve
  configuratiebenaderingen.
- **Mogelijke les:** Overweeg een form-first editor voor voorspelbare
  parameterinvoer en een visuele editor voor gebruikers die baat hebben
  bij het zien van relaties tussen regels. Beide moeten dezelfde
  onderliggende configuratie gebruiken wanneer ze worden aangeboden.
- **Beslissing:** Alleen aanpassen wanneer dit past bij de beoogde
  gebruikers en de ontwikkelscope.
- **Betrouwbaarheid:** Hoog voor de beschikbaarheid en
  interactiestijlen; gemiddeld voor de vergelijkende effectiviteit.

**Observatie 2.4 — Instellingen Long Only en Long + Short**

- **Observatie:** Gebruikers kunnen Long Only of Long + Short
  selecteren. Long Only biedt entry-filter- en exitregels. Long + Short
  biedt daarnaast regels voor short entry en short exit.
- **Gebruikersbehoefte:** Gebruikers moeten de handelsrichtingen kunnen
  selecteren die hun strategie ondersteunt, zonder irrelevante
  configuratievelden te zien.
- **Sterke punten:** De selectie verandert de beschikbare
  regelonderdelen zodat deze aansluiten op de gekozen richting.
- **Zwakke punten:** Gebruikers moeten het verschil begrijpen tussen
  short selling en het sluiten van een longpositie. Ook moet duidelijk
  zijn wat er gebeurt met bestaande regels wanneer de handelsrichting
  wordt gewijzigd.
- **Verkennende score:** 4/5 voor de organisatie van de configuratie.
- **Mogelijke les:** Gebruik een duidelijke instelling voor de
  strategierichting en toon alleen de relevante entry- en
  exitonderdelen. Behoud bestaande instellingen waar mogelijk en leg het
  gedrag van iedere richting uit.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor het beschreven gedrag; gemiddeld voor
  de usabilitybeoordeling.

**Observatie 2.5 — Configureerbare risk-managementinstellingen**

- **Observatie:** De risk-managementsectie bevat stop-loss, take-profit,
  trailing stop percentage, ATR-based stop-instellingen, time stop in
  bars en position sizing.
- **Gebruikersbehoefte:** Gebruikers moeten trade exits en position
  exposure kunnen configureren naast entry-signalen.
- **Sterke punten:** Verschillende risk controls zijn in één sectie
  beschikbaar en omvatten verliezen, winsten en de duur van trades.
- **Zwakke punten:** Geavanceerde opties kunnen moeilijk te begrijpen
  zijn zonder uitleg over eenheden, gedrag en de interactie met
  signal-based exits. Het is niet volledig beoordeeld hoe conflicterende
  exitvoorwaarden worden afgehandeld.
- **Verkennende score:** 4/5 voor de functionele dekking; gebruiksgemak
  is niet volledig beoordeeld.
- **Mogelijke les:** Groepeer risk controls afzonderlijk van
  entry-signalen. Leg iedere parameter uit bij de invoer, maak
  onderscheid tussen basis- en geavanceerde instellingen en verduidelijk
  het resulterende exitgedrag.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de beschikbare instellingen; gemiddeld
  voor de usability.

**Observatie 2.6 — Flexibele regelconstructie**

- **Observatie:** Regels kunnen prijzen, features of expliciete
  waarden vergelijken. Indicatorregels bevatten configureerbare
  features zoals SMA en RSI. Prijsregels kunnen verwijzen naar
  OHLC-waarden, volume en historische candles. Voorwaarden kunnen
  vergelijkingsoperatoren gebruiken, zoals above of below.
- **Gebruikersbehoefte:** Gebruikers hebben flexibiliteit nodig om
  handelsideeën uit te drukken zonder code te schrijven.
- **Sterke punten:** De rule builder ondersteunt een breed scala aan
  configureerbare vergelijkingen en historische referenties.
- **Zwakke punten:** Het aantal mogelijke combinaties kan onervaren
  gebruikers overweldigen. Gebruikers kunnen moeite hebben te
  voorspellen wat een regel betekent zonder een leesbare samenvatting of
  preview.
- **Verkennende score:** 4/5 voor flexibiliteit; vindbaarheid en het
  gemak waarmee complexe regels worden gemaakt, zijn niet volledig
  beoordeeld.
- **Mogelijke les:** Gebruik gestructureerde selectors voor bron,
  indicator, periode, vergelijkingsoperator en vergelijkingswaarde.
  Vertaal selecties naar een leesbare zin, zoals “RSI (14) is lager dan
  30”, en valideer onvolledige regels.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de beschikbare regelopties; gemiddeld
  voor de usability-implicaties.

**Observatie 2.7 — Strategy templates**

- **Observatie:** Gebruikers kunnen kiezen uit vijf strategy templates,
  een geselecteerde template bewerken of met een lege strategie
  beginnen.
- **Gebruikersbehoefte:** Gebruikers willen mogelijk een voorbeeld als
  startpunt zonder de vrijheid te verliezen om hun eigen strategie te
  definiëren.
- **Sterke punten:** Templates verminderen de initiële
  configuratie-inspanning en laten zien hoe een strategie kan worden
  opgebouwd. De lege optie behoudt de flexibiliteit.
- **Zwakke punten:** Gebruikers kunnen aannemen dat een ingebouwde
  template effectief is alleen omdat deze wordt aangeboden. De logica en
  aannames van iedere template moeten duidelijk zijn.
- **Verkennende score:** 4/5 voor de beschikbaarheid van startpunten.
- **Mogelijke les:** Bied begrijpelijke templates, leg de logica ervan
  uit en laat gebruikers iedere regel inspecteren en bewerken. Maak
  duidelijk onderscheid tussen voorbeeldstrategieën en strategieën die
  voor een specifiek doel zijn gevalideerd.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de beschikbare templates; gemiddeld
  voor de effectiviteit ervan.

**Observatie 2.8 — Doorzoekbare indicatorselectie**

- **Observatie:** Gebruikers kunnen kiezen uit een grote verzameling
  technische features via een scrollbare dropdown met zoekfunctie.
- **Gebruikersbehoefte:** Gebruikers moeten relevante features kunnen
  vinden bij het samenstellen van custom strategies.
- **Sterke punten:** Een brede selectie ondersteunt verschillende
  handelsideeën, terwijl zoeken individuele features makkelijker
  vindbaar maakt.
- **Zwakke punten:** Het nut van een grote verzameling hangt ook af van
  betekenisvolle categorisering en uitleg van de features.
- **Verkennende score:** 5/5 voor de waargenomen bedieningselementen
  voor indicator discovery.
- **Mogelijke les:** Bied doorzoekbare indicatorselectie, logische
  categorieën en beknopte beschrijvingen. Toon de geselecteerde
  indicator en de bijbehorende parameters duidelijk in de voltooide
  regel.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de zoek- en selectiefunctie; gemiddeld
  voor de bredere usability-impact.

### B. Backtestresultaten

**Observatie 2.9 — Equity curve vergeleken met buy-and-hold**

- **Observatie:** De backtest toont een chart die de prestaties van de
  strategie vergelijkt met een buy-and-hold-benchmark voor de
  geselecteerde asset.
- **Gebruikersbehoefte:** Gebruikers moeten kunnen beoordelen of de
  strategie beter presteerde dan het simpelweg aanhouden van dezelfde
  asset.
- **Sterke punten:** De benchmark biedt context voor het interpreteren
  van het rendement van de strategie.
- **Zwakke punten:** Startkapitaal, datums, asset en aannames moeten
  vergelijkbaar zijn om de vergelijking betekenisvol te maken.
- **Verkennende score:** 4/5 voor het vergelijkingspatroon.
- **Mogelijke les:** Toon de equity van de strategie en de
  buy-and-hold-benchmark van de geselecteerde asset samen, met
  duidelijke labels en vergelijkbare datums en startkapitaal.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de vergelijkingschart; gemiddeld voor
  de algehele analytische effectiviteit.

**Observatie 2.10 — Aparte drawdown-chart**

- **Observatie:** Direct onder de equity curve wordt een drawdown-chart
  weergegeven.
- **Gebruikersbehoefte:** Gebruikers moeten dalingen ten opzichte van
  eerdere equity peaks begrijpen naast het totale rendement.
- **Sterke punten:** Een afzonderlijke chart maakt risico zichtbaar in
  plaats van uitsluitend te vertrouwen op een samenvattende statistiek.
- **Zwakke punten:** De bruikbaarheid hangt af van duidelijk gelabelde
  percentages, een gedeelde tijdlijn en een begrijpelijke relatie met de
  equity curve.
- **Verkennende score:** 4/5 voor het presentatieconcept.
- **Mogelijke les:** Plaats een duidelijk gelabelde drawdown-chart onder
  de equity curve en lijn de tijdassen op elkaar uit.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de aanwezigheid van de chart; gemiddeld
  voor de effectiviteit ervan.

**Observatie 2.11 — Performance metrics met contextuele uitleg**

- **Observatie:** De backtest toont total return, prestaties ten
  opzichte van buy-and-hold in procentpunten, maximum drawdown, CAGR,
  aantal trades, win rate, time in market, profit factor, best trade,
  Sharpe ratio en worst trade. Iedere metric heeft een informatie-icoon
  met aanvullende uitleg.
- **Gebruikersbehoefte:** Gebruikers moeten de prestaties van een
  strategie kunnen evalueren en de betekenis van de weergegeven
  statistieken begrijpen.
- **Sterke punten:** De metrics omvatten rendement, risico,
  handelsactiviteit en risk-adjusted performance. Informatie-iconen
  bieden uitleg zonder permanent ruimte in te nemen.
- **Zwakke punten:** De samenvatting bevat een beperkte selectie in
  vergelijking met sommige uitgebreidere platforms. Minder metrics
  kunnen echter ook minder visuele drukte opleveren. De bruikbaarheid
  van de selectie hangt af van duidelijke definities en relevante
  uitleg.
- **Verkennende score:** 4/5 voor de combinatie van metrics en
  contextuele uitleg.
- **Mogelijke les:** Geef prioriteit aan een beknopte set performance-
  en riskmetrics, met contextuele uitleg voor technische statistieken.
  Plaats aanvullende metrics in een gedetailleerde weergave.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de genoemde metrics en
  informatie-iconen; gemiddeld voor de volledigheid van de
  metricselectie.

**Observatie 2.12 — Gedetailleerde analyse van de grootste drawdown**

- **Observatie:** De backtest identificeert de grootste drawdown van
  peak tot trough en toont twee datums, de diepte van de drawdown als
  percentage, de tijd tot de trough in dagen, de tijd onder het eerdere
  piekniveau in dagen en of herstel heeft plaatsgevonden.
- **Gebruikersbehoefte:** Gebruikers moeten de ernst en duur van de
  grootste daling begrijpen, inclusief of herstel heeft plaatsgevonden.
- **Sterke punten:** De presentatie gaat verder dan het
  maximum-drawdownpercentage door ook duur en herstelinformatie te
  tonen.
- **Zwakke punten:** Begrippen zoals “underwater” en het onderscheid
  tussen time to trough en herstelduur kunnen onbekend zijn. Labels
  moeten de tijdlijn ondubbelzinnig maken.
- **Verkennende score:** 4/5 voor de hoeveelheid contextuele informatie.
- **Mogelijke les:** Presenteer de peak-, trough- en hersteldatums,
  diepte en duur. Leg specialistische terminologie uit via contextuele
  hulp.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de beschreven statistieken; gemiddeld
  voor de usability.

**Observatie 2.13 — Maandelijks excess return vergeleken met
buy-and-hold**

- **Observatie:** De maandelijkse excess performance ten opzichte van
  buy-and-hold is georganiseerd per jaar en maand. De weergave toont het
  verschil met de benchmark in plaats van het ruwe rendement van iedere
  maand.
- **Gebruikersbehoefte:** Gebruikers moeten begrijpen wanneer een
  strategie beter of slechter presteerde dan de benchmark.
- **Sterke punten:** Maandelijkse resultaten tonen variatie door de tijd
  en helpen perioden van relatieve outperformance te identificeren.
- **Zwakke punten:** Excess return in procentpunten kan worden verward
  met het ruwe procentuele rendement.
- **Verkennende score:** 4/5 voor het analytische concept; de
  duidelijkheid hangt af van labels en uitleg.
- **Mogelijke les:** Bied maandelijkse vergelijkingen tussen strategie
  en benchmark met expliciete labels zoals “excess return
  (procentpunten)”. Leg de berekening uit en gebruik duidelijke visuele
  aanduidingen voor positieve en negatieve waarden.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de beschreven presentatie; gemiddeld
  voor het interpretatiegemak.

**Observatie 2.14 — Gedetailleerde trade log**

- **Observatie:** De trade log bevat side, entry date, exit date, P&L,
  het aantal aangehouden bars en de exit reason, bijvoorbeeld “signal”.
  De samenvattende informatie omvat de gemiddelde winnende trade,
  gemiddelde verliezende trade en gemiddelde holding period.
- **Gebruikersbehoefte:** Gebruikers moeten individuele trades kunnen
  inspecteren en patronen in gemiddelde winsten, verliezen en
  houdperiodes begrijpen.
- **Sterke punten:** De tabel combineert informatie op tradeniveau met
  nuttige samenvattende statistieken.
- **Zwakke punten:** Tijdens de beoordeling konden trades niet worden
  gesorteerd of gefilterd en werd een geselecteerde trade niet op de
  chart gemarkeerd.
- **Verkennende score:** 4/5 voor de verstrekte informatie; de
  interactiemogelijkheden waren beperkter.
- **Mogelijke les:** Bied een sorteerbare trade log met duidelijke exit
  reasons en samenvattende statistieken. Koppel trades waar mogelijk aan
  de bijbehorende chartmarkers.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de beschreven kolommen en samenvattende
  informatie; gemiddeld voor de algehele usability.

### C. Backtest geschiedenis

**Observatie 2.15 — Eerdere backtestruns zijn moeilijk opnieuw te
bekijken**

- **Observatie:** Eerdere backtestruns konden in de run history worden
  bekeken, maar tijdens de beoordeling bleek dat eerdere runs niet
  konden worden bewerkt of voldoende konden worden geanalyseerd op basis
  van hun oorspronkelijke features en instellingen.
- **Gebruikersbehoefte:** Gebruikers moeten een eerder experiment
  opnieuw kunnen bekijken en begrijpen welke configuratie de resultaten
  heeft opgeleverd.
- **Sterke punten:** Een run history biedt een beginpunt om terug te
  keren naar eerdere experimenten.
- **Zwakke punten:** Het bekijken van een eerder resultaat is minder
  nuttig wanneer de oorspronkelijke configuratie niet voldoende kan
  worden geïnspecteerd of hergebruikt.
- **Verkennende score:** 2/5 voor de waargenomen mogelijkheid om
  experimentconfiguraties opnieuw te bekijken.
- **Mogelijke les:** Sla iedere run op met de volledige
  strategieconfiguratie en relevante backtestinstellingen. Laat
  gebruikers eerdere experimenten opnieuw openen en vergelijken.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog wanneer het waargenomen gedrag van de
  history tijdens de beoordeling is gereproduceerd; anders moet deze
  observatie opnieuw worden gecontroleerd voordat zij als definitieve
  bevinding wordt opgenomen.

------------------------------------------------------------------------

# 4.3 StrategyNodes

**Beoordelingsdatum:** 15 oktober 2026
**Workflow:** Begeleide introductie, strategy editor en backtesting.

De beoordelingsdatum moet worden toegevoegd wanneer deze uit de
oorspronkelijke onderzoeksnotities kan worden achterhaald. De datum mag
niet worden geschat of verzonnen.

### A. Onboarding en strategieconfiguratie

**Observatie 3.1 — Optionele begeleide walkthrough**

- **Observatie:** Wanneer gebruikers het platform voor het eerst openen,
  wordt een optionele walkthrough aangeboden.
- **Gebruikersbehoefte:** Nieuwe gebruikers hebben mogelijk hulp nodig
  om te begrijpen waar ze moeten beginnen en hoe de workflow voor
  strategiecreatie is opgebouwd.
- **Sterke punten:** Een optionele walkthrough kan belangrijke
  functionaliteit introduceren zonder ervaren gebruikers te dwingen een
  introductie te doorlopen.
- **Zwakke punten:** De bruikbaarheid hangt af van de dekking en
  duidelijkheid van de walkthrough en de mogelijkheid om deze later
  opnieuw te openen.
- **Verkennende score:** 5/5 voor de waargenomen onboardingaanpak.
- **Mogelijke les:** Bied een optionele, over te slaan walkthrough die
  de belangrijkste workflow introduceert en later opnieuw kan worden
  bekeken.
- **Beslissing:** Het concept overnemen.
- **Betrouwbaarheid:** Hoog voor de waargenomen functie; gemiddeld voor
  de bredere effectiviteit zonder gebruikerstests.

**Observatie 3.2 — Visuele node-based strategy editor**

- **Observatie:** Gebruikers creëren strategieën door blokken toe te
  voegen uit categorieën zoals indicators, math, signals, flow, time en
  structure.
- **Gebruikersbehoefte:** Gebruikers moeten handelslogica kunnen
  definiëren zonder de volledige strategie in code te schrijven.
- **Sterke punten:** Een visuele editor maakt de bouwstenen van
  strategiecreatie expliciet en ondersteunt combinaties van features,
  voorwaarden en control logic.
- **Zwakke punten:** Gebruikers die niet vertrouwd zijn met node-based
  programming kunnen moeite hebben te begrijpen hoe blokken met elkaar
  worden verbonden, hoe gegevens door de strategie stromen en of de
  resulterende logica zich gedraagt zoals bedoeld.
- **Verkennende score:** 2/5 op basis van de waargenomen initiële
  complexiteit van de editor.
- **Mogelijke les:** Gebruik een visuele strategy builder alleen wanneer
  verbindingen en execution logic begrijpelijk zijn. Bied contextuele
  uitleg, duidelijke verbindingsregels en validatie. Overweeg een
  eenvoudiger form-based alternatief.
- **Beslissing:** Selectief aanpassen; maak een node editor niet de
  enige configuratiemethode zonder verder onderzoek.
- **Betrouwbaarheid:** Gemiddeld voor de waargenomen editor en
  blokcategorieën; hoog voor de gerapporteerde initiële complexiteit;
  gemiddeld voor de voorgestelde verbeteringen.

**Observatie 3.3 — Geïntegreerde chart en strategy editor**

- **Observatie:** De candlestick chart en node editor kunnen direct
  boven of onder elkaar worden geplaatst. Beide onderdelen kunnen in
  grootte worden aangepast.
- **Gebruikersbehoefte:** Gebruikers moeten marktgegevens kunnen
  inspecteren terwijl ze strategielogica opbouwen of wijzigen.
- **Sterke punten:** Een gedeelde workspace ondersteunt een iteratieve
  workflow tussen prijsinspectie en strategieconfiguratie. Door de
  grootte aan te passen kunnen gebruikers prioriteit geven aan een van
  beide onderdelen.
- **Zwakke punten:** Door panelen te verkleinen kan belangrijke
  informatie te klein of moeilijk te inspecteren worden. Gebruikers
  hebben mogelijk ook uitleg nodig over hoe wijzigingen in
  strategielogica de chart beïnvloeden.
- **Verkennende score:** 4/5 voor het concept van een geïntegreerde en
  aanpasbare workspace.
- **Mogelijke les:** Houd strategieconfiguratie en marktdatavisualisatie
  waar praktisch mogelijk binnen dezelfde workspace. Laat gebruikers
  panelen aanpassen, maar behoud goed leesbare standaardafmetingen.
- **Beslissing:** Het concept van de geïntegreerde workspace aanpassen,
  met behoud van een eenvoudige interface.
- **Betrouwbaarheid:** Hoog voor de waargenomen layout en het aanpassen
  van de grootte; gemiddeld voor de bredere usability-implicaties.

**Observatie 3.4 — Meerdere workspace layouts**

- **Observatie:** Gebruikers kunnen kiezen uit drie layouts:
  1.  Chart boven de editor met de backtest aan de rechterkant.
  2.  Chart, editor en backtest van links naar rechts gerangschikt.
  3.  Chart naast de editor met de backtest eronder.
- **Gebruikersbehoefte:** Verschillende taken kunnen verschillende
  hoeveelheden ruimte vereisen voor marktinspectie,
  strategieconfiguratie en resultatenanalyse.
- **Sterke punten:** Verschillende layouts laten gebruikers prioriteit
  geven aan specifieke onderdelen van de workflow.
- **Zwakke punten:** Te veel keuzes kunnen extra complexiteit toevoegen.
  Sommige layouts kunnen op kleinere schermen krap worden en gebruikers
  weten mogelijk niet welke layout het meest geschikt is.
- **Verkennende score:** 4/5 voor layoutflexibiliteit.
- **Mogelijke les:** Overweeg een klein aantal doelgerichte layouts, elk
  ontworpen rond een veelvoorkomende taak. Bied een logische
  standaardlayout en duidelijke layoutbediening.
- **Beslissing:** Alleen aanpassen wanneer meerdere panelen
  tegelijkertijd zichtbaar moeten blijven.
- **Betrouwbaarheid:** Hoog voor de waargenomen layoutopties; gemiddeld
  voor de usability-implicaties.

### B. Grafiek interactie

**Observatie 3.5 — Interactieve date-range-selectie en chartannotaties**

- **Observatie:** Gebruikers kunnen een date range selecteren door op
  twee punten in de candlestick chart te klikken. Ze kunnen ook
  annotaties toevoegen of verwijderen, waaronder trendlijnen,
  rechthoeken, Fibonacci-retracements en tekst.
- **Gebruikersbehoefte:** Gebruikers willen mogelijk specifieke
  historische perioden onderzoeken, prijspatronen markeren en
  observaties over marktgedrag vastleggen.
- **Sterke punten:** Directe chartinteractie ondersteunt gedetailleerde
  verkenning van prijsbewegingen.
- **Zwakke punten:** Gebruikers kunnen een visuele date-range-selectie
  verwarren met de daadwerkelijke backtestperiode wanneer de relatie
  ertussen niet duidelijk is. Drawing tools kunnen bovendien onnodige
  complexiteit toevoegen aan een workflow voor strategiecreatie.
- **Verkennende score:** 4/5 voor de beschikbaarheid van
  chartinteractie.
- **Mogelijke les:** Ondersteun directe chartinteractie wanneer dit de
  inspectie verbetert. Maak duidelijk onderscheid tussen visuele
  selecties en de daadwerkelijke backtestperiode en maak annotaties
  eenvoudig verwijderbaar.
- **Beslissing:** Date-range-selectie overwegen wanneer deze betrouwbaar
  integreert met de backtestconfiguratie. Behandel geavanceerde drawing
  tools als secundair.
- **Betrouwbaarheid:** Hoog voor de waargenomen charttools; gemiddeld
  voor de usability-implicaties.

### C. Backtestresultaten

**Observatie 3.6 — Samenvattende backtestmetrics**

- **Observatie:** De backtestsamenvatting toont total return, prestaties
  vergeleken met buy-and-hold, net result, worst drop, win rate en
  profit factor.
- **Gebruikersbehoefte:** Gebruikers moeten de belangrijkste uitkomst,
  de prestaties ten opzichte van een benchmark en de basiskenmerken van
  risico en handelsactiviteit begrijpen.
- **Sterke punten:** De samenvatting combineert winstgevendheid,
  benchmarkvergelijking, drawdown-gerelateerde informatie, win rate en
  profit factor.
- **Zwakke punten:** Gebruikers kunnen metrics verkeerd interpreteren
  zonder definities. Een hoge win rate betekent niet noodzakelijk dat
  een strategie winstgevend is. Ook moet de betekenis en berekening van
  “worst drop” expliciet worden gemaakt.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Toon een beknopte samenvatting van rendement,
  benchmarkprestaties, drawdown, aantal trades, win rate en profit
  factor. Leg de metrics uit en maak de aannames zichtbaar.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de waargenomen metrics; gemiddeld voor
  de algehele effectiviteit van de samenvatting.

**Observatie 3.7 — Account-balance-chart met optionele overlays**

- **Observatie:** De backtest bevat een account-balance-chart.
  Gebruikers kunnen kiezen of ze drawdown- en
  buy-and-hold-vergelijkingen willen weergeven.
- **Gebruikersbehoefte:** Gebruikers moeten begrijpen hoe de
  portfoliowaarde zich door de tijd ontwikkelt en hoe de prestaties zich
  verhouden tot een benchmark of dalingen.
- **Sterke punten:** De chart communiceert prestaties door de tijd.
  Optionele overlays laten gebruikers zich richten op specifieke
  vergelijkingen zonder alle reeksen tegelijk weer te geven.
- **Zwakke punten:** Gebruikers begrijpen mogelijk niet hoe de
  drawdown-overlay zich verhoudt tot de account-balance-curve, vooral
  wanneer verschillende schalen of visuele conventies worden gebruikt.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Bied een interactieve equity- of
  account-balance-curve met optionele benchmark- en drawdown-overlays.
  Label iedere reeks duidelijk en leg verschillende schalen of
  berekeningen uit.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de waargenomen functionaliteit;
  gemiddeld voor de usability-implicaties.

**Observatie 3.8 — Uitklapbare gedetailleerde performancestatistieken**

- **Observatie:** Aanvullende backteststatistieken zijn verborgen totdat
  de gebruiker een gedetailleerde sectie opent. De uitgeklapte weergave
  bevat wins en losses, aantallen trades, net results en profit factors,
  met uitsplitsingen voor alle trades, long trades en short trades.
- **Gebruikersbehoefte:** Gebruikers hebben toegang nodig tot
  gedetailleerde prestatie-informatie zonder gebruikers die alleen een
  overzicht nodig hebben te overweldigen.
- **Sterke punten:** Progressive disclosure houdt de initiële
  samenvatting overzichtelijk en behoudt toegang tot meer gedetailleerde
  analyses. Afzonderlijke resultaten voor long en short kunnen
  verschillen tussen handelsrichtingen zichtbaar maken.
- **Zwakke punten:** Belangrijke informatie kan worden gemist wanneer
  gebruikers de gedetailleerde sectie niet ontdekken. Veel metrics en
  herhaalde uitsplitsingen kunnen moeilijk scanbaar zijn zonder
  groepering of uitleg.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Gebruik uitklapbare secties voor secundaire
  statistieken. Groepeer gerelateerde metrics, maak aanvullende analyses
  vindbaar en geef prioriteit aan bruikbare maatstaven.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de waargenomen structuur en
  statistieken; gemiddeld voor de usability-implicaties.

**Observatie 3.9 — Risico- en balansstatistieken**

- **Observatie:** Gedetailleerde resultaten bevatten worst drop, hoogste
  balans, laagste balans en eindbalans.
- **Gebruikersbehoefte:** Gebruikers moeten het kapitaalverloop en de
  neerwaartse bewegingen tijdens een backtest begrijpen, niet alleen het
  eindresultaat.
- **Sterke punten:** Uitersten van de balans en drawdown-gerelateerde
  informatie bieden context over het risico dat nodig was om het
  gerapporteerde rendement te behalen.
- **Zwakke punten:** “Worst drop” kan dubbelzinnig zijn wanneer dit niet
  expliciet als drawdown wordt gedefinieerd. De hoogste en laagste
  balans verklaren op zichzelf niet de duur of het herstel van een
  verlies.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Toon maximum drawdown, begin- en eindbalans en
  relevante balansuitersten. Leg waar mogelijk de duur en het herstel
  van een drawdown uit.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de waargenomen statistieken; gemiddeld
  voor de voorgestelde uitbreidingen.

**Observatie 3.10 — Handelskosten en hun impact**

- **Observatie:** Gedetailleerde resultaten bevatten het resultaat vóór
  kosten, spread, commission, slippage, kosten per trade en het aandeel
  van de winst dat door kosten wordt verbruikt.
- **Gebruikersbehoefte:** Gebruikers moeten begrijpen of schijnbare
  winstgevendheid overeind blijft na realistische handelskosten.
- **Sterke punten:** Door kostencomponenten te scheiden wordt hun impact
  transparanter. Het tonen van het aandeel van de winst dat door kosten
  wordt verbruikt, helpt gebruikers de invloed van trading friction te
  beoordelen.
- **Zwakke punten:** Kostenramingen kunnen afwijken van daadwerkelijke
  execution costs. De aannames achter spread, commission en slippage
  moeten worden vermeld. Ook vereist de berekening van het door kosten
  verbruikte winstdeel uitleg wanneer de winst vóór kosten nul of
  negatief is.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Maak handelskosten expliciet in de configuratie en
  resultaten. Toon bruto- en nettoprestaties, specificeer relevante
  kostencomponenten en vermeld de aannames.
- **Beslissing:** Het principe van kostentransparantie overnemen.
- **Betrouwbaarheid:** Hoog voor de waargenomen uitsplitsing van kosten;
  hoog voor het belang van het communiceren van kosten­aannames.

**Observatie 3.11 — Geavanceerde risk-adjusted en statistische ratio’s**

- **Observatie:** Geavanceerde statistieken omvatten Sharpe ratio,
  Sortino ratio, Calmar ratio, SQN, CAGR, recovery factor, PSR en
  steekproefinformatie.
- **Gebruikersbehoefte:** Meer ervaren gebruikers willen mogelijk
  aanvullende manieren om rendement ten opzichte van risico,
  consistentie, herstel en de sterkte van het bewijs achter een
  strategie te beoordelen.
- **Sterke punten:** Aanvullende maatstaven kunnen zwakke punten
  zichtbaar maken die alleen het totale rendement verbergt. Een
  uitgebreide sectie houdt geavanceerde statistieken gescheiden van de
  initiële samenvatting.
- **Zwakke punten:** Geavanceerde ratio’s kunnen moeilijk te
  interpreteren zijn en afhankelijk zijn van keuzes in de berekening.
  Bij beperkte gegevens of weinig trades kunnen ze onbetrouwbaar zijn.
  Veel ratio’s zonder uitleg kunnen schijnzekerheid creëren.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Scheid essentiële performancemetrics van
  geavanceerde statistieken. Geef definities, vermeld
  berekeningsaannames en benadruk wanneer een kleine steekproef een
  resultaat minder betrouwbaar maakt.
- **Beslissing:** De aanpak van progressive disclosure aanpassen. Voeg
  geavanceerde ratio’s alleen toe wanneer hun betekenis en beperkingen
  duidelijk kunnen worden gecommuniceerd.
- **Betrouwbaarheid:** Hoog voor de waargenomen metrics; hoog voor de
  noodzaak om hun beperkingen uit te leggen.

**Observatie 3.12 — Position timeline**

- **Observatie:** De backtest bevat een position timeline die long- en
  shortposities aangeeft en winnende en verliezende trades van elkaar
  onderscheidt.
- **Gebruikersbehoefte:** Gebruikers moeten begrijpen wanneer een
  strategie in de markt was, in welke richting werd gehandeld en hoe
  posities zich verhouden tot de algehele prestaties.
- **Sterke punten:** Een tijdlijn kan handelsactiviteit begrijpelijker
  maken dan alleen een trade list. De tijdlijn kan herhaalde verliezen,
  perioden zonder trades en verschillen tussen long- en shortgedrag
  zichtbaar maken.
- **Zwakke punten:** De tijdlijn kan moeilijk te interpreteren zijn
  wanneer kleuren, positieduur, overlappende trades of entry- en
  exitmarkers niet duidelijk worden uitgelegd. Zonder
  grafieksynchronisatie kan het ook lastig zijn posities aan specifieke
  candles te koppelen.
- **Verkennende score:** Niet beoordeeld.
- **Mogelijke les:** Bied een position timeline die richting en uitkomst
  onderscheidt, met een duidelijke legenda en koppelingen naar de
  bijbehorende periode op de price chart en de trade log.
- **Beslissing:** Onderzoeken of dit voldoende waarde toevoegt naast de
  chart en trade log.
- **Betrouwbaarheid:** Gemiddeld voor de waargenomen tijdlijn; gemiddeld
  voor de usability-implicaties.

**Observatie 3.13 — Filterbare trade log**

- **Observatie:** In de trade log kunnen gebruikers afzonderlijke
  kolommen filteren.
- **Gebruikersbehoefte:** Gebruikers moeten specifieke trades,
  uitkomsten of voorwaarden kunnen isoleren bij het onderzoeken van
  strategieprestaties.
- **Sterke punten:** Filtering per kolom ondersteunt gericht onderzoek
  van grote tradelijsten en vermindert handmatig bladeren.
- **Zwakke punten:** Filters kunnen moeilijk te ontdekken zijn wanneer
  de bediening niet duidelijk is. Actieve filters moeten zichtbaar en
  eenvoudig te resetten zijn.
- **Verkennende score:** 5/5 voor de waargenomen filterfunctionaliteit.
- **Mogelijke les:** Bied een doorzoekbare of filterbare trade log met
  zichtbare actieve filters, eenvoudige resetbediening en relevante
  kolommen zoals entry- en exittijd, richting, winst of verlies en exit
  reason.
- **Beslissing:** Aanpassen.
- **Betrouwbaarheid:** Hoog voor de waargenomen functionaliteit;
  gemiddeld voor de bredere usability-impact.

**Observatie 3.14 — Trade-uitkomsten weergegeven op de price chart**

- **Observatie:** Na een backtest worden winnende en verliezende trades
  op de candlestick chart weergegeven. Er was een extra lijn zichtbaar,
  maar de betekenis ervan was onduidelijk.
- **Gebruikersbehoefte:** Gebruikers moeten numerieke resultaten kunnen
  koppelen aan de marktomstandigheden en prijsbewegingen die individuele
  trades hebben veroorzaakt.
- **Sterke punten:** Trademarkers bieden context voor entries, exits en
  uitkomsten. Ze kunnen gebruikers helpen inspecteren waar een strategie
  actief was.
- **Zwakke punten:** De extra, niet verklaarde lijn maakt de chart
  moeilijker te interpreteren. Trademarkers kunnen bovendien voor drukte
  zorgen wanneer veel trades worden weergegeven.
- **Verkennende score:** 3/5 voor de waargenomen chartpresentatie.
- **Mogelijke les:** Toon entry- en exitmarkers over de candlestick
  chart. Onderscheid winnende en verliezende uitkomsten op consistente
  wijze, bied een legenda voor iedere geplotte lijn en marker en laat
  gebruikers een trade selecteren om de details te bekijken.
- **Beslissing:** Het concept van trade overlays aanpassen, maar eerst
  de niet verklaarde lijn identificeren voordat conclusies over het doel
  ervan worden getrokken.
- **Betrouwbaarheid:** Hoog voor de zichtbare trade-uitkomsten; laag
  voor de niet verklaarde lijn.

------------------------------------------------------------------------

## 5. Synthese tussen platforms

### 5.1 Terugkerende observaties

De drie platforms laten verschillende benaderingen zien voor
strategieconfiguratie en backtestanalyse.

Er kwamen verschillende terugkerende thema’s naar voren:

1.  Strategieconfiguratie moet begrijpelijk zijn en niet alleen
    flexibel.
2.  Chartinformatie heeft duidelijke labels en een zichtbare relatie met
    de strategie-instellingen nodig.
3.  Backtestresultaten zijn gebaat bij een combinatie van prestatie- en
    risico-informatie.
4.  Individuele trades moeten in de context van de price chart kunnen
    worden geïnspecteerd.
5.  Historische experimenten zijn nuttiger wanneer de oorspronkelijke
    configuraties kunnen worden teruggehaald.
6.  Geavanceerde informatie moet toegankelijk blijven zonder de initiële
    interface te overweldigen.
7.  Historische resultaten en statistische maatstaven hebben uitleg en
    zichtbare aannames nodig.

Dit zijn terugkerende ontwerpthema’s, geen bewijs dat ieder platform
iedere taak slecht of goed ondersteunt.

### 5.2 Bevindingen vertaald naar requirements voor het ontwerp

| Gebruikersbehoefte                                                                                              | Ondersteunende observaties                                                                                                                                                             | Patroon of afweging                                                                                                                                                                                          | Voorgestelde verbetering voor StratForge                                                                                                                                                                  | Prioriteit |
| :-------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| Gebruikers moeten configuratie kunnen koppelen aan marktgedrag.                                                 | Pruviq plaatst de chart ver onder de configuratie. StrategyNodes biedt een geïntegreerde, aanpasbare workspace.                                                                        | Eén pagina kan de workflow verbonden houden, maar kan verticaal erg lang worden. Meerdere panelen kunnen de zichtbaarheid verbeteren, maar voegen complexiteit toe.                                          | Houd strategieconfiguratie en chart feedback op desktop samen zichtbaar. Gebruik op kleinere schermen een responsive, gestapelde layout.                                                                  | Hoog       |
| Gebruikers moeten features en chartelementen kunnen identificeren.                                              | De chart van Pruviq werd niet zichtbaar bijgewerkt wanneer features werden ingeschakeld en had geen legenda. StrategyNodes toonde een extra, niet verklaarde lijn.                     | Meer visuele informatie is alleen nuttig wanneer gebruikers deze kunnen identificeren.                                                                                                                       | Bied een duidelijke legenda, consistente kleuren, indicatorlabels en parameterwaarden. Maak onderscheid tussen features die intern worden gebruikt en features die op de chart worden geplot.             | Hoog       |
| Gebruikers moeten prestaties kunnen begrijpen op basis van meer dan één rendementswaarde.                       | Pruviq en StrategyNodes bieden resultatensamenvattingen en benchmarkvergelijkingen. Stratsemble bevat performance- en riskmetrics met contextuele uitleg.                              | Te weinig metrics verbergen belangrijke informatie; te veel metrics kunnen gebruikers overweldigen.                                                                                                          | Toon aanvankelijk net return, buy-and-hold-vergelijking, maximum drawdown, aantal trades, win rate en profit factor. Groepeer geavanceerde metrics in uitklapbare secties.                                | Hoog       |
| Gebruikers moeten het effect van handelskosten begrijpen.                                                       | StrategyNodes scheidt resultaten vóór kosten, spread, commission, slippage en kosten per trade.                                                                                        | Kostenmodellering voegt complexiteit toe, maar het weglaten van kosten kan resultaten misleidend maken.                                                                                                      | Vermeld fee- en slippageaannames en rapporteer bruto- en nettoprestaties. Leg uit hoe kosten worden gesimuleerd.                                                                                          | Hoog       |
| Gebruikers moeten trades in context kunnen onderzoeken.                                                         | Pruviq biedt een trade list; StrategyNodes toont trades op de chart en biedt een filterbare log en position timeline.                                                                  | Grafieken, tijdlijnen en tabellen vullen elkaar aan, maar kunnen onoverzichtelijk worden wanneer ze niet met elkaar verbonden zijn.                                                                             | Koppel traderecords aan hun entry- en exitmarkers. Bied een sorteerbare of filterbare tradetabel en synchroniseer selecties waar praktisch mogelijk.                                                      | Hoog       |
| Gebruikers hebben een voorspelbare manier nodig om strategieën te configureren.                                 | Pruviq biedt presets en custom rules. Stratsemble biedt templates en gestructureerde regels, naast form-, canvas- en natural-language-editors. StrategyNodes gebruikt een node editor. | Visuele en natural-language-builders kunnen flexibel zijn, maar introduceren ambiguïteit of een leercurve. Gestructureerde formulieren zijn voorspelbaarder, maar kunnen de expressiemogelijkheden beperken. | Behoud de workflow op basis van principe en parameters als standaard. Bied leesbare regelsamenvattingen en duidelijke uitleg. Behandel complexere editors als optioneel.                                  | Hoog       |
| Gebruikers moeten backtestresultaten kunnen vergelijken met een relevante baseline.                             | Alle drie de platforms bieden in enige vorm een buy-and-hold-vergelijking.                                                                                                             | Een benchmark is alleen betekenisvol wanneer asset, periode, startkapitaal en aannames vergelijkbaar zijn.                                                                                                   | Vergelijk de strategie met buy-and-hold voor de geselecteerde asset over dezelfde periode en op basis van hetzelfde kapitaal. Label excess return duidelijk in procentpunten wanneer deze wordt gebruikt. | Hoog       |
| Gebruikers moeten de ernst en duur van verliezen begrijpen.                                                     | Pruviq en Stratsemble tonen afzonderlijke drawdown-grafieken. Stratsemble biedt aanvullende informatie over drawdownduur en herstel.                                                      | Maximum drawdown is compact, maar verklaart niet het volledige herstelproces.                                                                                                                                | Toon maximum drawdown en een drawdown-curve die is uitgelijnd met de equity curve. Overweeg informatie over peak, trough, duur en herstel in een uitgebreide weergave.                                    | Hoog       |
| Gebruikers moeten weten welke instellingen invloed hebben op een backtest.                                      | De beoordeelde platforms tonen verschillende combinaties van strategie-instellingen, risk controls en backtestaannames.                                                                | Flexibele bedieningselementen kunnen belangrijke aannames verbergen.                                                                                                                                         | Toon vóór het uitvoeren van een backtest een beknopte configuratiesamenvatting met principe, asset, timeframe, dataperiode, startkapitaal en ingeschakelde functies.                                      | Hoog       |
| Gebruikers moeten onderscheid kunnen maken tussen zichtbare chartgegevens en de daadwerkelijke backtestperiode. | Het zichtbare char bereik bij Pruviq leek niet overeen te komen met de geselecteerde startdatum van de backtest.                                                                       | Een chart kan ingezoomd of afgekapt zijn, ook wanneer de onderliggende backtest een ander bereik gebruikt.                                                                                                   | Toon de daadwerkelijke backtest-date range en het zichtbare char bereik afzonderlijk. Leg ontbrekende gegevens of afkapping uit.                                                                          | Hoog       |
| Gebruikers moeten experimenten opnieuw kunnen bekijken en reproduceren.                                         | Pruviq en Stratsemble bieden run-history-functionaliteit, maar de beoordeelde workflows boden onvoldoende toegang tot eerdere configuraties.                                           | Geschiedenis zonder reproduceerbare instellingen is slechts een gedeeltelijke oplossing.                                                                                                                     | Sla iedere run op met strategieparameters, asset, timeframe, date range, startkapitaal, kosten en tijdstempel. Laat gebruikers runs opnieuw openen en vergelijken.                                        | Hoog       |
| Gebruikers hebben hulp nodig om te beginnen, zonder onnodige begeleiding.                                       | Stratsemble biedt interfacemodi; StrategyNodes biedt een optionele walkthrough.                                                                                                        | Modi en walkthroughs kunnen gebruikers helpen, maar ook extra keuzes introduceren.                                                                                                                           | Bied een beknopte optionele walkthrough en progressive disclosure. Houd de standaardworkflow eenvoudig.                                                                                                   | Gemiddeld  |
| Gebruikers mogen historische prestaties niet verwarren met robuuste toekomstige prestaties.                     | Pruviq biedt OOS-validatie, Monte Carlo-simulatie en optimalisatiestatistieken. Stratsemble en StrategyNodes bieden geavanceerde statistische maatstaven.                              | Geavanceerde analyse voegt diepgang toe, maar kan verkeerd worden begrepen of overdreven worden geïnterpreteerd.                                                                                             | Vermeld aannames, leg geavanceerde statistieken uit en presenteer een score of ratio niet als bewijs voor toekomstige winstgevendheid.                                                                    | Gemiddeld  |
| Gebruikers moeten geavanceerde metrics begrijpen.                                                               | Stratsemble gebruikt informatie-iconen; Pruviq biedt gedetailleerde resultatensecties; StrategyNodes groepeert geavanceerde statistieken in een uitgebreide weergave.                  | Contextuele hulp en progressive disclosure behouden details en verminderen tegelijkertijd de initiële drukte.                                                                                                | Leg technische termen uit bij de relevante metric. Groepeer geavanceerde statistieken op doel en communiceer beperkingen door de steekproefomvang.                                                        | Gemiddeld  |
| Gebruikers moeten historische perioden kunnen verkennen zonder per ongeluk de geteste periode te wijzigen.      | StrategyNodes biedt chart-based date selection en drawing tools.                                                                                                                       | Directe chartinteractie kan handig zijn, maar kan worden verward met de daadwerkelijke backtestconfiguratie.                                                                                                 | Wanneer chart-based date selection wordt geïmplementeerd, synchroniseer deze dan met de backtestdatums en toon de actieve periode bij de primaire actie.                                                  | Gemiddeld  |
| Gebruikers willen mogelijk assets vergelijken zonder een workflow te herhalen.                                  | Pruviq ondersteunt multi-asset backtesting en presenteert resultaten in een vergelijkingstabel.                                                                                        | Batch testing bespaart tijd, maar kan gebruikers aanmoedigen assets uitsluitend op basis van rendement te selecteren.                                                                                        | Overweeg batch testing nadat de workflow voor één asset duidelijk is. Vergelijk rendement, drawdown, aantal trades en profit factor op basis van vergelijkbare aannames.                                  | Gemiddeld  |

De prioriteiten zijn voorlopige ontwerpprioriteiten op basis van
relevantie voor StratForge. Het zijn geen gemeten gebruikersvoorkeuren
of een formele kosten-batenanalyse.

### 5.3 Belangrijke afwegingen

De observaties laten ook verschillende afwegingen zien die niet moeten
worden opgelost door simpelweg een ander platform te kopiëren.

**Workflow op één pagina tegenover afzonderlijke pagina’s**

Door configuratie, chart feedback en backtesting met elkaar verbonden te
houden, kan navigatie worden verminderd. Een enkele pagina kan echter
lang en moeilijk navigeerbaar worden. StratForge moet duidelijk
gestructureerde secties gebruiken en gerelateerde informatie visueel met
elkaar verbinden.

**Flexibiliteit tegenover gebruiksgemak**

Node editors, natural-language input en uitgebreide rule builders
ondersteunen complexe strategieën. Ze kunnen ook een leercurve
veroorzaken. StratForge moet prioriteit geven aan voorspelbare,
gestructureerde configuratie en geavanceerdere benaderingen alleen
introduceren wanneer er een duidelijke gebruikersbehoefte is.

**Informatiedichtheid tegenover duidelijkheid**

Geavanceerde metrics bieden aanvullende analytische waarde, maar kunnen
gebruikers overweldigen. Een beknopte samenvatting met uitklapbare
details is een geschikter startpunt dan alle metrics direct weergeven.

**Visuele voorkeur tegenover analytische bruikbaarheid**

Cards, tabellen en grafieken dienen verschillende doelen. De keuze moet
afhangen van de informatie die gebruikers moeten vergelijken en de
hoeveelheid informatie die moet worden weergegeven, niet alleen van
visuele voorkeur.

**Grafiek interactie tegenover configuratien auwkeurigheid**

Een date range rechtstreeks op een chart selecteren kan handig zijn. De
interface moet echter duidelijk maken of de selectie de daadwerkelijke
backtestperiode wijzigt of alleen het zichtbare char bereik.

------------------------------------------------------------------------

## 6. Ontwerpvragen voor StratForge

De benchmark biedt eerste richtingen voor het ontwerp, maar sommige
vragen vereisen verder onderzoek.

| Ontwerpvraag                                                                                                  | Huidige richting                                                                                                                                         | Resterende onzekerheid                                                                                               |
| :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| Moeten strategieconfiguratie en backtestresultaten afzonderlijke pagina’s zijn of onderdeel van één workflow? | Gebruik een verbonden workflow met chart en configuratie die samen zichtbaar zijn, en resultaten die toegankelijk zijn zonder context te verliezen.      | Valideer de layout met gebruikers en de geïmplementeerde applicatie.                                                 |
| Welke metrics moeten direct zichtbaar zijn?                                                                   | Begin met net return, buy-and-hold-vergelijking, maximum drawdown, aantal trades, win rate en profit factor.                                             | Bevestig dat de metrics nuttig zijn voor de beoogde gebruikers en correct door de backend worden berekend.           |
| Hoe moeten gebruikers van een gebeurtenis in de equity curve naar een trade kunnen gaan?                      | Synchroniseer waar praktisch mogelijk de equity curve, price-chart-markers, position timeline en trade log.                                              | Bepaal welke interacties technisch haalbaar zijn en welke de workflow verbeteren.                                    |
| Hoe moeten uitgeschakelde functies en parameters worden weergegeven?                                          | Toon parameters alleen wanneer de relevante functie is ingeschakeld en maak duidelijk welke functies uitgeschakeld zijn.                                 | De benchmark stelt niet rechtstreeks vast wat de beste weergave is voor de bestaande feature toggles van StratForge. |
| Hoe moeten timeframe, date range, fees en startkapitaal worden gepresenteerd?                                 | Gebruik een beknopte backtestconfiguratiesamenvatting bij de primaire actie en bewaar de exacte configuratie bij iedere run.                             | Valideer welke instellingen gedurende de volledige workflow zichtbaar moeten blijven.                                |
| Hoe moeten gebruikers experimenten opslaan en vergelijken?                                                    | Bewaar reproduceerbare configuraties en bied een history met relevante instellingen en resultaten.                                                       | Er is een aanvullende beoordeling nodig om de meest geschikte vergelijkingsinteractie te bepalen.                    |
| Hoe moeten loading-, error- en empty states werken?                                                           | Bied zichtbare voortgang, bruikbare foutmeldingen en uitleg wanneer geen trades worden gegenereerd. Behoud de configuratie van de gebruiker na een fout. | Deze toestanden zijn in de huidige benchmark onvoldoende beoordeeld.                                                 |
| Moet StratForge een node editor of natural-language strategy creation bieden?                                 | Geen van beide is op dit moment de standaard. Geef prioriteit aan gestructureerde configuratie en leesbare regelsamenvattingen.                          | Overweeg optionele editors pas opnieuw nadat is getest of de beoogde gebruikers deze nodig hebben.                   |
| Moet StratForge batch backtesting ondersteunen?                                                               | Overweeg dit nadat de workflow voor één asset duidelijk is.                                                                                              | Beoordeel de ontwikkelscope, runtime en gebruikersvereisten.                                                         |
| Hoe moeten robuustheid en statistische beperkingen worden gecommuniceerd?                                     | Leg kosten, perioden en aannames uit. Label geavanceerde statistische maatstaven en wek niet de indruk dat toekomstige prestaties gegarandeerd zijn.     | Bepaal welke validatiemethoden haalbaar zijn en hoe hun aannames nauwkeurig kunnen worden uitgelegd.                 |

------------------------------------------------------------------------

## 7. Beperkingen en reflectie op het onderzoek

### 7.1 Beperkingen

De bevindingen moeten worden geïnterpreteerd met inachtneming van de
volgende beperkingen.

**Beperkte platformselectie**

Er zijn slechts drie platforms beoordeeld. Ze bieden nuttige voorbeelden
van verschillende benaderingen, maar vertegenwoordigen niet ieder
beschikbaar crypto-backtestingplatform.

**Beperkte toegang**

Alleen gratis toegankelijke functionaliteit is meegenomen. Functies die
uitsluitend betaald beschikbaar zijn en abonnementsbeperkingen zijn niet
volledig gecontroleerd. Een functie die tijdens de beoordeling niet is
waargenomen, mag niet automatisch als niet beschikbaar worden beschouwd.

**Ongelijke dekking van onderzoekstaken**

Niet iedere taak kon op de drie platforms in gelijke mate worden
beoordeeld. Sommige functionaliteit was toegankelijker of eenvoudiger te
inspecteren dan andere. Het onderzoek ondersteunt daarom geen volledige
rangschikking van de platforms.

**Interpretatie door de onderzoeker**

De observaties zijn vastgelegd en geïnterpreteerd door één onderzoeker.
De scores zijn verkennende beoordelingen en geen objectieve metingen of
resultaten van een usabilitytest met deelnemers.

**Beperkt usabilitybewijs**

Het onderzoek bekeek het gedrag van interfaces, maar mat niet
systematisch de taakvoltooiing, fouten, tijd per taak of
gebruikerstevredenheid. Uitspraken over usability moeten daarom
voorzichtig blijven.

**Niet-geverifieerde onderliggende functionaliteit**

Een zichtbaar chartprobleem bewijst niet dat een indicator niet is
berekend of niet door de strategie is gebruikt. Evenmin bewijst de
aanwezigheid van een statistische metric dat de berekening correct is.

**Geen evaluatie van tradingprestaties**

Het onderzoek vergelijkt geen tradingrendementen, datakwaliteit,
execution models of de statistische validiteit van de strategieën van de
platforms.

### 7.2 Reflectie op de onderzoeksaanpak

De oorspronkelijke intentie was om de UI/UX van vergelijkbare platforms
te onderzoeken. Tijdens de beoordeling ging de aandacht echter ook uit
naar de beschikbare functionaliteit, strategieopties en statistische
maatstaven.

Dit leverde twee soorten bevindingen op:

- **Functionele bevindingen:** welke mogelijkheden beschikbaar zijn en
  welke relevant kunnen zijn voor StratForge.
- **Interfacebevindingen:** hoe deze mogelijkheden binnen de workflow
  worden gepresenteerd, geconfigureerd en met elkaar verbonden.

Beide soorten bevindingen zijn nuttig, maar beantwoorden verschillende
vragen. De beschikbaarheid van een functie bewijst niet dat de interface
eenvoudig te gebruiken is, en een visueel duidelijke interface bewijst
niet dat de onderliggende functionaliteit voldoende is.

Bij toekomstig onderzoek moeten deze twee aspecten afzonderlijk worden
vastgelegd. Functionele requirements moeten worden beoordeeld op
relevantie en haalbaarheid, terwijl interfacebenaderingen moeten worden
beoordeeld op duidelijkheid, vindbaarheid, consistentie en ondersteuning
van gebruikerstaken.

Het onderzoek laat ook zien dat het kopiëren van een functie niet
hetzelfde is als het overnemen van een nuttig ontwerppatroon. Een node
editor biedt bijvoorbeeld flexibiliteit, maar dat betekent niet dat dit
de meest geschikte standaard voor StratForge is. De relevante vraag is
of de aanpak de beoogde gebruiker helpt de taak uit te voeren.

### 7.3 Vervolgonderzoek

De volgende onderdelen moeten in een latere onderzoeks- of validatiefase
worden onderzocht:

1.  Test de herziene StratForge-workflow met gebruikers die realistische
    taken voor strategieconfiguratie en backtesting uitvoeren.
2.  Valideer of de geselecteerde samenvattende metrics begrijpelijk en
    voldoende zijn.
3.  Onderzoek hoe gebruikers verwachten dat eerdere backtests en hun
    configuraties worden opgeslagen en vergeleken.
4.  Evalueer loading-, error- en empty states aan de hand van
    realistische scenario’s.
5.  Beoordeel de duidelijkheid van chartlegenda’s, trademarkers en
    gekoppelde trade-informatie.
6.  Controleer de toegankelijkheid van de geïmplementeerde interface,
    waaronder toetsenbordnavigatie, focus states, contrast en feedback.

------------------------------------------------------------------------

## 8. Conclusie

De benchmark laat zien dat vergelijkbare platforms verschillende
benaderingen gebruiken voor strategieconfiguratie, chartinteractie en
backtestanalyse. Geen enkel platform biedt een oplossing die zonder meer
moet worden gekopieerd, zonder rekening te houden met de behoeften en
scope van StratForge.

De meest relevante bevindingen hebben betrekking op de relatie tussen
configuratie, marktgegevens en resultaten. Gebruikers moeten begrijpen
welke instellingen invloed hebben op een strategie, hoe de strategie
zich gedraagt op historische gegevens en welke individuele trades
bijdragen aan de uiteindelijke uitkomst.

De beoordeling benadrukt ook het belang van reproduceerbare
experimenten. Een eerder resultaat is minder nuttig wanneer de
oorspronkelijke strategieparameters en backtestaannames niet kunnen
worden teruggehaald.

Voor StratForge ondersteunen de bevindingen een gestructureerde
configuratieworkflow, duidelijke chart feedback, een beknopte
prestatiesamenvatting, transparante kosten­aannames, gekoppelde
trade-informatie en een backtest history waarin de oorspronkelijke
configuratie behouden blijft.

Geavanceerde functionaliteit zoals node-based editing, natural-language
strategy creation, batch testing en statistische optimalisatie moet
selectief worden overwogen. De aanwezigheid ervan op een ander platform
maakt deze functionaliteit niet automatisch geschikt voor StratForge.

De bevindingen bieden een startpunt voor ontwerpbeslissingen en verdere
validatie. Ze vervangen geen usabilitytests met de beoogde gebruikers.

------------------------------------------------------------------------

## 9. Bronnen

De platformobservaties in dit document zijn verzameld door directe
verkenning van de platforms die in hoofdstuk 2 worden genoemd.
