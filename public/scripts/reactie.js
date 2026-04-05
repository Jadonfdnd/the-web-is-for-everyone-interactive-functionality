// Controleer of de browser fetch en FormData ondersteunt featutre detection

if ('fetch' in window && 'FormData' in window) {

  const form = document.querySelector('#reactie-plaatsen form')

  if (form) {
    form.addEventListener('submit', async function (event) {
      // geen normale POST page refresh
      event.preventDefault()

      const formData = new FormData(form)

      try {
        // Verstuur de data via fetch JS enhancement
        await fetch(form.action, {
          method: 'POST',
          body: new URLSearchParams(formData)
        })

        // Toon success melding zonder pagina te herladen
        const melding = document.querySelector('.success-melding')
        if (melding) {
          melding.style.display = 'block'
        } else {
          const nieuweMelding = document.createElement('p')
          nieuweMelding.className = 'success-melding'
          nieuweMelding.textContent = '✓ Je reactie is geplaatst!'
          form.before(nieuweMelding)
        }

        // Reset formulier
        form.reset()

      } catch (error) {
        // Als fetch mislukt, toon error melding
        const melding = document.createElement('p')
        melding.className = 'error-melding'
        melding.textContent = 'Er ging iets fout, probeer het opnieuw.'
        form.before(melding)
      }
    })
  }
}