import * as pdfParseModule from "pdf-parse";
const pdfParse = pdfParseModule.default || pdfParseModule;

console.log("pdfParse:", pdfParse);
console.log("Keys on pdfParseModule:", Object.keys(pdfParseModule));
if (pdfParse) {
  console.log("Keys on pdfParse:", Object.keys(pdfParse));
  console.log("Is function?", typeof pdfParse === "function");
}
