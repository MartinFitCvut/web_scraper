# Web Scraper

Konfigurovateľný webový scraper pre extrakciu dát zo spravodajských portálov

## Čo treba mať

Pred prvotným spustením je potrebné mať na svojom zariadení nainštalovaný Node.js a MongoDB.

Pre nainštalovanie Node.js: https://nodejs.org/en/download

Pre nainštalovanie MongoDB: https://www.mongodb.com/try/download/community

Verzie na ktorých bola aplikácia vyvíjaná 
- Node.js: v20.8.0
- MongoDB: MongoDB shell version v5.0.22 

## Inštalácia a spustenie

1. Stiahnite alebo naklonujte si projekt.
2. Vytvorte si databázu v MongoDB a pripojte sa na ňu. Nie je podstatné aký názov dáte databáze.
3. Nemusíte vytvárať žiadne kolekcie. Skopírujte si odkaz na databázu. Odkaz môže byť v tvare: mongodb://localhost:27017/Názov_kolekcie .
4. Nezabudni do odkazu pridať aj názov databázy ktorú ste vytvorili.
5. Otvorte si stiahnutý alebo naklonovaný projekt.
6. Otvorte si súbor .env v súborovej štruktúre /backend/.env
7. V tomto súbore zmeňte hneď v prvom riadku adresu databázy: " DATABASE="Vaša adresa" ", ostatné prvky nemeňte a súbor uložte.
8. Otvorte si terminál
9. Zadajte príkaz "node setup.js". Tento príkaz Vám nainštaluje všetky potrebné knižnica a rozšírenia. Počkajte pokiaľ sa inštalácia dokončí.   
10. Následne si môžete spustiť serverovú a klientsku časť osobitne alebo si to môžete spustiť spoločne príkazom "node start.js"  