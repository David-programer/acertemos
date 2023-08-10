let tokenClient;
let gisInited = false;
let gapiInited = false;

const API_KEY = 'AIzaSyC6_VfK3HLRdbevifDp5gJ5_6WiWKfVtFM ';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const SPREAD_SHEET_ID = '17JW76h9qUcmKd0Hs9r1i0uXHFdEOKB7RsOfCb6hrGdM';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const CLIENT_ID = '517297686608-528ucldjflabptb519vl45ntq134caek.apps.googleusercontent.com';

// document.getElementById('authorize_button').style.visibility = 'hidden';
// document.getElementById('signout_button').style.visibility = 'hidden';

async function listResultadosSemanales() {
  let response;

  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: 'Semanales!A2:M6',
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }

  createTable(response.result.values);
//   const range = response.result;
//   if (!range || !range.values || range.values.length == 0) {
//     document.getElementById('content').innerText = 'No values found.';
//     return;
//   }
}

function createTable(data){
    const table = document.getElementById('table_resultados_semanales');

    // --------------------------------------------------- HEADER --------------------------------------------------- //

    const header = data[0].reduce((valorAnterior, valorActual, index) => {
        // if(!valorAnterior) 
        // if(valorActual) console.log(valorActual)

        // valueAnt = index == 0 ? `</th>${valorAnterior}</th>` : valorAnterior 

        return valorAnterior + `<th>${valorActual.toUpperCase()}</th>`;
    });

    // --------------------------------------------------- BODY ---------------------------------------------------- //

    const body = data.map((item, index) => {
        const td = item.reduce((valorAnterior, valorActual, index)=>{
            return valorAnterior + `<td>${valorActual}</td>`;
        })

        return `<tr>${td}</tr>`
    });

    body.shift();

    console.log(body);

    // --------------------------------------------------- TABLE ---------------------------------------------------- //
    table.innerHTML = `
        <thead>
            <tr>
                ${header}
            </tr>
        </thead>

        <tbody>
            ${body}
        </tbody>
    `;
}

// ---------------------------------------------------------------- GOOGLE SHEETS SESSION ---------------------------------------------------------------- //
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

// ------------------------------------------------------------------ AUTHENTICATION ------------------------------------------------------------------- //
function handlerAuthentication() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      await listResultadosSemanales();
    };
  
    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      tokenClient.requestAccessToken({prompt: ''});
    }
}

function handlerSignout() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        listResultadosSemanales();
    //   document.getElementById('authorize_button').style.visibility = 'visible';
    }
}