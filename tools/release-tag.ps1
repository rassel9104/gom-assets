param(
  [Parameter(Mandatory=$true)]
  [string]$Tag,

  [string]$Message = "release"
)

# Seguridad básica: exigir formato vX.Y.Z
if ($Tag -notmatch '^v\d+\.\d+\.\d+$') {
  throw "Tag inválido. Usa formato vX.Y.Z (ej: v3.0.2)"
}

Write-Host "== Build =="
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build falló" }

Write-Host "== Git add =="
git add -A
if ($LASTEXITCODE -ne 0) { throw "git add falló" }

# Commit solo si hay staged changes
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  Write-Host "== Commit =="
  git commit -m $Message
  if ($LASTEXITCODE -ne 0) { throw "git commit falló" }
} else {
  Write-Host "No hay cambios para commitear."
}

Write-Host "== Push main =="
git push origin main
if ($LASTEXITCODE -ne 0) { throw "git push main falló" }

# Verificar si el tag existe local o remoto
$localTag = git tag -l $Tag
$remoteTag = git ls-remote --tags origin $Tag

if ($localTag -ne $null -and $localTag.Trim() -ne "") {
  throw "El tag $Tag ya existe localmente. Elige otro (ej: incrementa patch)."
}
if ($remoteTag -ne $null -and $remoteTag.Trim() -ne "") {
  throw "El tag $Tag ya existe en remoto. Elige otro."
}

Write-Host "== Create tag =="
git tag -a $Tag -m $Message
if ($LASTEXITCODE -ne 0) { throw "git tag falló" }

Write-Host "== Push tag =="
git push origin $Tag
if ($LASTEXITCODE -ne 0) { throw "git push tag falló" }

Write-Host "== Purge jsDelivr for tag =="
$paths = @(
  "dist/gom-blog-post.min.css",
  "dist/gom-blog.min.css",
  "dist/gom-book.min.css",
  "dist/gom-global.min.css",
  "dist/gom-home.min.css",
  "dist/gom-menu-overlay.min.css",
  "dist/gom-multiproperty.min.css",
  "dist/gom-properties.min.css",
  "js/gom-menu-overlay.js",
  "js/gom-properties-mobile-drawer.js"
)

foreach ($p in $paths) {
  $purge = "https://purge.jsdelivr.net/gh/rassel9104/gom-assets@$Tag/$p"
  Write-Host "Purging: $purge"
  try { Invoke-WebRequest -UseBasicParsing $purge | Out-Null } catch { Write-Host "FAILED purge: $purge" }
}

Write-Host "Release listo: $Tag"
