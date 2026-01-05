param(
  [string]$Keep,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "== Fetch tags =="
if ($DryRun) {
    Write-Host "[DryRun] git fetch --tags --prune"
    # In dry run we might not want to actually fetch if we are just testing logic,
    # but fetching is generally safe. Let's do it to get real data for the test.
    git fetch --tags --prune
} else {
    git fetch --tags --prune
    if ($LASTEXITCODE -ne 0) { throw "git fetch failed" }
}

$tagsRaw = git tag
if (-not $tagsRaw) { throw "No tags found." }
# Split into array and filter empty lines
$tags = $tagsRaw -split "`n" | Where-Object { $_.Trim() -ne "" }

if ([string]::IsNullOrWhiteSpace($Keep)) {
    Write-Host "No valid 'Keep' tag provided. Auto-detecting latest 2 tags..."

    # Sort tags roughly semantically using git's sort (if available) or basic sort
    # Better to ask git for sorted tags directly if possible, but we already fetched crude list.
    # Let's re-fetch sorted list from git for reliability
    $sortedTags = git tag --sort=-v:refname
    $sortedTags = $sortedTags -split "`n" | Where-Object { $_.Trim() -ne "" }

    if ($sortedTags.Count -gt 0) {
        $tagsToKeep = $sortedTags | Select-Object -First 2
        $Keep = $tagsToKeep -join ", "
        $toDelete = $sortedTags | Select-Object -Skip 2
    } else {
        Write-Host "No tags to sort."
        exit 0
    }
} else {
    # Legacy behavior: keep specific single tag, delete ALL others
    if ($Keep -notmatch '^v\d+\.\d+\.\d+$') {
      throw "Invalid format for Keep. Use vX.Y.Z (e.g., v3.0.1)"
    }
    $toDelete = $tags | Where-Object { $_ -ne $Keep }
}

Write-Host "Keeping: $Keep"
if ($toDelete.Count -eq 0) {
  Write-Host "Nothing to delete."
  exit 0
}

Write-Host "Tags to delete:"
$toDelete | ForEach-Object { Write-Host " - $_" }

if ($DryRun) {
    Write-Host "== [DryRun] Delete remote tags =="
    $toDelete | ForEach-Object {
        Write-Host "[DryRun] git push origin --delete $_"
    }

    Write-Host "== [DryRun] Delete local tags =="
    $toDelete | ForEach-Object {
        Write-Host "[DryRun] git tag -d $_"
    }
} else {
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

    Write-Host "Done. Remaining tags:"
    git tag
}
