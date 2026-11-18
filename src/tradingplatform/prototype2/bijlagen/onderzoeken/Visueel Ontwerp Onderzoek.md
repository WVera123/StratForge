# Visual Design Research – StratForge

**Laatst bijgewerkt:** 10 november 2026  

------------------------------------------------------------------------

# 1. Onderzoeksdoel en afbakening

## 1.1 Achtergrond

Het eerste prototype van StratForge was voornamelijk gericht op het realiseren van de technische basis van het platform. Er is onderzoek gedaan naar het verwerken van historische cryptocurrency-marktgegevens, het selecteren van chartbibliotheken, het implementeren van strategieprincipes en het visualiseren van technische indicatoren. Dit heeft geleid tot een werkende basis voor het configureren van handelsstrategieën en het testen daarvan met historische marktgegevens.

Bij het tweede prototype verschuift de focus van technische haalbaarheid naar de bruikbaarheid en visuele presentatie van de applicatie. Hoewel de belangrijkste technische onderdelen beschikbaar zijn, moeten gebruikers ook de interface kunnen begrijpen, hun strategieën kunnen configureren en de resultaten van een backtest kunnen interpreteren.

StratForge is bedoeld voor gebruikers die cryptocurrency-handelsstrategieën willen opstellen en evalueren zonder zelf een volledige strategie te hoeven programmeren. Gebruikers moeten een basiskennis hebben van cryptocurrency en trading, maar uitgebreide programmeerkennis mag niet vereist zijn.

Het visuele ontwerp moet gebruikers daarom ondersteunen bij het begrijpen van strategieprincipes, het configureren van features en parameters, het doorlopen van de backtesting-workflow en het interpreteren van prestatiegegevens.

## 1.2 Onderzoeksdoel

Het doel van dit onderzoek is om een consistente visuele richting voor StratForge vast te stellen en te onderzoeken hoe visueel ontwerp gebruikers kan ondersteunen tijdens het maken van strategieën en het uitvoeren van backtests.

Het onderzoek bestudeert visuele referenties, verkent alternatieve interfaceontwerpen en evalueert geselecteerde concepten en wireframes met een expert en een potentiële gebruiker.

Het doel is niet om bestaande websites te kopiëren of één universeel superieur ontwerp te identificeren. In plaats daarvan wil het onderzoek ontwerpelementen identificeren die geschikt zijn voor StratForge en bepalen welke oplossingen de moeite waard zijn om te implementeren en verder te valideren. 

## 1.3 Centrale onderzoeksvraag

**Hoe kunnen visueel ontwerp en visuele begeleiding StratForge visueel consistent, begrijpelijk en effectief in gebruik maken bij het maken, configureren en evalueren van cryptocurrency-handelsstrategieën?**

## 1.4 Deelvragen

De centrale onderzoeksvraag is opgesplitst in zes deelvragen:
1.  **Visuele identiteit:** Welke kleuren, typografie, vormen en visuele stijlen dragen bij aan een professionele, betrouwbare en herkenbare visuele identiteit?
2.  **Visuele hiërarchie:** Hoe kan de interface onderscheid maken tussen belangrijke informatie, ondersteunende details en primaire acties?
3.  **Gebruikersbegeleiding:** Hoe kunnen lay-out, groepering en visuele aanwijzingen gebruikers helpen de workflow voor het maken van strategieën en backtests te begrijpen?
4.  **Informatiepresentatie:** Hoe kunnen complexe strategie-instellingen, grafieken en backtestresultaten worden gepresenteerd zonder de interface onnodig druk te maken?
5.  **Consistentie:** Hoe kan een samenhangende visuele taal worden behouden op de homepage, in de Strategy Creator, bij grafieken, resultaten en de backtestgeschiedenis?
6.  **Evaluatie:** Hoe kunnen alternatieve visuele ontwerpen en interfacestructuren worden geëvalueerd om te bepalen of ze gebruikers effectief ondersteunen?

## 1.5 Doelgroep en ontwerpeisen

De primaire doelgroep bestaat uit gebruikers die cryptocurrency-handelsstrategieën willen configureren en evalueren zonder zelf de strategiecode te hoeven schrijven.

Van deze gebruikers wordt verwacht dat zij een basiskennis hebben van cryptocurrency- en tradingconcepten. Zij moeten het doel van een handelsstrategie en de algemene betekenis van technische indicatoren enbacktestresultaten kunnen begrijpen. Uitgebreide programmeerkennis is echter geen vereiste.

Dit onderscheid is belangrijk: het mogelijk maken om strategieën zonder
code te configureren, betekent niet automatisch dat de onderliggende
tradingconcepten begrijpelijk zijn voor absolute beginners.

Op basis van het beoogde gebruik van StratForge moet de interface de
volgende gebruikersbehoeften ondersteunen:

| Gebruikersbehoefte                                  | Ontwerpeis                                                                                                 |
| :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| De beschikbare strategieprincipes begrijpen         | Presenteer principes met duidelijke namen en beknopte uitleg.                                              |
| Een strategie configureren zonder code te schrijven | Bied zichtbare en begrijpelijke bedieningselementen om features te selecteren en parameters te wijzigen.   |
| Begrijpen welke features bij een strategie horen    | Groepeer relevante features en maak duidelijk hoe deze samenhangen met het geselecteerde principe.         |
| Niet overweldigd raken door configuratieopties      | Organiseer informatie in overzichtelijke secties en toon gedetailleerde instellingen wanneer dat nodig is. |
| De huidige workflow begrijpen                       | Maak de relatie tussen strategieconfiguratie, preview, backtesting en resultaten zichtbaar.                |
| Backtestprestaties interpreteren                    | Presenteer metrics, grafieken, labels en legenda’s op een consistente manier.                              |
| Eerder werk terugvinden en opnieuw openen           | Bied een overzicht van opgeslagen strategieën en historische backtestruns.                                 |
| Fouten en applicatiestatussen begrijpen             | Toon relevante feedback dicht bij de actie of invoer die de feedback heeft veroorzaakt.                    |

Deze eisen vormen de basis voor de visuele ontwerpprincipes en
experimenten in dit onderzoek. Het zijn ontwerpeisen die zijn afgeleid
van de beoogde functionaliteit van StratForge, geen beweringen dat
iedere gebruikersbehoefte al door representatief gebruikersonderzoek is
bevestigd.

## 1.6 Afbakening

Het onderzoek richt zich op:

- Kleurenpaletten en het gebruik van kleur om hiërarchie en status aan
  te geven.
- Typografie, leesbaarheid en de presentatie van numerieke informatie.
- Vormen, randen, schaduwen en hoekafrondingen.
- Lay-out, witruimte, uitlijning en informatiedichtheid.
- Visuele hiërarchie en nadruk.
- Navigatie, oriëntatie en workflowbegeleiding.
- Knoppen, formulieren, selectiestatussen en interactiefeedback.
- Visuele toegankelijkheid, waaronder contrast en statussen die niet
  uitsluitend op kleur vertrouwen.
- De presentatie van strategieconfiguratie, grafieken, resultaten en
  backtestgeschiedenis.

**Buiten de scope:** Het evalueren van de winstgevendheid van
handelsstrategieën, het vergelijken van de technische prestaties van
backtestingplatforms of het bepalen welke nieuwe backtestingfeatures
ontwikkeld moeten worden. Functioneel gedrag wordt alleen meegenomen
wanneer dit invloed heeft op de duidelijkheid of visuele presentatie van
de interface.

------------------------------------------------------------------------

# 2. Onderzoeksmethodologie

## 2.1 Onderzoeksaanpak

Het onderzoek bestaat uit drie aanvullende activiteiten:

1.  **Analyse van visuele referenties:** Het onderzoeken van bestaande
    websites om visuele patronen en ontwerpbenaderingen te identificeren
    die relevant kunnen zijn voor StratForge.
2.  **Ontwerpexperimenten:** Het maken van alternatieve visuele
    concepten en wireframes om verschillende visuele richtingen,
    lay-outs en interactiepatronen te verkennen.
3.  **Vergelijkende gebruikersevaluatie:** Het verzamelen van feedback
    van een expert en een potentiële gebruiker om voorkeuren,
    bruikbaarheidsproblemen en mogelijke verbeteringen te identificeren.

De activiteiten hebben verschillende doelen. De analyse van referenties
levert inspiratie en ontwerphypothesen op. De experimenten vertalen deze
hypothesen naar concrete interfacealternatieven. De evaluatie levert
eerste feedback op de voorgestelde oplossingen.

De resultaten moeten daarom worden geïnterpreteerd als ontwerpinput voor
StratForge, en niet als bewijs dat één ontwerp objectief gezien het
meest gebruiksvriendelijk is.

## 2.2 Selectie van visuele referenties

Er zijn vijf websites geselecteerd als visuele referenties:

| Website                                              | Belangrijkste reden voor opname                              | Onderzochte ontwerpaspecten                                  |
| :--------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Ruben Marcus](https://www.rubenmarcus.dev/)         | Onderscheidende technische en expressieve visuele identiteit | Typografie, contrast, interactie en technische vormgeving    |
| [Infinity Tech Stack](https://infinitytechstack.uk/) | Informatierijke en technische presentatie                    | Informatiegroepering, cards, labels en visuele dichtheid     |
| [DISKO](https://disko.media/)                        | Productgerichte en stapsgewijze presentatie                  | Visuele storytelling, inhoudshiërarchie en navigatie         |
| [Wispr Flow](https://wisprflow.ai/)                  | Eigentijdse en expressieve softwarebranding                  | Typografie, kleuren, vormen, witruimte en productpresentatie |
| [FieldRank](https://fieldrank.run/)                  | Gestructureerde en datagerichte presentatie                  | Tabellen, ranglijsten, typografie en informatiehiërarchie    |

Deze websites hebben niet hetzelfde doel als StratForge en zijn geen
directe concurrenten. Ze zijn geselecteerd als visuele referenties omdat
ze verschillende benaderingen laten zien voor het presenteren van
technische informatie, softwareproducten en gestructureerde inhoud.

De selectie is verkennend. De websites bieden voorbeelden van visuele
benaderingen die onderzocht kunnen worden; hun opname in het onderzoek
betekent niet dat hun ontwerpen bewezen gebruiksvriendelijker of
geschikter zijn voor een backtestingapplicatie.

## 2.3 Beoordelingskader

Elke referentie wordt onderzocht aan de hand van dezelfde visuele
ontwerpcategorieën. Dit biedt een consistente structuur om de websites
met elkaar te vergelijken.

| Categorie                 | Wat wordt onderzocht                                                                | Relevantie voor StratForge                                                |
| :------------------------ | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| Kleur                     | Achtergronden, oppervlakken, accentkleuren en semantische kleuren                   | Onderscheid maken tussen interfacedeelgebieden en statussen communiceren  |
| Typografie                | Lettertypefamilies, groottes, gewichten, regelhoogtes en numerieke typografie       | Leesbaarheid van labels, parameters, grafieken en metrics                 |
| Vormen en oppervlakken    | Hoekafrondingen, randen, schaduwen en scheidingslijnen                              | Gerelateerde instellingen en informatie groeperen                         |
| Lay-out en witruimte      | Uitlijning, witruimte, gridstructuur en informatiedichtheid                         | Voorkomen dat configuratie- en resultatenschermen onoverzichtelijk worden |
| Visuele hiërarchie        | Grootte, contrast, positionering en nadruk                                          | Belangrijke informatie en acties herkenbaar maken                         |
| Navigatie en oriëntatie   | Navigatiebalken, tabs, genummerde secties en voortgangsindicatoren                  | Gebruikers helpen begrijpen waar ze zijn en wat de volgende stap is       |
| Uiterlijk van interacties | Knoppen, geselecteerde statussen, toggles, invoervelden en focusstatussen           | Communiceren welke elementen interactief of actief zijn                   |
| Beweging                  | Animaties, overgangen en laadfeedback                                               | Nuttige feedback geven zonder onnodige afleiding                          |
| Toegankelijkheid          | Contrast, tekstgrootte, zichtbaarheid van focus en kleuronafhankelijke aanwijzingen | Leesbare en bedienbare interfaces ondersteunen                            |

## 2.4 Onderscheid tussen observaties en interpretaties

Een belangrijk onderdeel van de analyse is het onderscheid tussen wat
direct zichtbaar is en wat daaruit wordt afgeleid.

Elke bevinding moet in twee onderdelen worden begrepen:

- **Observatie:** Een beschrijving van een element of gedrag dat op de
  referentiewebsite zichtbaar is.
- **Interpretatie:** Een mogelijke verklaring voor het doel ervan of een
  hypothese over hoe een vergelijkbare aanpak nuttig kan zijn voor
  StratForge.

Bijvoorbeeld:

| Observatie                                                        | Interpretatie                                                                                        |
| :---------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| Een website gebruikt genummerde secties om de inhoud op te delen. | Nummering kan gebruikers helpen afzonderlijke inhoudsgroepen te herkennen en een volgorde te volgen. |
| Een website gebruikt een sticky navigatiebalk.                    | Zichtbare navigatie kan gebruikers helpen belangrijke secties te bereiken tijdens het scrollen.      |
| Een website presenteert informatie in herhaalde tabelstructuren.  | Consistente tabelstructuren kunnen informatie gemakkelijker scanbaar en vergelijkbaar maken.         |

De interpretaties zijn ontwerphypothesen. Ze mogen niet worden
gepresenteerd als bewezen effecten op de gebruiksvriendelijkheid, tenzij
ze met gebruikers zijn geëvalueerd.

## 2.5 Ontwerpexperimenten

De analyse van visuele referenties wordt vertaald naar twee soorten
ontwerpexperimenten:

1.  Drie visuele concepten die verschillende visuele identiteiten
    verkennen.
2.  Wireframe-alternatieven die specifieke interfacestructuren en
    interactiepatronen verkennen.

De alternatieven worden waar mogelijk vergeleken met dezelfde
onderliggende inhoud. Dit helpt voorkomen dat verschillen in inhoud of
functionaliteit worden aangezien voor verschillen in visueel ontwerp.

## 2.6 Gebruikersevaluatie: A/B Testing en Usability Testing

A/B Testing en Usability Testing zijn uitgevoerd om de voorgestelde
visuele concepten en wireframe-alternatieven te evalueren.

Beide evaluaties maakten gebruik van wireframes die in Figma waren
geprototypeerd. Hierdoor konden deelnemers met de voorgestelde interface
interacteren en verschillende visuele en structurele benaderingen
vergelijken voordat deze werden geïmplementeerd.

**A/B Testing** is gebruikt om de visuele concepten en alternatieve
interfaceontwerpen te vergelijken. De focus lag op het identificeren van
voorkeuren van deelnemers met betrekking tot de visuele richting, de
workflowstructuur en afzonderlijke interfacecomponenten.

**Usability Testing** is gebruikt om te evalueren of deelnemers de
voorgestelde interface konden begrijpen en navigeren. De deelnemers
kregen taken die betrekking hadden op de belangrijkste workflow voor het
maken van strategieën en backtesting.

Twee deelnemers namen deel aan de evaluatie:

- Een expert op het gebied van econometrie en data-analyse.
- Een potentiële gebruiker van StratForge.

De evaluatie met de expert vond plaats op **6 november 2026** en de
evaluatie met de potentiële gebruiker op **7 november 2026**. Beide
sessies duurden **15 minuten**.

Beide deelnemers hebben alle toegewezen taken zonder hulp voltooid.

De evaluatie was verkennend en omvatte slechts twee deelnemers. De
resultaten bieden eerste kwalitatieve feedback, maar kunnen niet
aantonen dat het geselecteerde ontwerp even goed zal werken voor de
volledige doelgroep.

------------------------------------------------------------------------

# 3. Analyse van visuele referenties

## 3.1 Ruben Marcus – Technisch en expressief

**Referentie:** https://www.rubenmarcus.dev/

### Observaties

De homepage bevat:

- Een herhaalde aankondigingsbalk met korte zinnen over beschikbaarheid,
  technische specialisaties en locatie.
- Een hero-sectie waarin Ruben bij naam wordt geïntroduceerd, gevolgd
  door een ondersteunende tekst.
- Drie actieknoppen in de hero-sectie.
- Genummerde secties die de pagina-inhoud verdelen.
- Een overwegend zwart, groen en wit kleurenpalet.
- Portfolio-elementen met geanimeerde hover-effecten.
- Een combinatie van afgeronde hoofdtypografie en incidenteel typografie
  in typewriterm stijl.
- Een groen rastereffect dat de cursor volgt.

### Interpretatie voor StratForge

Het beperkte kleurenpalet creëert een herkenbare technische visuele
identiteit. Genummerde secties zorgen voor een duidelijke verdeling
tussen inhoudsgroepen, terwijl prominente acties de beschikbare
navigatieopties zichtbaar maken.

De interactieve effecten dragen bij aan het onderscheidende uiterlijk
van de website. Vergelijkbare effecten zijn echter mogelijk minder
geschikt op plekken waar gebruikers zich moeten concentreren op
financiële gegevens en configuratie-instellingen.

### Ontwerpmogelijkheden

- Een ingetogen technische visuele identiteit verkennen.
- Duidelijke typografie en sterk contrast gebruiken om belangrijke
  informatie te onderscheiden.
- Onderzoeken of sectienummering de oriëntatie binnen de workflow kan
  ondersteunen.
- Interactieve effecten selectief inzetten, waarbij functionele feedback
  belangrijker is dan decoratie.

**Ontwerphypothese:** StratForge kan een onderscheidende technische
uitstraling krijgen, terwijl de interface voldoende ingetogen blijft
zodat gebruikers zich kunnen concentreren op strategieconfiguratie en
backtestresultaten.

## 3.2 Infinity Tech Stack – Informatierijk en technisch

**Referentie:** https://infinitytechstack.uk/

### Observaties

De website bevat:

- Een sticky topnavigatie die naar belangrijke inhoudsgroepen verwijst.
- Een hero-sectie waarin een headline wordt gecombineerd met
  ondersteunende uitleg.
- Een compacte groep met numerieke highlights.
- Genummerde inhoudssecties.
- Verschillende gekleurde, doorschijnende rasterachtige elementen die
  naar andere pagina’s verwijzen.
- Een donkere, sfeervolle achtergrond.
- Indigo als prominente accentkleur, ondersteund door aanvullende
  categoriekleuren.
- Afgeronde panelen en cards.
- Hover-effecten die de visuele hoogte van cards vergroten.

### Interpretatie voor StratForge

De herhaalde inhoudsgroepen en categoriekleuren bieden een voorbeeld van
hoe gerelateerde informatie visueel kan worden georganiseerd.

Het gebruik van meerdere kleuren kan nuttig zijn om verschillende
categorieën te onderscheiden, hoewel te veel concurrerende accentkleuren
een technische interface moeilijker scanbaar kunnen maken.

De presentatie met cards biedt ook een mogelijke aanpak om
strategiefeatures en instellingen te groeperen. Cards moeten echter
alleen worden gebruikt wanneer ze relaties tussen elementen
verduidelijken.

### Ontwerpmogelijkheden

- Gerelateerde strategiefeatures en parameters groeperen.
- Kleur consistent gebruiken om betekenisvolle categorieën te
  onderscheiden.
- Onderzoeken hoeveel informatie binnen een card kan worden weergegeven
  zonder deze onnodig druk te maken.
- Persistente navigatie overwegen voor onderdelen die gebruikers
  regelmatig nodig hebben.

**Ontwerphypothese:** Een modulaire interface met duidelijk
onderscheiden inhoudsgroepen kan gebruikers helpen bij het navigeren
door complexe strategie-instellingen.

## 3.3 DISKO – Productgericht en stapsgewijs

**Referentie:** https://disko.media/

### Observaties

De website bevat:

- Een sticky navigatiebalk met een doorschijnend, vervaagd uiterlijk.
- Een hero-sectie met een korte verklarende alinea en twee acties.
- Een herhaalde balk met productmogelijkheden en formaten.
- Meerdere secties met herkenbare inhoudspatronen.
- Aanvullende feature-informatie die na de belangrijkste uitlegsecties
  wordt gepresenteerd.
- Een overwegend zwart, wit en turquoise kleurenpalet.
- Technische, op een typemachine geïnspireerde typografie in combinatie
  met een strak sans-seriflettertype.
- Subtiele effecten die samenhangen met scrollen en navigatie.

### Interpretatie voor StratForge

De herhaalde sectiestructuur creëert een consistent visueel ritme.
Gebruikers komen vergelijkbare inhoudsindelingen tegen wanneer zij door
de website navigeren.

De overgang van algemene productinformatie naar meer gedetailleerde
features biedt een voorbeeld van hoe informatie geleidelijk kan worden
geïntroduceerd.

Dit kan relevant zijn voor StratForge, waar gebruikers eerst de algemene
workflow moeten begrijpen voordat zij met gedetailleerde
strategie-instellingen werken.

Een stapsgewijze presentatie op een marketingwebsite bewijst echter niet
dat een step-by-step wizard de beste interface is voor
strategieconfiguratie. Een wizard en een single-page workspace moeten
afzonderlijk worden geëvalueerd.

### Ontwerpmogelijkheden

- Consistente sectiestructuren gebruiken.
- Essentiële informatie vóór minder vaak gebruikte details presenteren.
- Overwegen hoe productvoorbeelden complexe functionaliteit kunnen
  uitleggen.
- Onderzoeken of workflowstappen visueel van elkaar gescheiden moeten
  worden.

**Ontwerphypothese:** Een duidelijke visuele volgorde kan gebruikers
helpen de relatie tussen strategieconfiguratie, backtesting en
resultaten te begrijpen, zonder hen noodzakelijkerwijs door een wizard
te dwingen.

## 3.4 Wispr Flow – Expressief en productgericht

**Referentie:** https://wisprflow.ai/

### Observaties

De homepage bevat:

- Een duidelijk productlabel en een beknopte productintroductie.
- Een hero-sectie met een aanvullend zwevend tekstelement.
- Een numerieke vergelijking om de waarde van het product te
  communiceren.
- Een reeks secties die het product uitleggen.
- Herhaalde combinaties van sectiekoppen, verklarende tekst en
  productafbeeldingen.
- Een combinatie van redactionele serifkoppen en moderne
  sans-seriftekst.
- Warme, lichte achtergrondkleuren en ingetogen groene accenten.
- Afgeronde knoppen en inhoudsoppervlakken.
- Veel witruimte.
- Subtiele animaties tijdens scrollen en interactie.

### Interpretatie voor StratForge

De combinatie van typografie, witruimte en productafbeeldingen geeft de
website een duidelijke visuele identiteit.

Het herhaalde gebruik van koppen, verklarende tekst en
productvoorbeelden zorgt voor een consistente structuur. Dit kan nuttig
zijn bij het introduceren van strategieprincipes of het uitleggen hoe
gebruikers een strategie kunnen configureren en evalueren.

De expressieve vormgeving moet zorgvuldig worden aangepast. StratForge
presenteert grafieken, parameters en financiële metrics, waardoor
visuele effecten niet mogen concurreren met de informatie die gebruikers
moeten interpreteren.

### Ontwerpmogelijkheden

- Een duidelijke en herkenbare visuele identiteit gebruiken.
- Sterke koppen combineren met goed leesbare ondersteunende tekst.
- Interfacevoorbeelden of visuele voorbeelden gebruiken om
  functionaliteit uit te leggen.
- Afgeronde vormen en subtiele effecten consistent toepassen.
- Voldoende contrast en leesbaarheid behouden in informatiedichte
  onderdelen.

**Ontwerphypothese:** Een verzorgde en toegankelijke visuele identiteit
kan StratForge laten aanvoelen als een doordacht softwareproduct, zonder
de duidelijkheid van technische informatie te verminderen.

## 3.5 FieldRank – Gestructureerd en datagericht

**Referentie:** https://fieldrank.run/

### Observaties

De website bevat:

- Een recent wedstrijdresultaat dicht bij het begin van de pagina.
- Afzonderlijke algemene ranglijsten voor mannen en vrouwen.
- Herhaalde tabelstructuren.
- Hergebruikte sectiekoppen en verklarende beschrijvingen.
- Lichte achtergrondoppervlakken en donkere typografie.
- Een combinatie van reguliere typografie en typografie in typewriterm
  stijl voor gedetailleerde metrics.
- Compacte knoppen en gestructureerde inhoudsgebieden.
- Consistente afstanden tussen hoofdsecties en binnen tabellen.

### Interpretatie voor StratForge

De herhaalde tabelstructuren vormen een bruikbare referentie voor het
presenteren van informatie die gebruikers moeten kunnen scannen en
vergelijken.

Het onderscheid tussen algemene tekst en gedetailleerde numerieke
informatie biedt ook een mogelijke aanpak voor backtestresultaten.

Een datagerichte lay-out kan vooral relevant zijn voor de
backtestgeschiedenis, waar gebruikers meerdere runs moeten vergelijken
en relevante prestatiegegevens willen herkennen.

### Ontwerpmogelijkheden

- Consistente tabelstructuren gebruiken voor historische runs en
  gedetailleerde resultaten.
- Numerieke informatie consistent uitlijnen.
- Koppen, beschrijvingen en metrics onderscheiden door middel van
  typografie.
- Ingetogen visuele nadruk gebruiken om belangrijke resultaten te
  benadrukken.
- Voldoende witruimte behouden om informatie met een hoge dichtheid
  leesbaar te houden.

**Ontwerphypothese:** Een gestructureerde, informatiegerichte
presentatie kan gebruikers helpen historische backtests te vergelijken
zonder onnodig grote cards te vereisen.

------------------------------------------------------------------------

# 4. Vergelijking tussen de visuele referenties

De referentiewebsites laten verschillende benaderingen zien voor visuele
identiteit, informatiepresentatie en interactie.

De volgende vergelijking vat de meest relevante patronen en hun
mogelijke toepassing op StratForge samen.

| Ontwerpdimensie     | Relevante observaties uit de referenties                                                                                    | Ontwerprichting voor StratForge                                                                                                                |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| Kleur               | In de referenties worden contrastrijke paletten, ingetogen accentkleuren en meerdere categoriekleuren gebruikt.             | Gebruik neutrale oppervlakken als basis en reserveer accentkleuren voor betekenisvolle categorieën en statussen.                               |
| Typografie          | De referenties combineren expressieve koppen, leesbare sans-seriftekst en in sommige gevallen technische typografie.        | Geef prioriteit aan een consistent, goed leesbaar typografiesysteem. Gebruik verschillende gewichten en groottes om hiërarchie aan te brengen. |
| Vormen en randen    | Zowel scherpe als afgeronde oppervlakken worden gebruikt om informatie te groeperen.                                        | Gebruik consistente componentvormen, met ingetogen randen en hoekafrondingen.                                                                  |
| Lay-outdichtheid    | Sommige referenties gebruiken compacte informatiegroepen, terwijl andere veel witruimte en opeenvolgende secties gebruiken. | Zoek een balans tussen witruimte en de noodzaak om strategie-instellingen en backtestgegevens efficiënt weer te geven.                         |
| Visuele begeleiding | Genummerde secties, herhaalde lay-outs en sticky navigatie komen in verschillende referenties voor.                         | Maak workflowstappen en belangrijke acties gemakkelijk herkenbaar.                                                                             |
| Interactiestatussen | Hover-effecten, focus-highlights en visuele veranderingen worden gebruikt om interactie aan te geven.                       | Maak geselecteerde, ingeschakelde, uitgeschakelde, gefocuste en ladende statussen visueel onderscheidend.                                      |
| Beweging            | De referenties variëren van decoratieve animaties tot minimale functionele feedback.                                        | Geef prioriteit aan feedback die een daadwerkelijke statusverandering communiceert.                                                            |

## 4.1 Implicaties voor StratForge

De analyse van de referenties suggereert drie brede ontwerprichtingen:

**1. Technische duidelijkheid**

De interface moet communiceren dat StratForge een technisch product is.
Dit kan worden bereikt met gestructureerde lay-outs, leesbare typografie
en een duidelijke presentatie van numerieke informatie.

**2. Visuele begeleiding**

Gebruikers moeten de huidige sectie kunnen herkennen, de relatie tussen
verschillende onderdelen van de workflow begrijpen en de volgende
relevante actie kunnen herkennen.

**3. Gecontroleerde visuele expressie**

De applicatie moet een herkenbare visuele identiteit hebben, maar
decoratieve elementen mogen niet concurreren met grafieken, parameters,
metrics of andere belangrijke informatie.

Deze richtingen vormen het uitgangspunt voor de ontwerpprincipes en
visuele experimenten in de volgende hoofdstukken.

------------------------------------------------------------------------

# 5. Visuele ontwerpprincipes

De analyse van de referenties is vertaald naar zes ontwerpprincipes.
Deze principes beschrijven wat de StratForge-interface moet communiceren
en bieden criteria om de ontwerpalternatieven te evalueren.

## 5.1 Visuele hiërarchie

De interface moet een duidelijke hiërarchie aanbrengen tussen primaire
informatie, ondersteunende details en beschikbare acties.

Voor StratForge moeten gebruikers het volgende kunnen herkennen:

- De huidige strategie en het geselecteerde principe.
- De geselecteerde cryptocurrency en timeframe.
- Ingeschakelde features en bijbehorende parameters.
- Het geselecteerde bereik van marktgegevens.
- Een samenvatting van de geconfigureerde strategie.
- De volgende relevante actie, zoals een preview bekijken of een
  backtest uitvoeren.
- Belangrijke backtestresultaten en prestatiemetrics.

**Evaluatievraag:** Kunnen gebruikers snel het doel van een sectie, de
belangrijkste informatie en de beschikbare actie herkennen?

## 5.2 Progressive Disclosure

Strategieconfiguratie kan meerdere features en parameters omvatten.
Wanneer alle beschikbare opties tegelijkertijd worden weergegeven, kan
de interface moeilijk scanbaar worden.

Tegelijkertijd kan het verbergen van te veel informatie het voor
gebruikers lastig maken om hun configuratie te begrijpen.

De interface moet daarom:

- Veelgebruikte informatie en acties toegankelijk houden.
- Gerelateerde features en parameters groeperen.
- Gedetailleerde instellingen tonen wanneer een feature wordt
  geselecteerd of uitgeklapt.
- Ingeschakelde en uitgeschakelde features duidelijk onderscheiden.
- Optionele configuratiedetails toegankelijk houden zonder de
  hoofdinterface te overladen.

Progressive Disclosure wordt beschouwd als een ontwerpbenadering en niet
als een gegarandeerde verbetering. De effectiviteit hangt ervan af of
gebruikers de informatie die zij nodig hebben nog steeds kunnen vinden.

**Evaluatievraag:** Kunnen gebruikers toegang krijgen tot gedetailleerde
configuratieopties zonder dat de hoofdinterface onnodig complex wordt?

## 5.3 Oriëntatie

Gebruikers moeten begrijpen waar zij zich bevinden in het proces van
strategiecreatie en backtesting.

De beoogde workflow is:

**Strategy → Configuration → Preview → Backtest → Results**

De interface moet de relatie tussen deze stappen communiceren via
sectiekoppen, navigatie of andere visuele indicatoren.

Gebruikers moeten ook relevante configuratie-informatie kunnen bekijken
zonder de context van hun huidige taak te verliezen.

**Evaluatievraag:** Kunnen gebruikers hun huidige positie in de workflow
begrijpen en bepalen wat zij vervolgens kunnen doen?

## 5.4 Visuele gebruiksaanwijzingen

Interactieve elementen moeten duidelijk maken hoe ze gebruikt kunnen
worden.

Gebruikers moeten onderscheid kunnen maken tussen:

- Knoppen en links.
- Uitklapbare secties.
- Geselecteerde en niet-geselecteerde cards.
- Ingeschakelde en uitgeschakelde features.
- Bewerkbare invoervelden.
- Interactieve grafiekelementen.
- Acties die op dat moment niet beschikbaar zijn.

**Evaluatievraag:** Kunnen gebruikers interactieve elementen herkennen
en hun doel begrijpen zonder onnodig te hoeven experimenteren?

## 5.5 Feedback en interfacestatussen

De interface moet het resultaat van gebruikersacties en veranderingen in
de applicatiestatus communiceren.

Belangrijke situaties zijn:

- Het in- of uitschakelen van een strategiefeature.
- Het laden en afronden van een preview.
- Het tonen van validatiefouten.
- Het opslaan van een strategie.
- Het selecteren van een trade en het markeren van bijbehorende
  grafiekinformatie.
- Het uitvoeren van een backtest.
- Het afronden van een backtest.
- Het weergeven van een leeg resultaat of niet-beschikbare gegevens.

Feedback moet zichtbaar zijn dicht bij de relevante actie of invoer. Een
validatiefout die een backtest verhindert, moet bijvoorbeeld bij de
backtestactie worden weergegeven en niet alleen bovenaan de pagina.

Beweging moet voornamelijk functionele feedback communiceren, zoals een
laadanimatie of een overgang tussen statussen.

**Evaluatievraag:** Kunnen gebruikers herkennen wat er na een actie is
veranderd en de huidige applicatiestatus begrijpen?

## 5.6 Visueel vertrouwen en data duidelijkheid

StratForge presenteert financiële informatie waarop gebruikers kunnen
vertrouwen bij het evalueren van strategieën. De interface moet
resultaten daarom duidelijk presenteren en visuele weergaven vermijden
die een misleidende indruk kunnen wekken.

Het ontwerp moet onderscheid maken tussen:

- Resultaten van een strategiepreview en resultaten van een afgeronde
  backtest.
- Positieve en negatieve prestaties.
- Entry-signalen en exit-signalen.
- In-sample- en out-of-sample-resultaten.
- Strategieprestaties en buy-and-hold-prestaties.
- Werkelijke resultaten en aannames die in de simulatie zijn gebruikt.

Kleuren mogen niet de enige manier zijn om deze verschillen te
communiceren. Labels, legenda’s, symbolen en aanvullende beschrijvingen
moeten extra context bieden.

**Evaluatievraag:** Kunnen gebruikers de weergegeven prestatiegegevens
correct interpreteren en verschillende soorten resultaten van elkaar
onderscheiden?

---

# 6. Experimenten met visueel ontwerp

## 6.1 Doel

De ontwerpexperimenten vertalen de principes uit hoofdstuk 5 naar
concrete interfacealternatieven.

Het doel is om verschillende visuele identiteiten, lay-outs en
interactiepatronen te verkennen voordat een definitief ontwerp wordt
gekozen.

De experimenten bestaan uit:

1.  Drie visuele concepten.
2.  Alternatieve lay-outs voor de selectie van strategieprincipes.
3.  Alternatieve lay-outs voor featureselectie.
4.  Alternatieve workflowstructuren.
5.  Alternatieve lay-outs voor de backtestgeschiedenis.
6.  Ontwerpen voor interacties en interfacestatussen.

De alternatieven zijn niet bedoeld om één universele ontwerpwinnaar vast
te stellen. Verschillende oplossingen kunnen geschikter zijn voor
verschillende onderdelen van de applicatie.

## 6.2 Visuele concepten

Er zijn drie visuele concepten ontwikkeld om verschillende visuele
richtingen voor StratForge te verkennen.

De concepten gebruiken dezelfde applicatiecontext, maar verschillen in
hun visuele uitwerking.

### Concept A – Precision & Structure

**Visuele richting**

- Koelgrijze of donkere, op een terminal geïnspireerde achtergronden.
- Numerieke informatie met hoog contrast.
- Monospace-typografie voor technische gegevens.
- Dichte lay-outs met meerdere panelen.
- Minimale randen en decoratieve elementen.

**Hypothese**

Een gestructureerde, informatiegerichte interface kan geschikt zijn voor
gebruikers die werken met complexe strategie-instellingen en numerieke
backtestresultaten.

Het concept geeft prioriteit aan informatiedichtheid en technische
duidelijkheid.

### Concept B – Premium & Expressive

**Visuele richting**

- Warme of zachte achtergrondoppervlakken.
- Afgeronde componenten en parameter-cards.
- Expressieve typografie, waaronder Nunito.
- Ingetogen accentkleuren.
- Meer witruimte.

**Hypothese**

Een verzorgde en toegankelijke visuele identiteit kan
strategieconfiguratie minder intimiderend maken, terwijl een
professionele uitstraling behouden blijft.

### Concept C – Modular & Guided

**Visuele richting**

- Lichte oppervlakken en duidelijke inhoudsgroepering.
- Sticky of duidelijk zichtbare navigatie-elementen.
- Genummerde workflowsecties.
- Kleurgecodeerde interfacecategorieën.
- Manrope-typografie.

**Hypothese**

Een modulaire interface met duidelijke visuele onderscheidingen kan
gebruikers helpen de workflow te begrijpen en het doel van afzonderlijke
secties te herkennen.

### 6.2.1 Eerlijke vergelijking

Om de visuele concepten goed met elkaar te kunnen vergelijken, moeten de
volgende elementen consistent blijven:

- Scherm en viewport.
- Strategieprincipe.
- Geselecteerde features.
- Parameterwaarden.
- Bereik van marktgegevens.
- Beschikbare acties.
- Onderliggende functionaliteit.

Alleen de visuele uitwerking mag verschillen.

Dit verkleint het risico dat een voorkeur wordt toegeschreven aan
visueel ontwerp, terwijl deze in werkelijkheid wordt veroorzaakt door
verschillen in inhoud of functionaliteit.

## 6.3 Selectie van strategieprincipes

De interface voor het selecteren van een strategieprincipe is onderzocht
aan de hand van drie alternatieven.

### Alternatief A – Select-element

De beschikbare principes worden weergegeven in een select-element. Na
het selecteren van een principe worden de kenmerken en relevante
informatie zichtbaar.

**Potentieel voordeel:** Compacte presentatie die weinig ruimte inneemt.

**Potentieel nadeel:** Gebruikers moeten mogelijk verschillende opties
selecteren voordat ze de beschikbare principes met elkaar kunnen
vergelijken.

### Alternatief B – Principle cards

Elk principe wordt weergegeven als een afzonderlijke card met:

- Naam van het principe.
- Korte beschrijving.
- Uitleg van de tradingaanpak.
- Relevante informatie over de beschikbare featurecategorieën.

**Potentieel voordeel:** Gebruikers kunnen de beschikbare principes en
hun beschrijvingen bekijken voordat zij een keuze maken.

**Potentieel nadeel:** Cards kunnen meer ruimte innemen dan een compacte
lijst of een select-element.

### Alternatief C – Tabel

De principes worden gepresenteerd in een gestructureerde lijst of
vergelijkingslay-out.

**Potentieel voordeel:** Gebruikers kunnen meerdere kenmerken
tegelijkertijd vergelijken.

**Potentieel nadeel:** Te veel verklarende informatie kan het
selectiegebied druk maken of informatie herhalen die elders beschikbaar
is.

**Onderzoeksvraag:** Welke presentatie helpt gebruikers de verschillen
tussen strategieprincipes te begrijpen en een geschikt startpunt te
selecteren?

## 6.4 Selectie en configuratie van strategiefeatures

De features die beschikbaar zijn in StratForge zijn afhankelijk van het
geselecteerde strategieprincipe.

Voorbeelden:

- Mean Reversion kan Bollinger Bands en RSI bevatten.
- Trend Following kan Moving Averages, MACD, ADX en Donchian Channels
  bevatten.

Er zijn twee alternatieven onderzocht.

### Alternatief A – Uitklapbare featurelijst

Features worden als afzonderlijke elementen weergegeven en in relevante
categorieën gegroepeerd. Gebruikers kunnen een feature in- of
uitschakelen en deze uitklappen om de bijbehorende parameters te
bekijken.

**Potentieel voordeel:** Gebruikers kunnen de beschikbare features en
hun huidige statussen in de hoofdinterface voor configuratie zien.

**Potentieel nadeel:** De pagina kan druk worden wanneer veel features
en parameters worden weergegeven.

### Alternatief B – Feature library met configuratiepaneel

Een feature library wordt naast een afzonderlijke configuratie-interface
weergegeven. Gebruikers selecteren een feature uit de library en
configureren de parameters in een afzonderlijke popup of een apart
paneel.

Een samenvatting van de geselecteerde features biedt een overzicht van
de huidige strategieconfiguratie.

**Potentieel voordeel:** Gedetailleerde informatie en
parameterinstellingen kunnen worden weergegeven zonder de volledige
hoofdconfiguratie in beslag te nemen.

**Potentieel nadeel:** Gebruikers moeten mogelijk tussen de library en
het configuratiepaneel schakelen om hun volledige configuratie te
begrijpen.

**Onderzoeksvraag:** Welke lay-out maakt het eenvoudiger om relevante
features te ontdekken, hun instellingen te begrijpen en de complexiteit
van strategieconfiguratie te beheren?

## 6.5 Guided workflow tegenover single-page configuratie

Er zijn twee benaderingen onderzocht voor de volledige workflow voor het
maken van strategieën en backtesting.

### Alternatief A – Single-page workflow

Alle relevante secties worden binnen één interface gepresenteerd.
Gebruikers kunnen vrij tussen secties bewegen en hun configuratie
bekijken zonder naar afzonderlijke pagina’s te navigeren.

**Potentieel voordeel:** Gebruikers behouden het overzicht over de
volledige strategieconfiguratie en hoeven niet onnodig te navigeren.

**Potentieel nadeel:** Een lange pagina kan moeilijk scanbaar worden
wanneer de secties niet duidelijk zijn georganiseerd.

### Alternatief B – Step-by-step wizard

De workflow wordt opgedeeld in opeenvolgende stappen:

1.  Selecteer een strategieprincipe.
2.  Configureer features en parameters.
3.  Selecteer de markt en timeframe.
4.  Bekijk de preview.
5.  Voer de backtest uit en bekijk de resultaten.

Elke stap richt zich op een specifieke taak en geeft aan wat de volgende
stap is.

**Potentieel voordeel:** De gebruiker krijgt een duidelijke volgorde en
kan zich op één fase tegelijk concentreren.

**Potentieel nadeel:** Gebruikers hebben mogelijk minder vrijheid om
tussen configuratiesecties te schakelen of eerdere keuzes te bekijken.

**Onderzoeksvraag:** Maakt een begeleide workflow het proces eenvoudiger
te begrijpen, of biedt een single-page interface een betere balans
tussen begeleiding en flexibiliteit?

## 6.6 Backtestresultaten en geschiedenis

De backtestinterface is onderzocht om te bepalen hoe gebruikers huidige
en eerdere backtests kunnen openen, interpreteren en vergelijken.

De resultateninterface moet toegang bieden tot relevante informatie,
waaronder:

### Backtestconfiguratie

- De strategie die voor de backtest is gebruikt.
- Dataverdelingspercentages, indien van toepassing.
- Position sizing.
- Positietoewijzing.
- Relevante tradingaannames.

### Prestatiegegevens

- Totaal rendement.
- Maximale drawdown.
- Winrate.
- Profit factor.

### Visuele analyse

- Equity curve.
- Drawdown curve.
- Relevante grafiekinformatie.

### Aanvullende details

- Overzicht van de strategieconfiguratie.
- Trade-aannames.
- Trade log.

Voor het geschiedenisoverzicht zijn twee presentatiealternatieven
overwogen.

### Alternatief A – Op cards gebaseerd overzicht

Historische runs worden weergegeven als cards met informatie zoals de
strategienaam, het principe en geselecteerde prestatiemetrics.

**Potentieel voordeel:** Een visueel toegankelijk overzicht met
duidelijk van elkaar gescheiden items.

**Potentieel nadeel:** Cards kunnen veel ruimte innemen wanneer er veel
historische runs moeten worden weergegeven.

### Alternatief B – Tabelgebaseerd overzicht

Historische runs worden weergegeven in een gestructureerde tabel. De
informatie kan bestaan uit de strategienaam, het principe, de datum en
geselecteerde prestatiemetrics.

**Potentieel voordeel:** Meerdere runs kunnen in een compacte lay-out
worden weergegeven en vergeleken. Tabellen kunnen ook filteren en
sorteren ondersteunen.

**Potentieel nadeel:** Een tabel kan visueel minder expressief zijn en
moeilijk scanbaar worden wanneer te veel kolommen worden weergegeven.

Relevante acties moeten toegankelijk zijn, waaronder het openen van
eerdere resultaten en het voortzetten van werk met een bestaande
strategie.

**Onderzoeksvraag:** Hoe kunnen gebruikers eerdere backtestruns snel
vinden, herkennen en vergelijken?

## 6.7 Interactie en interfacestatussen

Aanvullende wireframe-experimenten onderzoeken hoe de interface
verschillende statussen communiceert.

De volgende statussen worden meegenomen:

| Status                    | Vereiste visuele communicatie                                                                       |
| :------------------------ | :-------------------------------------------------------------------------------------------------- |
| Feature uitgeschakeld     | De feature is uitgesloten van de huidige configuratie.                                              |
| Feature ingeschakeld      | De feature is actief en de parameters kunnen worden geconfigureerd.                                 |
| Ongeldige configuratie    | De gebruiker kan de ongeldige invoer herkennen en begrijpen wat moet worden gecorrigeerd.           |
| Preview wordt geladen     | De interface communiceert dat er een preview wordt gegenereerd.                                     |
| Preview voltooid          | Het previewresultaat is duidelijk te onderscheiden van de configuratie.                             |
| Backtest wordt uitgevoerd | De interface communiceert dat een backtest nog bezig is.                                            |
| Backtest voltooid         | De afgeronde resultaten worden beschikbaar.                                                         |
| Geen resultaten           | De interface legt uit dat er geen resultaten beschikbaar zijn en biedt een passende volgende actie. |

**Onderzoeksvraag:** Communiceren de interfacestatussen de huidige
status duidelijk en helpen ze gebruikers begrijpen welke actie nodig is?

------------------------------------------------------------------------

# 7. Evaluatie van de ontwerpalternatieven

## 7.1 Evaluatieaanpak

De ontwerpalternatieven zijn geëvalueerd door middel van A/B Testing en
Usability Testing met twee deelnemers:

1.  Een expert op het gebied van econometrie en data-analyse.
2.  Een potentiële gebruiker van StratForge.

Beide evaluaties zijn uitgevoerd met wireframes die in Figma waren
geprototypeerd. De A/B Testing was gericht op het vergelijken van
visuele concepten en interfacealternatieven, terwijl de Usability
Testing zich richtte op het uitvoeren van taken binnen de voorgestelde
workflow.

De evaluatie behandelde visuele voorkeuren, workflowstructuur en de
duidelijkheid van afzonderlijke interfacecomponenten.

De volgende criteria vormen een kader om de feedback te interpreteren.

| Evaluatiecriterium           | Wat wordt beoordeeld                                                              |
| :--------------------------- | :-------------------------------------------------------------------------------- |
| Visuele hiërarchie           | Of belangrijke informatie en acties opvallen.                                     |
| Duidelijkheid                | Of strategieprincipes, features, parameters en resultaten begrijpelijk zijn.      |
| Informatiedichtheid          | Of relevante informatie kan worden weergegeven zonder de interface druk te maken. |
| Navigatie en oriëntatie      | Of gebruikers begrijpen waar ze zijn en wat de volgende stap is.                  |
| Consistentie                 | Of visuele elementen en interactiepatronen consistent worden gebruikt.            |
| Feedback                     | Of selecties, fouten, laden en afgeronde acties duidelijk worden gecommuniceerd.  |
| Technische geloofwaardigheid | Of de interface technische en financiële informatie duidelijk presenteert.        |

De feedback is kwalitatief. In het gedocumenteerde onderzoek zijn geen
kwantitatieve gebruiksscores of statistisch representatieve
voorkeurresultaten beschikbaar.

## 7.2 Uitgevoerde taken tijdens de evaluatie

Beide deelnemers hebben tijdens de Usability Testing de volgende taken
uitgevoerd:

1.  Het doel van de Strategy Creator herkennen.
2.  Een strategieprincipe vinden en selecteren.
3.  Een feature kiezen en inschakelen.
4.  De relevante featureparameters configureren.
5.  Een backtest starten.
6.  Het overzicht, de grafieken en de metrics bekijken en interpreteren.
7.  Eerdere backtests terugvinden.
8.  Een eerdere backtest opnieuw openen of opnieuw uitvoeren.

Beide deelnemers hebben alle toegewezen taken zonder hulp voltooid.

De taken zijn uitgevoerd met de wireframes die in Figma waren
geprototypeerd. De sessies vonden plaats op 6 en 7 november 2026 en
duurden elk 15 minuten.

## 7.3 Deelnemer 1 – Expert in econometrie en data-analyse

**Evaluatiedatum:** 6 november 2026  
**Duur:** 15 minuten  
**Methode:** A/B Testing en Usability Testing  
**Prototype:** In Figma geprototypeerde wireframes en uiteindelijk in de
webpagina

### Algemene visuele richting

De expert gaf de voorkeur aan Concept C – Modular & Guided.

De belangrijkste redenen waren:

- Het concept werd als het meest leesbaar en gestructureerd beschouwd.
- De kleuraanduidingen maakten de verschillende secties gemakkelijker
  van elkaar te onderscheiden.
- De voorkeur ging uit naar light mode, omdat de expert dit prettiger
  vond om te lezen.

### Workflowstructuur

De expert gaf er de voorkeur aan om het maken en bewerken van
strategieën op één pagina te houden, terwijl afzonderlijke
applicatiegebieden, zoals de homepage, gescheiden blijven.

De expert vond het gebruik van verschillende kleuren gedurende de
workflow ook nuttig om gebruikers te begeleiden.

### Selectie van strategieprincipes

De expert gaf de voorkeur aan Alternatief B – Principle cards.

Het select-element werd als onvoldoende beschouwd, omdat gebruikers vóór
het maken van een keuze te weinig informatie krijgen.

Het vergelijkingsalternatief werd als onnodig druk beschouwd, omdat
bepaalde informatie ook beschikbaar was in de Wiki.

### Featureselectie

De expert gaf de voorkeur aan Alternatief B – Feature library met
configuratie-popup.

Met dit alternatief kan meer informatie over individuele features worden
aangeboden zonder dat de hoofdconfiguratiepagina druk aanvoelt.

### Backtestgeschiedenis

De expert gaf de voorkeur aan Alternatief B – Tabelgebaseerd overzicht.

De tabel kan meerdere historische runs weergeven zonder evenveel ruimte
in te nemen als cards. Ook biedt deze mogelijkheden om runs te filteren
op basis van totaal rendement en andere metrics.

### Usability-feedback

Op basis van de feedback van de expert zijn twee verbeterpunten voor de
gebruiksvriendelijkheid vastgesteld:

1.  Na het bewerken van een strategie voelde het onnatuurlijk om zowel
    op Preview als op Save te moeten klikken voordat de backtest opnieuw
    kon worden uitgevoerd.
2.  Feedback over de reden waarom een backtest niet kon worden
    uitgevoerd, was onvoldoende zichtbaar. De feedback verscheen
    bovenaan de pagina in plaats van bij de backtestsectie waar de
    gebruiker deze nodig had.

Deze punten wijzen op mogelijke verbeteringen in de workflow en de
plaatsing van validatiefeedback.

## 7.4 Deelnemer 2 – Potentiële gebruiker

**Evaluatiedatum:** 7 november 2026  
**Duur:** 15 minuten  
**Methode:** A/B Testing en Usability Testing  
**Prototype:** In Figma geprototypeerde wireframes

### Algemene visuele richting

De potentiële gebruiker gaf de voorkeur aan Concept C – Modular &
Guided, omdat dit de verschillende workflowstappen het duidelijkst
presenteerde.

De deelnemer gaf persoonlijk echter de voorkeur aan de kleuren van
Concept A.

Dit onderscheid suggereert dat visuele voorkeur en ervaren duidelijkheid
niet noodzakelijk tot dezelfde keuze leiden.

### Workflowstructuur

De deelnemer gaf de voorkeur aan één workflow voor strategieconfiguratie
en backtesting.

De belangrijkste reden was dat hierdoor overbodige stappen verdwijnen en
het proces eenvoudiger te volgen is.

### Selectie van strategieprincipes

De deelnemer gaf de voorkeur aan Alternatief C – Tabel.
De belangrijkste reden was dat hiermee meer informatie kon worden
weergegeven voordat een keuze werd gemaakt.

### Featureselectie

De deelnemer gaf de voorkeur aan Alternatief B – Feature library met
configuratie-popup.

De deelnemer waardeerde de mogelijkheid om meer informatie over de
beschikbare features weer te geven.

### Backtestgeschiedenis

De deelnemer gaf de voorkeur aan Alternatief A – Cards.

De presentatie op basis van cards werd visueel aantrekkelijker gevonden.

## 7.5 Samenvatting van de feedback van deelnemers

| Ontwerpgebied          | Voorkeur expert           | Voorkeur potentiële gebruiker | Belangrijkste overweging                                 |
| :--------------------- | :------------------------ | :---------------------------- | :------------------------------------------------------- |
| Algemeen concept       | Concept C                 | Concept C                     | Leesbaarheid, structuur en duidelijkheid van de workflow |
| Kleurvoorkeur          | Concept C                 | Concept A                     | Persoonlijke visuele voorkeur verschilt                  |
| Workflow               | Single-page               | Single-page                   | Context behouden en overbodige stappen vermijden         |
| Selectie van principes | Cards                     | Vergelijkingstabel            | Beschikbaarheid van informatie versus compactheid        |
| Featureselectie        | Feature library met popup | Feature library met popup     | Gedetailleerde informatie zonder overbelasting           |
| Backtestgeschiedenis   | Tabel                     | Cards                         | Informatiedichtheid versus visuele aantrekkelijkheid     |

De feedback laat zien dat er overeenstemming is over verschillende
belangrijke ontwerpkeuzes, met name de algemene visuele richting, de
single-page workflow en de aanpak voor featureselectie.

Andere voorkeuren verschillen. Deze verschillen worden meegenomen in de
ontwerpbeslissingen, in plaats van de voorkeur van één deelnemer
automatisch als correct te beschouwen.

------------------------------------------------------------------------

# 8. Bevindingen en ontwerpbeslissingen

Dit hoofdstuk vertaalt de observaties uit de analyse van visuele
referenties en de evaluatie door deelnemers naar ontwerpimplicaties en
beslissingen voor StratForge.

De beslissingen zijn gebaseerd op het beschikbare onderzoek. Wanneer de
voorkeuren van deelnemers verschillen, wordt de redenering achter de
gekozen oplossing expliciet gemaakt.

## 8.1 Algemene visuele richting

### Bevinding

Beide deelnemers gaven de voorkeur aan Concept C – Modular & Guided.

De expert vond dit concept het meest leesbaar en gestructureerd vanwege
de kleuraanduidingen. De potentiële gebruiker vond de workflow hierin
het duidelijkst gepresenteerd.

De deelnemers hadden niet dezelfde kleurvoorkeur. De expert gaf de
voorkeur aan de kleuren van Concept C, terwijl de potentiële gebruiker
persoonlijk de kleuren van Concept A verkoos.

De expert gaf daarnaast de voorkeur aan light mode.

### Ontwerpimplicatie

De interface moet prioriteit geven aan een duidelijke modulaire
structuur en zichtbare onderscheidingen tussen workflowsecties.
Individuele kleurvoorkeuren mogen niet zwaarder wegen dan de behoefte
aan leesbare informatie en consistente visuele begeleiding.

### Ontwerpbeslissing

Gebruik Concept C – Modular & Guided als primaire visuele richting.

Gebruik een light-mode-interface en consistente kleuraanduidingen om
betekenisvolle interfacecategorieën te onderscheiden.

De kleuren moeten structuur of status communiceren en niet uitsluitend
decoratief worden gebruikt.

## 8.2 Single-page strategie-workflow

### Bevinding

Beide deelnemers gaven de voorkeur aan één workflow voor
strategieconfiguratie en backtesting.

De expert gaf de voorkeur aan het maken en bewerken van strategieën op
één pagina, terwijl andere applicatiegebieden afzonderlijke pagina’s
behouden. De potentiële gebruiker gaf de voorkeur aan één workflow omdat
hierdoor overbodige stappen verdwijnen.

### Ontwerpimplicatie

Gerelateerde configuratie- en backtestingactiviteiten moeten
toegankelijk blijven binnen één samenhangende workflow. Gebruikers
moeten hun configuratie kunnen bekijken zonder onnodige navigatie.

### Ontwerpbeslissing

Gebruik één Strategy Creator-pagina voor strategieconfiguratie, preview
en backtesting.

Houd de homepage en andere afzonderlijke applicatiegebieden toegankelijk
via de hoofdnavigatie.

Gebruik duidelijk onderscheiden secties om de workflowstappen te
communiceren.

## 8.3 Selectie van strategieprincipes

### Bevinding

De expert gaf de voorkeur aan cards omdat deze een uitleg bieden voordat
de gebruiker een principe selecteert. De vergelijkingslay-out werd als
te druk beschouwd, omdat deze informatie herhaalde die al in de Wiki
beschikbaar was.

De potentiële gebruiker gaf de voorkeur aan een vergelijkingstabel,
omdat hiermee meer informatie kon worden weergegeven.

### Ontwerpimplicatie

De selectie-interface moet voldoende informatie bieden om een
weloverwogen keuze te ondersteunen, zonder onnodige informatie te
herhalen.

### Ontwerpbeslissing

Gebruik een cardgebaseerde interface voor de selectie van principes.

Elke card moet bevatten:

- Naam van het principe.
- De hypothese van het principe.
- Uitleg van de algemene aanpak.

Houd uitgebreidere uitleg in de Wiki.

Deze beslissing volgt de voorkeur van de expert en behoudt
tegelijkertijd de onderliggende behoefte van de potentiële gebruiker:
gebruikers hebben voldoende informatie nodig om een keuze te maken. Er is ervoor gekozen om de hypothese en aanpak pas te laten zien aan de gebruiker wanneer deze gekozen is. Deze keuze is gemaakt omdat er anders veel onnodige informatie naar de gebruiker wordt gezonden.

## 8.4 Selectie van strategiefeatures

### Bevinding

Beide deelnemers gaven de voorkeur aan Alternatief B – Feature library
met configuratie-popup.

Het belangrijkste voordeel was de mogelijkheid om gedetailleerde
feature-informatie weer te geven zonder de hoofdconfiguratiepagina druk
te maken.

### Ontwerpimplicatie

Gebruikers moeten individuele features kunnen ontdekken en configureren
zonder alle beschikbare parameters tegelijkertijd te hoeven weergeven.

### Ontwerpbeslissing

Gebruik een feature library met een afzonderlijke configuratie-popup of
een apart paneel.

Bied relevante beschrijvingen en parameterinstellingen binnen deze
interface. Zorg ervoor dat de hoofdinterface van de Strategy Creator nog
steeds duidelijk maakt welke features momenteel geselecteerd en
ingeschakeld zijn.

## 8.5 Backtestgeschiedenis

### Bevinding

De expert gaf de voorkeur aan een tabel omdat deze meerdere historische
runs compact kan weergeven en filteren op basis van prestatiemetrics
ondersteunt.

De potentiële gebruiker gaf de voorkeur aan cards omdat deze de
presentatie visueel aantrekkelijker vond.

### Ontwerpimplicatie

Het geschiedenisoverzicht moet de praktische taak ondersteunen om
historische runs te vinden en te vergelijken. Visuele aantrekkelijkheid
is relevant, maar mag gebruikers niet verhinderen voldoende informatie
te raadplegen.

### Ontwerpbeslissing

Gebruik een tabelgebaseerd overzicht van de backtestgeschiedenis.

Neem relevante informatie op, zoals:

- Strategienaam.
- Strategieprincipe.
- Datum van de backtest.
- Totaal rendement.
- Andere relevante prestatiemetrics.

Bied waar passend filteropties aan.

Deze beslissing geeft prioriteit aan informatiedichtheid en
vergelijkbaarheid. De tabel moet tegelijkertijd de visuele taal van
Concept C behouden.

## 8.6 Backtestworkflow en validatiefeedback

### Bevinding

De expert identificeerde twee interactieproblemen:

- Na het bewerken van een strategie voelde het onnatuurlijk om zowel op
  Preview als op Save te moeten klikken voordat een backtest opnieuw kon
  worden uitgevoerd.
- Validatiefeedback werd te ver van de backtestactie weergegeven.

### Ontwerpimplicatie

Gebruikers moeten begrijpen welke acties nodig zijn om een backtest uit
te voeren. Fouten die een actie verhinderen, moeten dicht bij de
relevante actie zichtbaar zijn.

### Ontwerpbeslissing

Vereenvoudig de workflow voor het opnieuw uitvoeren van een backtest,
zodat gebruikers geen onnodige acties hoeven uit te voeren voordat zij
de backtest opnieuw starten.

Toon validatiefouten en uitleg direct in of bij de backtestsectie.

Het exacte gedrag van opslaan en previewen moet consistent blijven met
de vereisten voor gegevensverwerking van de applicatie. Het
vereenvoudigen van de workflow mag er niet toe leiden dat
niet-opgeslagen wijzigingen als opgeslagen worden gepresenteerd.

## 8.7 Samenvatting van de ontwerpbeslissingen

| Gebied                    | Ontwerpbeslissing                                                   | Onderzoeksbasis                                                                                       |
| :------------------------ | :------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------- |
| Algemene visuele richting | Gebruik Concept C – Modular & Guided.                               | Beide deelnemers gaven de voorkeur aan Concept C.                                                     |
| Kleurenschema             | Gebruik light mode en consistente kleuraanduidingen.                | Voorkeur van de expert en feedback over de visuele structuur.                                         |
| Strategie-workflow        | Houd configuratie, preview en backtesting binnen één workflow.      | Beide deelnemers gaven de voorkeur aan een single-page workflow.                                      |
| Selectie van principes    | Gebruik cards met beknopte verklarende informatie.                  | Voorkeur van de expert; komt tegemoet aan de behoefte dat informatie vóór de selectie beschikbaar is. |
| Featureselectie           | Gebruik een feature library met configuratie-popup.                 | Beide deelnemers gaven de voorkeur aan dit alternatief.                                               |
| Backtestgeschiedenis      | Gebruik een tabeloverzicht met relevante metrics en filters.        | Voorkeur van de expert en overwegingen rond informatiedichtheid.                                      |
| Backtestinteractie        | Vereenvoudig het opnieuw uitvoeren van een backtest na wijzigingen. | Usability-feedback van de expert.                                                                     |
| Validatiefeedback         | Toon fouten dicht bij de relevante actie.                           | Usability-feedback van de expert.                                                                     |

Samen bepalen deze beslissingen de richting voor het vernieuwde
StratForge-interfaceontwerp.

---

# 9. Beperkingen van het onderzoek en verdere validatie

## 9.1 Beperkt aantal deelnemers

Aan de evaluatie namen één expert en één potentiële gebruiker deel.

Hun feedback biedt nuttige eerste inzichten in de voorgestelde
ontwerpen, maar het aantal deelnemers is te klein om de volledige
doelgroep te vertegenwoordigen.

De resultaten moeten daarom worden geïnterpreteerd als kwalitatieve
ontwerpfeedback en niet als algemene conclusies over alle
StratForge-gebruikers.

## 9.2 Visuele toegankelijkheid vereist verdere validatie

De analyse van de referenties houdt rekening met contrast, leesbaarheid,
focusstatussen en kleuronafhankelijke communicatie.

De huidige evaluatie documenteert echter geen formele
toegankelijkheidsaudit.

Het vernieuwde interfaceontwerp moet daarom nog worden gecontroleerd op:

- Contrast tussen tekst en achtergrond.
- Leesbare lettergroottes.
- Zichtbare keyboard-focusstatussen.
- Duidelijke geselecteerde en uitgeschakelde statussen.
- Informatie die niet uitsluitend via kleur wordt gecommuniceerd.
- Bruikbaarheid op verschillende schermformaten.

---

# 10. Conclusie

Dit onderzoek heeft onderzocht hoe visueel ontwerp en visuele
begeleiding StratForge begrijpelijker, consistenter en effectiever in
gebruik kunnen maken.

De analyse van visuele referenties heeft verschillende benaderingen
geïdentificeerd die het waard zijn om te verkennen, waaronder
gestructureerde informatiegroepen, duidelijke typografie, herhaalde
lay-outs, ingetogen kleurenpaletten en zichtbare workflowaanwijzingen.

Deze bevindingen zijn vertaald naar drie visuele concepten en
verschillende wireframe-alternatieven. De alternatieven zijn geëvalueerd
door middel van A/B Testing en Usability Testing met een expert in
econometrie en data-analyse en een potentiële gebruiker. Beide
evaluaties zijn uitgevoerd met wireframes die in Figma waren
geprototypeerd. De expert nam deel op 6 november 2026 en de potentiële
gebruiker op 7 november 2026. Beide sessies duurden 15 minuten en beide
deelnemers hebben alle toegewezen taken zonder hulp voltooid.

Beide deelnemers gaven de voorkeur aan het visuele concept Modular &
Guided en aan een single-page workflow voor strategieconfiguratie en
backtesting. Ook waren zij het eens over het gebruik van een feature
library met configuratie-popup. Hun voorkeuren verschilden bij de
selectie van strategieprincipes en de backtestgeschiedenis. Hiervoor
waren beslissingen nodig op basis van de informatie die gebruikers nodig
hebben en het praktische doel van elke interface.

De resulterende ontwerprichting combineert een modulaire visuele
structuur met een single-page strategie-workflow, cardgebaseerde
principeselectie, een feature library met configuratie-popup en een
tabelgebaseerde backtestgeschiedenis.

De evaluatie bracht ook verbeteringen aan het licht voor de
backtestworkflow en de plaatsing van validatiefeedback.

Het onderzoek biedt een onderbouwd startpunt voor het visuele redesign
van StratForge. Het beperkte aantal deelnemers betekent echter dat de
ontwerpbeslissingen verder moeten worden gevalideerd in het
geïmplementeerde prototype.

---
# Bronnen

- FieldRank. (z.d.). FieldRank: Trail and ultra rankings.
  https://fieldrank.run/
- Flow. (z.d.). Wispr Flow \| Voice to Text Dictation & AI Notetaker.
  https://wisprflow.ai/
- Infinity AI. (z.d.). Infinity AI - Advanced Artificial Intelligence,
  AGI Research & LLM Development. Infinity AI - Software Development &
  Artificial Intelligence. https://infinitytechstack.uk/
- Marcus, R. (z.d.). Ruben Marcus — AI Fullstack Engineer · Agent-Ready
  Portfolio. Ruben Marcus. https://www.rubenmarcus.dev/
- Smith Robinson Multimedia LLC. (z.d.). DISKO - The media asset manager
  for people who shoot and cut video. DISKO. https://disko.media/.
- UXPin. (2026, 8 mei). What is progressive disclosure in UX?
  Definition, Examples & Best Practices (2026). Studio By UXPin.
  https://www.uxpin.com/studio/blog/what-is-progressive-disclosure/
