# Create or overwrite project.txt with UTF-8 encoding
Write-Host "Generating project.txt..."

# Clear the file first and write with UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[System.IO.File]::WriteAllText("$PWD\project.txt", "", [System.Text.Encoding]::UTF8)

# Write file structure header
Add-Content -Path "project.txt" -Value "=== FILE STRUCTURE ===" -Encoding UTF8
Add-Content -Path "project.txt" -Value "" -Encoding UTF8

# Get file structure
Get-ChildItem -Path "src" -Recurse -Include "*.js","*.jsx","*.css","*.ts","*.tsx" | 
    ForEach-Object { $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/") } | 
    Sort-Object | ForEach-Object { Add-Content -Path "project.txt" -Value $_ -Encoding UTF8 }

# Write file contents header
Add-Content -Path "project.txt" -Value "" -Encoding UTF8
Add-Content -Path "project.txt" -Value "=== FILE CONTENTS ===" -Encoding UTF8
Add-Content -Path "project.txt" -Value "" -Encoding UTF8

# Get file contents
Get-ChildItem -Path "src" -Recurse -Include "*.js","*.jsx","*.css","*.ts","*.tsx" | 
    Sort-Object FullName | ForEach-Object {
        # Write file path with forward slashes
        $filePath = "//" + $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
        Add-Content -Path "project.txt" -Value $filePath -Encoding UTF8
        Add-Content -Path "project.txt" -Value "" -Encoding UTF8
        
        # Write file content
        $content = Get-Content $_.FullName -Raw -Encoding UTF8
        Add-Content -Path "project.txt" -Value $content -Encoding UTF8
        
        # Add spacing between files
        Add-Content -Path "project.txt" -Value "" -Encoding UTF8
        Add-Content -Path "project.txt" -Value "" -Encoding UTF8
    }

Write-Host "project.txt has been generated successfully with UTF-8 encoding!"
Write-Host "The ₭ currency symbol should now display correctly."