# mini-serve

`mini-serve` è un micro-framework HTTP ultra-leggero e **zero-dependency** per Node.js. È nato come alternativa minimale e nativa a Express per creare API REST, CRUD e server web veloci, mantenendo il pieno controllo sulle performance e sulla configurazione dei middleware.

---

## Indice
1. [Caratteristiche principali](#caratteristiche-principali)
2. [Guida: Come usarlo in un nuovo progetto da zero](#guida-come-usarlo-in-un-nuovo-progetto-da-zero)
3. [Guida all'API](#guida-allapi)
4. [Gestione dei Middleware](#gestione-dei-middleware)
5. [Licenza](#licenza)

---

## Caratteristiche principali

* 🚀 **Zero dipendenze esterne**: Utilizza esclusivamente i moduli nativi di Node.js (es. `node:http`, `node:fs`).
* 🛣️ **Router Express-like**: Supporto nativo per rotte HTTP (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) e parametri dinamici nell'URL (es. `/api/users/:id`).
* ⚙️ **Modularità Opt-In**: I middleware built-in (body parser, request/response enhancers, logging) sono disattivati o attivabili a piacimento.
* 🛡️ **Leggero e Sicuro**: Include un body parser con limite integrato di 1MB sui payload per prevenire attacchi di tipo DOS.

---

## Guida: Come usarlo in un nuovo progetto da zero

Ecco i passaggi da seguire per creare un nuovo progetto ed utilizzare `mini-serve`.

### Step 1: Inizializza il progetto Node.js
Crea una nuova cartella per il tuo progetto e inizializzala tramite il terminale:
```bash
mkdir mio-nuovo-progetto
cd mio-nuovo-progetto
npm init -y
```

### Step 2: Abilita i moduli ES (ESM)
Apri il file `package.json` appena generato e aggiungi la riga `"type": "module"`. Questo passaggio è fondamentale in quanto `mini-serve` utilizza la sintassi moderna degli import di ES6:
```json
{
  "name": "mio-nuovo-progetto",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}
```

### Step 3: Installa `mini-serve`
Installa il pacchetto tramite npm (puoi installarlo localmente o puntare al percorso se lo stai testando localmente):
```bash
npm install mini-serve
```

### Step 4: Crea il file del Server (`index.js`)
Crea un file chiamato `index.js` nella root del tuo progetto e scrivi il seguente codice di esempio:

```javascript
import http from 'node:http';
import { createServer } from 'mini-serve';
import { notFoundHandler, globalErrorHandler } from 'mini-serve/middlewares';

// 1. Inizializza il server con le opzioni desiderate
const app = createServer({
  useEnhancers: true,  // Abilita res.json(), res.status() e req.query
  useBodyParser: true, // Parsa automaticamente il JSON per POST/PUT/PATCH
  useLogger: true      // Mostra i log delle richieste in console
});

// 2. Definisci le tue rotte
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Benvenuto nel mio nuovo server agnostico!' });
});

// Rotta con parametri dinamici
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ itemId: id, queryString: req.query });
});

// Rotta POST con gestione del body parificato
app.post('/items', (req, res) => {
  const payload = req.body;
  res.status(201).json({ created: payload });
});

// 3. Registra i middleware di fallback per errori
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 4. Avvia il server tramite il modulo nativo http di Node.js
const server = http.createServer(app.handler);

server.listen(3000, () => {
  console.log('Server avviato con successo su http://localhost:3000');
});
```

### Step 5: Avvia il server
Esegui il server tramite il terminale:
```bash
npm start
```

---

## Guida all'API

### `createServer(options)`
Crea un'istanza dell'applicazione. Riceve un oggetto di configurazione per i middleware built-in:

| Opzione | Tipo | Default | Descrizione |
|---|---|---|---|
| `useEnhancers` | `boolean` | `true` | Aggiunge `req.query`, `req.path`, `res.status(code)` e `res.json(data)`. |
| `useBodyParser` | `boolean` | `true` | Parsa automaticamente i payload JSON in `req.body` (limite max: 1MB). Ritorna `413 Payload Too Large` se superato o `400 Bad Request` in caso di JSON malformato. |
| `useLogger` | `boolean` | `false` | Stampa a console le richieste ricevute, lo status code e il tempo di elaborazione in ms (es: `[GET] /api/users - 200 (12ms)`). |

L'oggetto `app` restituito espone i seguenti metodi:
- `app.use(middleware)`: Registra un middleware globale o un gestore errori.
- `app.get(path, ...handlers)`: Registra una rotta GET.
- `app.post(path, ...handlers)`: Registra una rotta POST.
- `app.put(path, ...handlers)`: Registra una rotta PUT.
- `app.delete(path, ...handlers)`: Registra una rotta DELETE.
- `app.patch(path, ...handlers)`: Registra una rotta PATCH.
- `app.handler`: Il delegato nativo `(req, res)` da passare a `http.createServer()`.

---

## Gestione dei Middleware

I middleware seguono il classico pattern `(req, res, next)`:

```javascript
app.use((req, res, next) => {
  console.log('Richiesta in transito...');
  next(); // Passa al middleware successivo
});
```

### Gestione degli Errori globali
Se passi un errore a `next(err)`, lo stack salterà tutti i middleware standard fino a raggiungere un middleware di errore, identificato dall'avere 4 parametri `(err, req, res, next)`:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Errore generico del server' }));
});
```

Puoi anche usare gli handler predefiniti importandoli da sottomodulo:
```javascript
import { notFoundHandler, globalErrorHandler } from 'mini-serve/middlewares';

app.use(notFoundHandler);     // Gestisce i 404 per rotte non registrate
app.use(globalErrorHandler);  // Cattura ed elabora in sicurezza gli errori generici
```

---

## Licenza

Questo progetto è rilasciato sotto licenza [MIT](LICENSE).
