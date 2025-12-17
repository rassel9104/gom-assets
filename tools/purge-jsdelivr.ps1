param(
  [string]$Ref = "main"
)

# Lista única y explícita de recursos que gomdev usa
$paths = @(
  "dist/gom-global.min.css",
  "dist/gom-home.min.css",
  "dist/gom-properties.min.css",
  "js/gom-menu-overlay.js",
  "js/gom-properties-mobile-drawer.js"
)

foreach ($p in $paths) {
  $cdn = "https://cdn.jsdelivr.net/gh/rassel9104/gom-assets@$Ref/$p"
  $purge = "https://purge.jsdelivr.net/gh/rassel9104/gom-assets@$Ref/$p"
  Write-Host "Purging: $cdn"
  try {
    Invoke-WebRequest -UseBasicParsing $purge | Out-Null
  } catch {
    Write-Host "FAILED purge: $purge"
  }
}
