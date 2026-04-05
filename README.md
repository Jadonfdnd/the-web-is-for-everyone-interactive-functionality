# Ad Connect — Talent Awards

Ontwerp en ontwikkel een server-side website voor een opdrachtgever

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Gebruik](#gebruik)
- [Kenmerken](#kenmerken)
- [Installatie](#installatie)
- [Bronnen](#bronnen)
- [Licentie](#licentie)

## Beschrijving

In dit gedeelte van het project Overlegplatform Ad's, kunnen bezoekers genomineerden bekijken en reacties achterlaten op de detailpagina van een genomineerde.

Live website: https://the-web-is-for-everyone-interactive-7ubr.onrender.com/genomineerden

<img width="1885" height="783" alt="image" src="https://github.com/user-attachments/assets/04f49189-662c-4c98-9053-7fd827ed58e9" />
<img width="1808" height="806" alt="image" src="https://github.com/user-attachments/assets/c1deb9df-8168-40d3-b68f-83c82e591894" />


## Gebruik

De website heeft de volgende pagina's:

- **Homepagina** — overzicht van nieuws en informatie over Ad onderwijs
- **Genomineerden** — overzicht van alle genomineerden voor de Talent Awards
- **Detailpagina** — informatie over een genomineerde met de mogelijkheid een reactie achter te laten

**User Story:**
> Als bezoeker wil ik een reactie kunnen achterlaten op een genomineerde, zodat ik mijn steun kan tonen.

De interactie werkt als volgt:
1. Bezoeker gaat naar de detailpagina van een genomineerde
2. Bezoeker vult naam en reactie in het formulier in
3. Bezoeker klikt op "Verstuur reactie"
4. Reactie wordt opgeslagen in de Database
5. Bezoeker ziet een bevestiging dat de reactie is geplaatst

_Nog geen reacties: empty state:_
<img width="823" height="797" alt="image" src="https://github.com/user-attachments/assets/24bdecd1-bf3c-412a-a791-3d14804f29c5" />

_Gelukt!_
<img width="832" height="805" alt="image" src="https://github.com/user-attachments/assets/f97a667e-39d7-4d1b-beb1-5c588ffe1fd2" />

_Ideal state de reacties worden getoond_
<img width="663" height="865" alt="image" src="https://github.com/user-attachments/assets/a8e0f4d8-cf75-43b4-8617-067ceb24a1de" />




## Kenmerken

### Technieken

Deze website is gebouwd met:
- **NodeJS** — server-side JavaScript runtime
- **Express** — web framework voor de routes en server
- **Liquid** — templating engine voor de HTML pagina's
- **Directus** — REST API voor het ophalen en opslaan van data
- **Client-side JavaScript** — enhancement voor het formulier

### Progressive Enhancement

De website is gebouwd in drie lagen volgens het principe van Progressive Enhancement:

**Laag 1 — HTML**
Het formulier werkt volledig zonder CSS en JavaScript via een normale HTML POST. De server vangt dit op en slaat de data op in Directus, waarna de gebruiker wordt doorgestuurd met een 303 redirect.
```js
// POST route in server.js
app.post('/genomineerden/:slug', async function (req, res) {
  // data opslaan in Directus
  res.redirect(303, `/genomineerden/${slug}?succes=true`)
})
```

**Laag 2 — CSS**
Mobile-first styling met huisstijl van de opdrachtgever. Feature detection via `@supports` zorgt ervoor dat animaties alleen worden toegepast als de browser dit ondersteunt.
```css
/* Alleen animeren als browser transform ondersteunt */
@supports (transform: translateY(-4px)) {
  .nieuws-article {
    transition: transform 220ms ease;
  }
}
```

**Laag 3 — Client-side JavaScript**
Als enhancement verstuurt JavaScript het formulier via `fetch` zonder pagina refresh. Er wordt eerst gecheckt of de browser `fetch` en `FormData` ondersteunt.
```js
if ('fetch' in window && 'FormData' in window) {
  form.addEventListener('submit', async function (event) {
    event.preventDefault()
    await fetch(form.action, {
      method: 'POST',
      body: new URLSearchParams(formData)
    })
  })
}
```

### UI States

De detailpagina heeft vier states:

**1. Ideal state** — reacties worden getoond
```liquid
{% for comment in nomination.comments %}
  <li class="reactie">
    <strong>{{ comment.name }}</strong>
    <p>{{ comment.comment }}</p>
  </li>
{% endfor %}
```

**2. Empty state** — nog geen reacties
```liquid
{% else %}
  <p>Plaats hier jouw reactie!</p>
{% endif %}
```

**3. Success state** — reactie is geplaatst
```liquid
{% if succes %}
  <p class="success-melding">✓ Je reactie is geplaatst!</p>
{% endif %}
```

**4. Error state** — iets ging fout
```liquid
{% if error %}
  <p class="error-melding">❌ Er ging iets fout, probeer het opnieuw.</p>
{% endif %}
```

### User Preferences

De website respecteert de systeeminstellingen van de gebruiker:
```css
/* Geen animaties voor gebruikers die dat hebben ingesteld */
@media (prefers-reduced-motion: reduce) {
  .nieuws-article,
  .genomineerde-kaart a {
    transition: none;
    animation: none;
  }
}

/* Dark mode voor gebruikers die dat hebben ingesteld */
@media (prefers-color-scheme: dark) {
  body {
    background: #111;
    color: #f5f5f5;
  }
}
```

## Installatie

Volg deze stappen om het project lokaal te draaien:

**1. Repository clonen**

git clone https://github.com/[jouw-gebruikersnaam]/the-web-is-for-everyone-interactive-functionality


**2. Map openen**

open in editor naar keus: the-web-is-for-everyone-interactive-functionality


**3. Dependencies installeren met NPM**
```bash
npm install
```

**4. Server starten**
```bash
npm start
```

**5. Open de website**

Ga naar `http://localhost:8000` in je browser.

> Je hebt NodeJS nodig om dit project te draaien. Download het via [nodejs.org](https://nodejs.org)

## Bronnen

- [Express documentatie](https://expressjs.com/)
- [Liquid documentatie](https://liquidjs.com/)
- [Directus documentatie](https://docs.directus.io/)
- [Fetch API @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [FormData @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [prefers-reduced-motion @ MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [prefers-color-scheme @ MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [@supports @ MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)
- [Progressive Enhancement @ MDN](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
- [UI Stack — How to fix a bad user interface](https://www.scotthurff.com/posts/why-your-user-interface-is-awkward-youre-ignoring-the-ui-stack/)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
