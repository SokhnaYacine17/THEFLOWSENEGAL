$root = (Get-Location).Path
$utf8 = New-Object System.Text.UTF8Encoding($false)
$cp1252 = [System.Text.Encoding]::GetEncoding(1252)

$files = Get-ChildItem -Path $root -Recurse -File | Where-Object {
    $_.Extension -in ".html",".css",".js" -and
    $_.FullName -notmatch "\\.git\\"
}

Write-Host ""
Write-Host "============================================="
Write-Host " CORRECTION UTF-8 - THE FLOW SENEGAL"
Write-Host "============================================="
Write-Host ""

foreach ($file in $files) {

    try {
        $original = [System.IO.File]::ReadAllText($file.FullName, $utf8)
        $repaired = $original

        for ($i = 0; $i -lt 3; $i++) {

            $before = ([regex]::Matches($repaired, "Ã|Â|â|ð|Ÿ|Å|�")).Count

            if ($before -eq 0) {
                break
            }

            try {
                $bytes = $cp1252.GetBytes($repaired)
                $candidate = $utf8.GetString($bytes)
            }
            catch {
                break
            }

            $after = ([regex]::Matches($candidate, "Ã|Â|â|ð|Ÿ|Å|�")).Count

            if ($after -lt $before) {
                $repaired = $candidate
            }
            else {
                break
            }
        }

        if ($repaired -ne $original) {

            $backup = $file.FullName + ".bak"

            if (-not (Test-Path $backup)) {
                [System.IO.File]::WriteAllText($backup, $original, $utf8)
            }

            [System.IO.File]::WriteAllText($file.FullName, $repaired, $utf8)

            Write-Host "CORRIGE : $($file.FullName)" -ForegroundColor Green
        }
        else {
            Write-Host "OK      : $($file.FullName)"
        }
    }
    catch {
        Write-Host "ERREUR  : $($file.FullName)" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

Write-Host ""
Write-Host "============================================="
Write-Host " CORRECTION TERMINEE"
Write-Host "============================================="
Write-Host ""
Write-Host "Les fichiers .bak sont des sauvegardes."
Write-Host ""
