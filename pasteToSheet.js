import { fetchLinks } from "./grabLink.js";
import { google } from "googleapis";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables from .env file
config();

const KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const sheetId = process.env.GOOGLE_SHEET_ID;
const range = process.env.GOOGLE_SHEET_RANGE;

// Load the credentials and authenticate
const authenticateGoogleSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: SCOPES,
  });

  const sheets = google.sheets({ version: "v4", auth });

  return sheets;
};

const updateGoogleSheet = async (data) => {
  try {
    const sheets = await authenticateGoogleSheets();

    // Prepare the data to be written
    const values = data.map((row) => [
      row.gameTitle,
      `https://longplays.org/infusions/longplays/longplays.php?file_id=${row.longplayId}`,
    ]);

    // Append data to the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: "RAW", // or "USER_ENTERED" if you want to interpret formulas
      requestBody: {
        values: values,
      },
    });

    console.log("Data successfully written to the Google Sheet!");
  } catch (error) {
    console.error("Error updating Google Sheet:", error);
  }
};

const fetchDataAndUpdateSheet = async (url) => {
  const gameLinks = await fetchLinks(url);
  if (gameLinks && gameLinks.length > 0) {
    updateGoogleSheet(gameLinks);
  } else console.log("No data was fetched");
};

fetchDataAndUpdateSheet(
  "https://longplays.org/infusions/longplays/longplays.php?cat_id=15"
);
