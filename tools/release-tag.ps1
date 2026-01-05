param(
  [string]$Tag,
  [string]$Message = "release",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Auto-detect Tag if not provided
if ([string]::IsNullOrWhiteSpace($Tag)) {
    Write-Host "No tag provided. Attempting to auto-increment..."
    # Get the latest tag sorted semantically (requires git 2.0+)
    $latestTag = git tag --sort=-v:refname | Select-Object -First 1

    if ([string]::IsNullOrWhiteSpace($latestTag)) {
        $Tag = "v0.0.1"
        Write-Host "No existing tags found. Defaulting to: $Tag"
    } else {
        if ($latestTag -match '^v(\d+)\.(\d+)\.(\d+)$') {
            $major = $matches[1]
            $minor = $matches[2]
            $patch = [int]$matches[3] + 1
            $Tag = "v$major.$minor.$patch"
            Write-Host "Latest tag was $latestTag. Auto-incremented to: $Tag"
        } else {
            throw "Latest tag '$latestTag' does not follow vX.Y.Z format. Cannot auto-increment. Please specify -Tag manually."
        }
    }
}

# Update default message if it hasn't been changed
if ($Message -eq "release") {
    $Message = "Release $Tag"
}

# Basic security: enforce format vX.Y.Z
if ($Tag -notmatch '^v\d+\.\d+\.\d+$') {
  throw "Invalid tag format. Use vX.Y.Z (e.g. v3.0.2)"
}

Write-Host "== Build =="
if ($DryRun) {
    Write-Host "[DryRun] npm run build"
} else {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
}

Write-Host "== Git add =="
if ($DryRun) {
    Write-Host "[DryRun] git add -A"
} else {
    git add -A
    if ($LASTEXITCODE -ne 0) { throw "git add failed" }
}

# Commit only if there are staged changes (DryRun check logic is tricky here, assuming yes mostly)
if ($DryRun) {
     Write-Host "[DryRun] git commit -m '$Message'"
} else {
    git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
      Write-Host "== Commit =="
      git commit -m $Message
      if ($LASTEXITCODE -ne 0) { throw "git commit failed" }
    } else {
      Write-Host "No changes to commit."
    }
}

Write-Host "== Push main =="
if ($DryRun) {
    Write-Host "[DryRun] git push origin main"
} else {
    git push origin main
    if ($LASTEXITCODE -ne 0) { throw "git push main failed" }
}

# Verify if tag exists
$localTag = git tag -l $Tag
$remoteTag = git ls-remote --tags origin $Tag

if ($localTag -ne $null -and $localTag.Trim() -ne "") {
  throw "Tag $Tag already exists locally. Choose another (or manual increment needed)."
}
if ($remoteTag -ne $null -and $remoteTag.Trim() -ne "") {
  throw "Tag $Tag already exists in remote. Choose another."
}

Write-Host "== Create tag =="
if ($DryRun) {
    Write-Host "[DryRun] git tag -a $Tag -m '$Message'"
} else {
    git tag -a $Tag -m $Message
    if ($LASTEXITCODE -ne 0) { throw "git tag failed" }
}

Write-Host "== Push tag =="
if ($DryRun) {
    Write-Host "[DryRun] git push origin $Tag"
} else {
    git push origin $Tag
    if ($LASTEXITCODE -ne 0) { throw "git push tag failed" }
}

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
  "dist/gom-reviews.min.css",
  "js/gom-menu-overlay.js",
  "js/gom-properties-mobile-drawer.js"
)

foreach ($p in $paths) {
  $purge = "https://purge.jsdelivr.net/gh/rassel9104/gom-assets@$Tag/$p"
  Write-Host "Purging: $purge"
  if ($DryRun) {
    Write-Host "[DryRun] Invoke-WebRequest -UseBasicParsing $purge"
  } else {
    try { Invoke-WebRequest -UseBasicParsing $purge | Out-Null } catch { Write-Host "FAILED purge: $purge" }
  }
}

Write-Host "Release ready: $Tag"
