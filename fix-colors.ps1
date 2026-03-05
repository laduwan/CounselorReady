# CounselorReady Design System Migration - Simple Version
# Run from repo root: C:\Users\laduw\CounselorReady

$configScript = '  <script src="/js/cr-tailwind-config.js"></script>'

# Step 1: Fix all HTML files
$htmlFiles = Get-ChildItem -Path ".\client\public\*.html"
foreach ($f in $htmlFiles) {
  $content = [System.IO.File]::ReadAllText($f.FullName)
  $original = $content
  $fn = $f.Name

  if ($content.Length -lt 500 -and $content -match "window.location.replace") { continue }

  # Fix deprecated hex values in ALL files
  $content = $content.Replace("#34495E","#284157")
  $content = $content.Replace("#34495e","#284157")
  $content = $content.Replace("#40634A","#4A7C59")
  $content = $content.Replace("#40634a","#4A7C59")
  $content = $content.Replace("#FAFAF9","#F5F5DC")
  $content = $content.Replace("#FAFAF8","#F5F5DC")
  $content = $content.Replace("#F8F7F4","#F5F5DC")
  $content = $content.Replace("#F5F5F4","#EDEDD0")
  $content = $content.Replace("#4B5D4B","#4A7C59")
  $content = $content.Replace("#7D4E57","#8B2542")

  if ($content -ne $original) {
    [System.IO.File]::WriteAllText($f.FullName, $content)
    Write-Host "  Fixed: $fn"
  }
}
Write-Host "HTML files done"

# Step 2: Fix React components
$reactFiles = @(
  "client\src\components\CloudinaryUploader.jsx",
  "client\src\components\CourseViewer.jsx",
  "client\src\components\interactive-course-14.html",
  "client\src\pages\Landing.jsx"
)
foreach ($rf in $reactFiles) {
  $fp = Join-Path $PWD $rf
  if (Test-Path $fp) {
    $c = [System.IO.File]::ReadAllText($fp)
    $c = $c.Replace("#34495E","#284157").Replace("#FAFAF8","#F5F5DC").Replace("#40634A","#3D6A4A")
    [System.IO.File]::WriteAllText($fp, $c)
    Write-Host "  Fixed: $rf"
  }
}

$np = Join-Path $PWD "client\src\components\NarrationPanel.jsx"
if (Test-Path $np) {
  $c = [System.IO.File]::ReadAllText($np)
  $c = $c.Replace('navy: "#34495E"', 'navy: "#284157"').Replace("#FAFAF8","#F5F5DC")
  [System.IO.File]::WriteAllText($np, $c)
  Write-Host "  Fixed: NarrationPanel.jsx"
}

$cb = Join-Path $PWD "client\src\components\CourseBuilder.jsx"
if (Test-Path $cb) {
  $c = [System.IO.File]::ReadAllText($cb)
  $c = $c.Replace('navy: "#34495E"', 'navy: "#284157"').Replace("#FAFAF8","#F5F5DC")
  [System.IO.File]::WriteAllText($cb, $c)
  Write-Host "  Fixed: CourseBuilder.jsx"
}

$ic = Join-Path $PWD "client\src\components\InteractiveCourseComponents.jsx"
if (Test-Path $ic) {
  $c = [System.IO.File]::ReadAllText($ic)
  $c = $c.Replace("Navy #34495E", "Navy #284157")
  [System.IO.File]::WriteAllText($ic, $c)
  Write-Host "  Fixed: InteractiveCourseComponents.jsx"
}
Write-Host "React files done"

# Step 3: Fix server files
$serverFiles = @(
  "server\src\routes\certificates.js",
  "server\src\routes\ai.js",
  "server\src\scripts\rebuildElephant.js"
)
foreach ($sf in $serverFiles) {
  $fp = Join-Path $PWD $sf
  if (Test-Path $fp) {
    $c = [System.IO.File]::ReadAllText($fp)
    $c = $c.Replace("#34495E","#284157")
    [System.IO.File]::WriteAllText($fp, $c)
    Write-Host "  Fixed: $sf"
  }
}
Write-Host "Server files done"

# Step 4: Fix tailwind.config.cjs
$tc = Join-Path $PWD "client\tailwind.config.cjs"
if (Test-Path $tc) {
  $c = [System.IO.File]::ReadAllText($tc)
  $c = $c.Replace("'#FAFAF9'", "'#F5F5DC'")
  $c = $c.Replace("'#F5F5F4'", "'#EDEDD0'")
  $c = $c.Replace("'#E7E5E4'", "'#E2E2BE'")
  $c = $c.Replace("'#D6D3D1'", "'#D4D4A4'")
  [System.IO.File]::WriteAllText($tc, $c)
  Write-Host "  Fixed: tailwind.config.cjs"
}

Write-Host ""
Write-Host "=== ALL DONE ==="
Write-Host "Now run:"
Write-Host "  git add -A"
Write-Host "  git commit -m 'fix deprecated colors across platform'"
Write-Host "  git push"
