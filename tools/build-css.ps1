param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$jobs = @(
  @{ Src = "src/css/gom-global.css"; Dst = "dist/gom-global.min.css" },
  @{ Src = "src/css/gom-home.css"; Dst = "dist/gom-home.min.css" },
  @{ Src = "src/css/gom-properties.css"; Dst = "dist/gom-properties.min.css" },
  @{ Src = "src/css/gom-menu-overlay.css"; Dst = "dist/gom-menu-overlay.min.css" },
  @{ Src = "src/css/widget_reviews.css"; Dst = "dist/gom-widget_reviews.min.css" },
  @{ Src = "src/css/gom-book.css"; Dst = "dist/gom-book.min.css" },
  @{ Src = "src/css/widget-book.css"; Dst = "dist/gom-widget_book.min.css" },
  @{ Src = "src/css/widget-book.css"; Dst = "dist/gom-widget_book.min.css" },
  @{ Src = "src/css/gom-multiproperty.css"; Dst = "dist/gom-multiproperty.min.css" },
  @{ Src = "src/css/gom-blog.css"; Dst = "dist/gom-blog.min.css" },
  @{ Src = "src/css/gom-blog-post.css"; Dst = "dist/gom-blog-post.min.css" },
  @{ Src = "src/css/gom-reviews.css"; Dst = "dist/gom-reviews.min.css" },
  @{ Src = "src/css/gom-gallery.css"; Dst = "dist/gom-gallery.min.css" },
  @{ Src = "src/css/contact.css"; Dst = "dist/gom-contact.min.css" },
  @{ Src = "src/css/house-rules.css"; Dst = "dist/gom-house-rules.min.css" }

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
    if (Test-Path "node_modules\.bin\postcss.cmd") {
      & "node_modules\.bin\postcss.cmd" $src -o $dst
    }
    else {
      npx postcss $src -o $dst
    }
    if (Test-Path $dst) {
      Write-Host "OK: $dst"
      $ok++
    }
    else {
      Write-Host "FAIL: $dst (missing output)"
      $fail++
    }
  }
  catch {
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
