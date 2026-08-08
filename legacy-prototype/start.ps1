# Serves this folder (legacy-prototype/) over HTTP so index.html's
# fetch('data/cards.json') works (fetch fails under file:// due to CORS).
# $root is derived from this script's own location, not hardcoded, so
# moving/renaming the project folder won't break this again.
$root = $PSScriptRoot
$port = 8000
$url = "http://localhost:$port/"

# If a server is already running on this port, just open the browser and exit.
try {
  Invoke-WebRequest -Uri "${url}index.html" -UseBasicParsing -TimeoutSec 2 | Out-Null
  Start-Process "${url}index.html"
  return
} catch { }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
try {
  $listener.Start()
} catch {
  Write-Host "Could not start server on port $port. It may already be in use by another program." -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}

Write-Host "MindScroll running at $url  (close this window to stop)" -ForegroundColor Green
Start-Process "${url}index.html"

$mime = @{
  ".html" = "text/html"
  ".js"   = "application/javascript"
  ".css"  = "text/css"
  ".json" = "application/json"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
}
while ($listener.IsListening) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  try {
    $path = $req.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $filePath = Join-Path $root $path.TrimStart("/")
    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath)
      $contentType = $mime[$ext]
      if (-not $contentType) { $contentType = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $res.ContentType = $contentType
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.OutputStream.Write($notFound, 0, $notFound.Length)
    }
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.OutputStream.Close()
  }
}
