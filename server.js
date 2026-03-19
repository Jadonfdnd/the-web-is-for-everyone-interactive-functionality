// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs'

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// ─── INDEX ───────────────────────────────────────
// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (req, res) {
  // Doe een fetch naar de nieuwsdata die je nodig hebt
  const newsRes = await fetch('https://fdnd-agency.directus.app/items/adconnect_news')
  // Lees van de response het JSON object in
  const newsData = await newsRes.json()
  // Render index.liquid en geef de nieuwsdata mee
  res.render('index.liquid', { news: newsData.data })
})

// ─── LADO ────────────────────────────────────────
// Maak een GET route voor de lado pagina
app.get('/lado', async function (req, res) {
  res.render('lado.liquid')
})

// ─── GENOMINEERDEN OVERVIEW ───────────────────────
// Maak een GET route voor het overzicht van genomineerden
app.get('/genomineerden', async function (req, res) {
  // Doe een fetch naar alle nominaties in Directus
  const nominationsRes = await fetch('https://fdnd-agency.directus.app/items/adconnect_nominations')
  // Lees van de response het JSON object in
  const nominationsData = await nominationsRes.json()
  // Render genomineerden.liquid en geef de nominaties mee
  res.render('genomineerden.liquid', { nominations: nominationsData.data })
})

// ─── GENOMINEERDE DETAIL ──────────────────────────
// Maak een GET route voor de detailpagina van een genomineerde
// :slug is een parameter die de slug van de genomineerde bevat
app.get('/genomineerden/:slug', async function (req, res) {
  const slug = req.params.slug
  // Fetch de nominatie op basis van de slug, inclusief de comments
  const nominationRes = await fetch(`https://fdnd-agency.directus.app/items/adconnect_nominations?filter[slug][_eq]=${slug}&fields=*,comments.*`)
  const nominationData = await nominationRes.json()
  // Render genomineerde.liquid en geef de nominatie mee
  res.render('genomineerde.liquid', { nomination: nominationData.data[0] })
})

// ─── POST COMMENT ─────────────────────────────────
// Maak een POST route voor het plaatsen van een reactie
app.post('/genomineerden/:slug', async function (req, res) {
  const slug = req.params.slug

  // Haal eerst de nominatie op om het id te krijgen
  const nominationRes = await fetch(`https://fdnd-agency.directus.app/items/adconnect_nominations?filter[slug][_eq]=${slug}`)
  const nominationData = await nominationRes.json()
  const nominationId = nominationData.data[0].id

  // Sla de reactie op in Directus
  await fetch('https://fdnd-agency.directus.app/items/adconnect_nominations_comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: req.body.name,
      comment: req.body.comment,
      nomination: nominationId
    })
  })

  // Stuur de bezoeker terug naar de detailpagina na het plaatsen van een reactie
  res.redirect(303, `/genomineerden/${slug}`)
})

// ─── 404 ──────────────────────────────────────────
// Stel de 404 pagina in, deze wordt getoond als een pagina niet gevonden wordt
// Let op: deze moet altijd als laatste route staan
app.use((req, res) => {
  res.status(404).render('error.liquid', {
    statusCode: 404,
    message: "Sorry, we can't find that page!"
  })
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})