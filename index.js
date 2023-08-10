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


  console.log(response.result.values);
//   const range = response.result;
//   if (!range || !range.values || range.values.length == 0) {
//     document.getElementById('content').innerText = 'No values found.';
//     return;
//   }
}

function createTable(data){
    const table = document.getElementById('table_resultados');
    
    table.innerHTML = `
    <thead>
        <tr>
            <th class="column1">Date</th>
            <th class="column2">Order ID</th>
            <th class="column3">Name</th>
            <th class="column4">Price</th>
            <th class="column5">Quantity</th>
            <th class="column6">Total</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td class="column1">2017-09-29 01:22</td>
            <td class="column2">200398</td>
            <td class="column3">iPhone X 64Gb Grey</td>
            <td class="column4">$999.00</td>
            <td class="column5">1</td>
            <td class="column6">$999.00</td>
        </tr>
        <tr>
            <td class="column1">2017-09-28 05:57</td>
            <td class="column2">200397</td>
            <td class="column3">Samsung S8 Black</td>
            <td class="column4">$756.00</td>
            <td class="column5">1</td>
            <td class="column6">$756.00</td>
        </tr>
        <tr>
            <td class="column1">2017-09-26 05:57</td>
            <td class="column2">200396</td>
            <td class="column3">Game Console Controller</td>
            <td class="column4">$22.00</td>
            <td class="column5">2</td>
            <td class="column6">$44.00</td>
        </tr>
        <tr>
            <td class="column1">2017-09-25 23:06</td>
            <td class="column2">200392</td>
            <td class="column3">USB 3.0 Cable</td>
            <td class="column4">$10.00</td>
            <td class="column5">3</td>
            <td class="column6">$30.00</td>
        </tr>
        <tr>
            <td class="column1">2017-09-24 05:57</td>
            <td class="column2">200391</td>
            <td class="column3">Smartwatch 4.0 LTE Wifi</td>
            <td class="column4">$199.00</td>
            <td class="column5">6</td>
            <td class="column6">$1494.00</td>
        </tr>
        <tr>
            <td class="column1">2017-09-23 05:57</td>
            <td class="column2">200390</td>
            <td class="column3">Camera C430W 4k</td>
            <td class="column4">$699.00</td>
            <td class="column5">1</td>
            <td class="column6">$699.00</td>
        </tr>
        <tr>
            <td class="column1">2017-09-22 05:57</td>
            <td class="column2">200389</td>
            <td class="column3">Macbook Pro Retina 2017</td>
            <td class="column4">$2199.00</td>
            <td class="column5">1</td>
            <td class="column6">$2199.00</td>
        </tr>
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