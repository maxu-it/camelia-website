import React, { useEffect } from 'react';

export default function LegalOverlay({ type, language, onClose }) {
  // Lock body scroll when overlay is active
  useEffect(() => {
    document.documentElement.classList.add('scroll-locked');
    document.body.classList.add('scroll-locked');
    return () => {
      document.documentElement.classList.remove('scroll-locked');
      document.body.classList.remove('scroll-locked');
    };
  }, []);

  const isPrivacy = type === 'privacy';

  return (
    <section className="overlay-view legal-overlay">
      {/* Close Button */}
      <button className="overlay-close-btn" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <div className="container legal-container">
        <div className="legal-content-wrapper">
          <header className="legal-header">
            <h1 className="legal-title">
              {isPrivacy 
                ? (language === 'it' ? 'PRIVACY POLICY' : 'PRIVACY POLICY') 
                : (language === 'it' ? 'COOKIE POLICY' : 'COOKIE POLICY')}
            </h1>
            <p className="legal-subtitle">
              {language === 'it' ? 'Ultimo aggiornamento: 29 Maggio 2026' : 'Last updated: May 29, 2026'}
            </p>
          </header>

          <hr className="legal-divider" />

          {isPrivacy ? (
            // Privacy Policy Content
            language === 'it' ? (
              <div className="legal-body">
                <h2>1. Titolare del Trattamento dei Dati</h2>
                <p>
                  Il Titolare del trattamento è <strong>CAMELIA Pictures</strong>, P.IVA 18334201003, 
                  Iscr. REA RM-1778755. 
                  Sede legale: Roma, Italia. <br />
                  Contatti e-mail: <a href="mailto:info@cameliapictures.com">info@cameliapictures.com</a>.
                </p>

                <h2>2. Tipologie di Dati Raccolti</h2>
                <p>
                  Tra i dati personali raccolti da questo sito, in modo autonomo o tramite terze parti, ci sono:
                </p>
                <ul>
                  <li><strong>Dati di contatto:</strong> Indirizzo e-mail e altri dati forniti volontariamente dall'utente quando ci contatta tramite e-mail.</li>
                  <li><strong>Dati di utilizzo e cookie:</strong> Dati di navigazione e identificativi tecnici raccolti automaticamente tramite i cookie (ad esempio, tramite l'integrazione del player Vimeo).</li>
                </ul>

                <h2>3. Finalità del Trattamento</h2>
                <p>
                  I dati dell'utente sono raccolti per consentire al Titolare di fornire il servizio, adempiere agli obblighi di legge, rispondere a richieste di informazioni, e per le seguenti finalità:
                </p>
                <ul>
                  <li>Contattare l'utente e rispondere alle e-mail inviate.</li>
                  <li>Visualizzazione di contenuti da piattaforme esterne (riproduzione dei video tramite Vimeo).</li>
                  <li>Gestione e manutenzione tecnica del sito.</li>
                </ul>

                <h2>4. Base Giuridica del Trattamento</h2>
                <p>
                  Il Titolare tratta i Dati Personali dell'utente nei seguenti casi:
                </p>
                <ul>
                  <li>L'utente ha prestato il consenso per una o più finalità specifiche.</li>
                  <li>Il trattamento è necessario all'esecuzione di un contratto con l'utente e/o all'esecuzione di misure precontrattuali.</li>
                  <li>Il trattamento è necessario per adempiere un obbligo legale al quale è soggetto il Titolare.</li>
                  <li>Il trattamento è necessario per il perseguimento del legittimo interesse del Titolare o di terzi.</li>
                </ul>

                <h2>5. Luogo e Modalità del Trattamento</h2>
                <p>
                  I dati sono trattati presso le sedi operative del Titolare ed in ogni altro luogo in cui le parti coinvolte nel trattamento siano localizzate. Il trattamento viene effettuato mediante strumenti informatici e/o telematici, con modalità organizzative e con logiche strettamente correlate alle finalità indicate, adottando tutte le misure di sicurezza idonee a prevenire accessi non autorizzati, divulgazione, modifica o distruzione non autorizzata dei dati.
                </p>

                <h2>6. Periodo di Conservazione</h2>
                <p>
                  I dati sono trattati e conservati per il tempo richiesto dalle finalità per le quali sono stati raccolti:
                </p>
                <ul>
                  <li>I dati raccolti per finalità riconducibili all'esecuzione di un contratto o misure precontrattuali saranno trattenuti sino a quando sia completata l'esecuzione di tale contratto.</li>
                  <li>I dati raccolti per finalità riconducibili al legittimo interesse del Titolare saranno trattenuti sino al soddisfacimento di tale interesse.</li>
                  <li>Quando il trattamento è basato sul consenso dell'utente, il Titolare può conservare i dati personali più a lungo sino a quando detto consenso non venga revocato.</li>
                </ul>

                <h2>7. Diritti dell'Utente (GDPR)</h2>
                <p>
                  Gli utenti possono esercitare determinati diritti con riferimento ai dati trattati dal Titolare. In particolare, ai sensi del GDPR, hai il diritto di:
                </p>
                <ul>
                  <li>Revocare il consenso in ogni momento.</li>
                  <li>Opporsi al trattamento dei propri dati.</li>
                  <li>Accedere ai propri dati e chiederne una copia.</li>
                  <li>Verificare e chiedere la rettifica dei dati.</li>
                  <li>Ottenere la limitazione del trattamento.</li>
                  <li>Ottenere la cancellazione o rimozione dei propri dati personali (diritto all'oblio).</li>
                  <li>Richiedere la portabilità dei dati.</li>
                  <li>Proporre reclamo all'autorità di controllo competente (Garante per la Protezione dei Dati Personali).</li>
                </ul>
                <p>
                  Per esercitare i tuoi diritti, puoi indirizzare una richiesta all'indirizzo e-mail del Titolare: <a href="mailto:info@cameliapictures.com">info@cameliapictures.com</a>.
                </p>
              </div>
            ) : (
              <div className="legal-body">
                <h2>1. Data Controller</h2>
                <p>
                  The Data Controller is <strong>CAMELIA Pictures</strong>, VAT ID 18334201003, 
                  REA Registration RM-1778755. 
                  Registered Office: Rome, Italy. <br />
                  Contact email: <a href="mailto:info@cameliapictures.com">info@cameliapictures.com</a>.
                </p>

                <h2>2. Types of Data Collected</h2>
                <p>
                  Among the personal data collected by this website, either independently or through third parties, are:
                </p>
                <ul>
                  <li><strong>Contact Data:</strong> Email address and any other details voluntarily provided by the user when contacting us via email.</li>
                  <li><strong>Usage Data and Cookies:</strong> Navigation data and technical identifiers collected automatically through cookies (for example, via the integrated Vimeo player).</li>
                </ul>

                <h2>3. Purpose of Processing</h2>
                <p>
                  User data is collected to allow the Controller to provide its service, comply with legal obligations, respond to requests for information, and for the following purposes:
                </p>
                <ul>
                  <li>Contacting the user and responding to emails sent.</li>
                  <li>Displaying content from external platforms (playing videos via Vimeo).</li>
                  <li>Website management and technical maintenance.</li>
                </ul>

                <h2>4. Legal Basis of Processing</h2>
                <p>
                  The Controller processes User Personal Data in the following cases:
                </p>
                <ul>
                  <li>The user has given consent for one or more specific purposes.</li>
                  <li>Processing is necessary for the performance of an agreement with the user and/or for any pre-contractual obligations.</li>
                  <li>Processing is necessary for compliance with a legal obligation to which the Controller is subject.</li>
                  <li>Processing is necessary for the purposes of the legitimate interests pursued by the Controller or by a third party.</li>
                </ul>

                <h2>5. Processing Methods and Location</h2>
                <p>
                  Data is processed at the Controller's operating offices and in any other places where the parties involved in the processing are located. Processing is carried out using computers and/or IT-enabled tools, following organizational procedures and modes strictly related to the purposes indicated, adopting all suitable security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of data.
                </p>

                <h2>6. Retention Period</h2>
                <p>
                  Personal Data shall be processed and stored for as long as required by the purpose they have been collected for:
                </p>
                <ul>
                  <li>Personal Data collected for purposes related to the performance of a contract between the Controller and the user shall be retained until such contract has been fully performed.</li>
                  <li>Personal Data collected for the purposes of the Controller's legitimate interests shall be retained as long as needed to fulfill such purposes.</li>
                  <li>Where the processing is based on the user's consent, the Controller may retain Personal Data longer until such consent is withdrawn.</li>
                </ul>

                <h2>7. User Rights (GDPR)</h2>
                <p>
                  Users may exercise certain rights regarding their data processed by the Controller. In particular, under the GDPR, you have the right to:
                </p>
                <ul>
                  <li>Withdraw consent at any time.</li>
                  <li>Object to the processing of their data.</li>
                  <li>Access their data and request a copy.</li>
                  <li>Verify and seek rectification of data.</li>
                  <li>Restrict the processing of their data.</li>
                  <li>Request the erasure or removal of their Personal Data (right to be forgotten).</li>
                  <li>Receive their data in a structured, commonly used format and have it transmitted to another controller (data portability).</li>
                  <li>Lodge a complaint with their competent data protection authority.</li>
                </ul>
                <p>
                  To exercise your rights, please direct your request to the Controller's email address: <a href="mailto:info@cameliapictures.com">info@cameliapictures.com</a>.
                </p>
              </div>
            )
          ) : (
            // Cookie Policy Content
            language === 'it' ? (
              <div className="legal-body">
                <h2>1. Cosa sono i Cookie</h2>
                <p>
                  I cookie sono piccoli file di testo che i siti visitati dall'utente inviano e registrano sul suo computer o dispositivo mobile, per essere poi ritrasmessi agli stessi siti alla visita successiva. Grazie ai cookie, un sito ricorda le azioni e preferenze dell'utente (come, ad esempio, i dati di login, la lingua prescelta, le dimensioni dei caratteri, altre impostazioni di visualizzazione, ecc.) in modo che non debbano essere indicate nuovamente quando l'utente torna a visitare detto sito o naviga da una pagina all'altra di esso.
                </p>

                <h2>2. Tipi di Cookie utilizzati da questo Sito</h2>
                <p>
                  Questo sito web utilizza cookie per garantire il corretto funzionamento delle pagine e per fornire servizi esterni. In particolare, utilizziamo le seguenti tipologie di cookie:
                </p>
                <ul>
                  <li>
                    <strong>Cookie Tecnici e di Sessione (Strettamente Necessari):</strong> <br />
                    Sono fondamentali per consentire la navigazione all'interno del sito e l'utilizzo delle sue funzionalità (ad esempio, per la gestione dell'accesso autenticato all'area riservata). Senza questi cookie, il sito o alcune sue aree non potrebbero funzionare correttamente.
                  </li>
                  <li>
                    <strong>Cookie di Terze Parti (Vimeo):</strong> <br />
                    Il sito incorpora video caricati sulla piattaforma Vimeo. La visualizzazione dei video e l'interazione con il player Vimeo possono comportare l'installazione di cookie da parte di Vimeo per raccogliere statistiche di riproduzione, larghezza di banda e preferenze del player (es. volume). Questi cookie sono interamente governati dalle policy di Vimeo. Per maggiori informazioni, ti invitiamo a leggere la <a href="https://vimeo.com/cookie_policy" target="_blank" rel="noopener noreferrer">Cookie Policy di Vimeo</a>.
                  </li>
                </ul>

                <h2>3. Come gestire o disattivare i Cookie</h2>
                <p>
                  L'utente può autorizzare, limitare o bloccare i cookie modificando le impostazioni del proprio browser internet. Ciascun browser presenta modalità diverse per la gestione dei cookie. Di seguito sono indicati i link alle guide di configurazione dei principali browser:
                </p>
                <ul>
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                  <li><a href="https://support.apple.com/kb/ph21411" target="_blank" rel="noopener noreferrer">Safari (macOS/iOS)</a></li>
                  <li><a href="https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                  <li><a href="https://support.microsoft.com/microsoft-edge/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                </ul>
                <p>
                  <em>Nota: La disattivazione totale dei cookie, inclusi quelli tecnici, potrebbe compromettere la navigazione o il corretto funzionamento di alcune aree del sito web.</em>
                </p>
              </div>
            ) : (
              <div className="legal-body">
                <h2>1. What are Cookies</h2>
                <p>
                  Cookies are small text files that websites visited by users send and record on their computer or mobile device, only to be transmitted back to the same websites on their next visit. Thanks to cookies, a website remembers user actions and preferences (such as login details, language choice, font sizes, other display settings, etc.) so that they do not have to be indicated again when the user returns to visit the website or navigates from one page to another.
                </p>

                <h2>2. Types of Cookies used by this Website</h2>
                <p>
                  This website uses cookies to ensure proper operation and to provide external services. Specifically, we use the following types of cookies:
                </p>
                <ul>
                  <li>
                    <strong>Technical and Session Cookies (Strictly Necessary):</strong> <br />
                    These are essential to allow navigation throughout the website and to use its features (for example, to manage authenticated access inside the administrative area). Without these cookies, the site or some of its sections could not function properly.
                  </li>
                  <li>
                    <strong>Third-Party Cookies (Vimeo):</strong> <br />
                    The website embeds videos uploaded to the Vimeo platform. Displaying the videos and interacting with the Vimeo player may involve the installation of cookies by Vimeo to gather usage statistics, bandwidth data, and player preferences (e.g. volume). These cookies are entirely governed by Vimeo's policies. For more information, please read the <a href="https://vimeo.com/cookie_policy" target="_blank" rel="noopener noreferrer">Vimeo Cookie Policy</a>.
                  </li>
                </ul>

                <h2>3. How to Manage or Disable Cookies</h2>
                <p>
                  Users can authorize, restrict, or block cookies by modifying their internet browser settings. Each browser offers different ways to manage cookies. Below are links to configuration guides for major browsers:
                </p>
                <ul>
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                  <li><a href="https://support.apple.com/kb/ph21411" target="_blank" rel="noopener noreferrer">Safari (macOS/iOS)</a></li>
                  <li><a href="https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                  <li><a href="https://support.microsoft.com/microsoft-edge/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                </ul>
                <p>
                  <em>Note: Disabling all cookies, including technical ones, may affect navigation or the correct operation of some sections of the website.</em>
                </p>
              </div>
            )
          )}

          <div className="legal-footer-btn-wrapper">
            <button className="bottom-close-x" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
