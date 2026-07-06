# Run after: gh auth login
# Creates repo, pushes, and sets GitHub Actions secrets.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

gh auth status

git branch -M main

# Create repo if it doesn't exist yet
$repoExists = gh repo view Kavalieros/anniversary 2>$null
if (-not $repoExists) {
  gh repo create anniversary --public --source=. --remote=origin --push
} else {
  git remote remove origin 2>$null
  git remote add origin https://github.com/Kavalieros/anniversary.git
  git push -u origin main
}

gh secret set EMAIL_1 --body "kavalieros.v@gmail.com"
gh secret set EMAIL_2 --body "fylliwft@hotmail.gr"

Write-Host "Passphrases (ηλιοτρόπιο/ηλίανθος + plurals) are configured in the deploy workflow."

Write-Host ""
Write-Host "Done! Enable GitHub Pages:"
Write-Host "  https://github.com/Kavalieros/anniversary/settings/pages"
Write-Host "  Source: GitHub Actions"
Write-Host ""
Write-Host "Site URL: https://kavalieros.github.io/anniversary/"
