import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
const [html, out, w, h] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(html).href);
await p.waitForTimeout(500);
await p.screenshot({ path: out });
await b.close();
