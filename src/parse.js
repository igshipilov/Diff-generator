import { getFileContent } from "./index.js";

const getParsedFile = (file) => JSON.parse(getFileContent(file));

export { getParsedFile };
