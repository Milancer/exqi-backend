# Backend assets

Files served at runtime via auth-gated endpoints. Resolved relative to
`process.cwd()`, so they ship with the deployed repo and are NOT copied
into `dist/`.

## Expected files

- `cbi-behavioural-indicators.pdf` — source PDF for the CBI Behavioural
  Indicators page, served by `GET /api/behavioural-indicators/pdf`
  (requires JWT). Add the file by name; do not rename.
