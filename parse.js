import { getFileContent } from "./src/index.js";

const getParsedFile = (file) => JSON.parse(getFileContent(file));

export { getParsedFile };
