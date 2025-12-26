param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$base = "src/css-overrides-devtool/cdn.jsdelivr.net/gh/rassel9104/gom-assets@main/dist"

$jobs = @(
  @{ Src = "src/css/gom-global.css"; Dst = "$base/gom-global.min.css" },
  @{ Src = "src/css/gom-home.css"; Dst = "$base/gom-home.min.css" },
  @{ Src = "src/css/gom-properties.css"; Dst = "$base/gom-properties.min.css" },
  @{ Src = "src/css/gom-menu-overlay.css"; Dst = "$base/gom-menu-overlay.min.css" },
  @{ Src = "src/css/gom-book.css"; Dst = "$base/gom-book.min.css" },
  @{ Src = "src/css/widget-book.css"; Dst = "dist/gom-widget_book.min.css" }
)

$ok = 0
$fail = 0

foreach ($job in $jobs) {
  $src = $job.Src
  $dst = $job.Dst

  Write-Host "Build: $src -> $dst"
  if ($DryRun) {
    Write-Host "DRY RUN"
    continue
  }

  try {
    & postcss $src -o $dst
    if (Test-Path $dst) {
      Write-Host "OK: $dst"
      $ok++
    } else {
      Write-Host "FAIL: $dst (missing output)"
      $fail++
    }
  } catch {
    Write-Host "FAIL: $dst"
    Write-Host "Reason: $($_.Exception.Message)"
    $fail++
  }
}

Write-Host ""
Write-Host "Build summary"
Write-Host "Total: $($jobs.Count)  OK: $ok  FAILED: $fail"

if ($fail -gt 0) {
  exit 1
}
