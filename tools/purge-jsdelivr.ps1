param(
  [string]$Ref = "main",
  [string]$Repo = "rassel9104/gom-assets",
  [switch]$DryRun
)

if ([string]::IsNullOrWhiteSpace($Ref)) {
  throw "Ref is required."
}
if ([string]::IsNullOrWhiteSpace($Repo)) {
  throw "Repo is required."
}

# Explicit list of resources used by gomdev
$paths = @(
  "dist/gom-global.min.css",
  "dist/gom-home.min.css",
  "dist/gom-properties.min.css",
  "dist/gom-menu-overlay.min.css",
  "js/gom-menu-overlay.js",
  "js/gom-properties-mobile-drawer.js"
)

$total = $paths.Count
$ok = 0
$fail = 0
$start = Get-Date

foreach ($p in $paths) {
  $cdn = "https://cdn.jsdelivr.net/gh/$Repo@$Ref/$p"
  $purge = "https://purge.jsdelivr.net/gh/$Repo@$Ref/$p"

  Write-Host "Purging: $cdn"
  if ($DryRun) {
    Write-Host "DRY RUN: $purge"
    continue
  }

  try {
    Invoke-WebRequest -UseBasicParsing -Method Get -Uri $purge -ErrorAction Stop | Out-Null
    $ok++
  } catch {
    $fail++
    $msg = $_.Exception.Message
    Write-Host "FAILED purge: $purge"
    Write-Host "Reason: $msg"
  }
}

$elapsed = (Get-Date) - $start
Write-Host ""
Write-Host "Purge summary"
Write-Host "Repo: $Repo"
Write-Host "Ref: $Ref"
Write-Host "Total: $total  OK: $ok  FAILED: $fail"
Write-Host ("Elapsed: {0:N1}s" -f $elapsed.TotalSeconds)
