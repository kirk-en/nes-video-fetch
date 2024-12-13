import puppeteer from "puppeteer";
import "dotenv/config";

export const fetchLinks = async (targetURL) => {
  try {
    // Launching Pupperteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to target page and wait till network activity settles
    await page.goto(targetURL, { waitUntil: "networkidle2" });

    // Wait for the table to be populated
    await page.waitForSelector("#longplayTbl tbody tr");

    // Select the "All" option from the dropdown
    await page.select('select[name="longplayTbl_length"]', "100000000");

    await page.waitForNetworkIdle();

    // Wait for the table to be populated
    await page.waitForSelector("#longplayTbl tbody tr", { visible: true });

    // Extract the relevant information (inner HTML and longplay_id)
    const data = await page.$$eval("#longplayTbl tbody tr", (rows) =>
      rows.map((row) => {
        const td = row.children[2]; // Get the third <td> (index 2)
        const linkElement = td.querySelector("a"); // Get the <a> tag inside that <td>
        const gameTitle = linkElement ? linkElement.innerHTML.trim() : ""; // Extract inner HTML of <a>
        const href = linkElement ? linkElement.getAttribute("href") : ""; // Get the href attribute
        const longplayId = href ? href.split("longplay_id=")[1] : ""; // Extract longplay_id from href

        return { gameTitle, longplayId };
      })
    );

    console.log("Total Rows:", data.length);
    // Close the browser
    await browser.close();

    return data;
  } catch (error) {
    console.log("Error fetching site:", error);
  }
};
