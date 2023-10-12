import { getFileContent } from "./gendiff.js";

const getParsedFile = (file) => JSON.parse(getFileContent(file));

export { getParsedFile };
