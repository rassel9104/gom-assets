param(
  [Parameter(Mandatory=$true)]
  [string]$Keep
)

if ($Keep -notmatch '^v\d+\.\d+\.\d+$') {
  throw "Keep inválido. Usa formato vX.Y.Z (ej: v3.0.1)"
}

Write-Host "== Fetch tags =="
git fetch --tags --prune
if ($LASTEXITCODE -ne 0) { throw "git fetch falló" }

$tags = git tag
if (-not $tags) { throw "No hay tags." }

$toDelete = $tags | Where-Object { $_ -ne $Keep }

Write-Host "Mantener: $Keep"
Write-Host "Borrar: "
$toDelete | ForEach-Object { Write-Host " - $_" }

if ($toDelete.Count -eq 0) {
  Write-Host "Nada que borrar."
  exit 0
}

Write-Host "== Delete remote tags =="
$toDelete | ForEach-Object {
  git push origin --delete $_
}

Write-Host "== Delete local tags =="
$toDelete | ForEach-Object {
  git tag -d $_
}

Write-Host "== Cleanup =="
git fetch --prune --tags

Write-Host "Listo. Tags restantes:"
git tag
