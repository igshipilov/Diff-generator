### Hexlet tests and linter status:
[![Actions Status](https://github.com/igshipilov/frontend-project-46/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/igshipilov/frontend-project-46/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/0746c48ef8ae17b78479/maintainability)](https://codeclimate.com/github/igshipilov/frontend-project-46/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0746c48ef8ae17b78479/test_coverage)](https://codeclimate.com/github/igshipilov/frontend-project-46/test_coverage)

### How it works
<a href="https://asciinema.org/a/616944?autoplay=1"><img src="https://asciinema.org/a/616944.png" width="209"/></a>

### Project description
CLI util compares two files and displays difference.
Accepts two formats: JSON and YAML / YML, can compare json with yaml.

Three possible output formats:
- **stylish**: display differences in JSON-like format with '+' and '-' signs
- **plain**: display only, shows differences only, ignores unchanged values
- **json**: display AST in JSON-like format.

---

### Install

```
git clone git@github.com:igshipilov/frontend-project-46.git
cd frontend-project-46
make install
```

### Launch:
```
# set format with: --format or -f
gendiff -f stylish filepath.json filepath.yaml
gendiff -f plain filepath.json filepath.yaml
gendiff -f json filepath.json filepath.yaml

# by default: -f json
gendiff filepath.json filepath.yaml
```
---
Educational project by Hexlet school student.
