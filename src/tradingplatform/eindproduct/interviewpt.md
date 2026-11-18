# Interview – Haalbaarheid Paper Trading binnen StratForge

## Introductie

Bedankt dat u tijd wilt vrijmaken voor dit interview.

Voor mijn minor onderzoek ik de technische haalbaarheid van het toevoegen van een Paper Trading-functionaliteit aan StratForge. StratForge is een platform waarop gebruikers cryptocurrency tradingstrategieën kunnen configureren en backtesten.

Het doel is om te onderzoeken of bestaande strategieën ook continu kunnen worden uitgevoerd op basis van realtime marktdata, zonder dat er daadwerkelijk financiële transacties plaatsvinden.

Voor de Proof of Concept wordt één cryptocurrency gebruikt, in combinatie met het  strategieprincipe als Trend Following.Orders worden binnen StratForge gesimuleerd.

Ik wil graag uw expertise gebruiken om inzicht te krijgen in de technische mogelijkheden, aandachtspunten en mogelijke valkuilen.

## Thema 1 – Ervaring en achtergrond

1. Kunt u iets vertellen over uw ervaring met cryptocurrency trading, exchange-integraties of algorithmic trading?
2. Met welke exchanges en API-integraties heeft u gewerkt?
3. Heeft u ervaring met het ontwikkelen of gebruiken van backtesting- of paper trading-systemen?

## Thema 2 – Realtime market data

4. Welke marktgegevens zijn minimaal noodzakelijk om een tradingstrategie betrouwbaar op live data uit te voeren?
5. Is het voor een eerste implementatie voldoende om candle-data te gebruiken, of zijn trades en order-book data noodzakelijk?
6. Welke aandachtspunten zijn er bij het ontvangen en verwerken van realtime data via WebSockets?
7. Hoe kan een applicatie omgaan met disconnects, vertraagde updates of ontbrekende marktdata?
8. Welke API-functionaliteiten zou u adviseren voor deze toepassing?

## Thema 3 – Trade execution simulation

9. Welke factoren zijn belangrijk om een gesimuleerde order zo realistisch mogelijk uit te voeren?
10. Hoe zou u de uitvoeringsprijs van een market BUY- of SELL-order bepalen?
11. Hoe belangrijk zijn spread, slippage en transaction fees voor de betrouwbaarheid van Paper Trading?
12. Wanneer is het noodzakelijk om order-book depth en partial fills te simuleren?
13. Welke beperkingen blijven bestaan wanneer orders uitsluitend intern worden gesimuleerd?
14. Hoe zou u de betrouwbaarheid van de gesimuleerde uitvoering testen?

## Thema 4 – Architectuur en integratie

15. Zou u de bestaande strategie-logica hergebruiken voor zowel Backtesting als Paper Trading? Waarom wel of niet?
16. Hoe zou u de scheiding tussen Strategy Execution en Order Execution ontwerpen?
17. Welke verantwoordelijkheden moeten volgens u binnen een afzonderlijke Paper Trading Module vallen?
18. Welke gegevens moeten persistent worden opgeslagen om Paper Trading betrouwbaar te laten functioneren?
19. Hoe kan het systeem ervoor zorgen dat actieve strategieën en open posities behouden blijven na een backend restart?

## Thema 5 – Betrouwbaarheid en risico's

20. Wat zijn volgens u de grootste technische risico's bij het bouwen van een Paper Trading-systeem?
21. Welke situaties kunnen ertoe leiden dat de gesimuleerde resultaten sterk afwijken van echte handelsresultaten?
22. Hoe zou u voorkomen dat een strategie meerdere keren dezelfde order uitvoert door dubbele of vertraagde signalen?
23. Welke monitoring en logging zijn noodzakelijk?

## Thema 6 – Advies en prioriteiten

24. Welke functionaliteiten zou u absoluut opnemen in een eerste werkende versie?
25. Welke functionaliteiten zou u pas in een latere fase ontwikkelen?
26. Welke technische aanpak zou u adviseren voor deze specifieke toepassing?
27. Welke documentatie, bronnen of technische onderwerpen zou u aanraden om verder te onderzoeken?

## Afsluiting

Zijn er nog belangrijke aandachtspunten of onderwerpen die ik niet heb besproken?

Bedankt voor uw tijd en bijdrage aan het onderzoek.