$serverPath = Join-Path $PSScriptRoot "server-with-api.ps1"
if (-not (Test-Path $serverPath)) {
    throw "Missing server-with-api.ps1"
}

& $serverPath
