# ============================================================
# THE FLOW SENEGAL - Correction automatique de l'encodage
# Corrige tous les fichiers HTML/CSS/JS du projet.
# Crée un backup .bak avant chaque modification.
# ============================================================

$Project = "C:\Users\ynsam\OneDrive\Documents\FLOW SENEGAL"

if (-not (Test-Path $Project)) {
    Write-Host "Projet introuvable : $Project" -ForegroundColor Red
    exit 1
}

$ErrorActionPreference = "Stop"

# UTF-8 avec BOM pour compatibilité Windows/VS Code.
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
$cp1252   = [System.Text.Encoding]::GetEncoding(1252)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Get-BadCount([string]$s) {
    $count = 0
    foreach ($c in @("Ã","Â","â","ð","�","Ÿ","Š")) {
        $count += ([regex]::Matches($s, [regex]::Escape($c))).Count
    }
    return $count
}

function Repair-Mojibake([string]$text) {
    $current = $text

    # Une ou deux passes suffisent normalement.
    for ($i = 0; $i -lt 2; $i++) {
        $before = Get-BadCount $current

        try {
            # Reconstitue les octets cp1252 puis les relit comme UTF-8.
            $bytes = $cp1252.GetBytes($current)
            $candidate = [System.Text.Encoding]::UTF8.GetString($bytes)
        }
        catch {
            break
        }

        $after = Get-BadCount $candidate

        if ($after -lt $before) {
            $current = $candidate
        }
        else {
            break
        }
    }

    # Quelques séquences fréquentes restantes.
    $map = @{
        "SÃ©nÃ©gal" = "Sénégal"
        "sÃ©nÃ©gal" = "sénégal"
        "Ã€ propos" = "À propos"
        "Ã€" = "À"
        "Ã‰" = "É"
        "Ã©" = "é"
        "Ã¨" = "è"
        "Ãª" = "ê"
        "Ã«" = "ë"
        "Ã®" = "î"
        "Ã¯" = "ï"
        "Ã´" = "ô"
        "Ã¶" = "ö"
        "Ã¹" = "ù"
        "Ã»" = "û"
        "Ã¼" = "ü"
        "Ã§" = "ç"
        "Ã " = "à"
        "Ã‚" = "Â"
        "â€”" = "—"
        "â€œ" = "“"
        "â€" = "”"
        "â€˜" = "‘"
        "â€™" = "’"
        "â€¦" = "…"
        "cÅ“ur" = "cœur"
        "ðŸŒŠ" = "🌊"
        "ðŸŒŸ" = "🌟"
        "ðŸŽ¯" = "🎯"
        "ðŸ‘ï¸" = "👁️"
        "ðŸ’Ž" = "💎"
        "â­" = "⭐"
        "ðŸ“¸" = "📸"
    }

    foreach ($bad in $map.Keys) {
        $current = $current.Replace($bad, $map[$bad])
    }

    return $current
}

$extensions = @("*.html","*.css","*.js")
$files = foreach ($ext in $extensions) {
    Get-ChildItem -Path $Project -Recurse -File -Filter $ext |
        Where-Object { $_.FullName -notmatch '\\\.git\\' }
}

$changed = 0

foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)

    # Vérification avant / après
    $before = Get-BadCount $text
    $fixed = Repair-Mojibake $text
    $after = Get-BadCount $fixed

    if ($after -lt $before) {
        $backup = $file.FullName + ".bak"
        if (-not (Test-Path $backup)) {
            Copy-Item $file.FullName $backup
        }

        # UTF-8 sans BOM : format web moderne.
        [System.IO.File]::WriteAllText($file.FullName, $fixed, $utf8NoBom)

        $changed++
        Write-Host "CORRIGE : $($file.FullName)" -ForegroundColor Green
    }
    else {
        Write-Host "OK      : $($file.FullName)" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Correction terminee : $changed fichier(s) modifie(s)." -ForegroundColor Cyan
Write-Host "Des fichiers .bak ont ete crees comme sauvegarde." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
