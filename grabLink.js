import axios from "axios";
import { load } from "cheerio";

const url = "https://longplays.org/infusions/longplays/longplays.php?cat_id=15";

const fetchLinks = async () => {
  try {
    const { data } = await axios.get(url);
    console.log(data);
    const $ = load(data);

    const links = [];
    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        links.push(href);
      }
    });
    console.log("Links:", links.length);
  } catch (error) {
    console.log("Error fetching site:", error);
  }
};

fetchLinks();
