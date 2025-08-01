# Script hoàn thiện việc tổ chức lại cấu trúc agents
Write-Host "Hoàn thiện việc tổ chức lại cấu trúc agents..." -ForegroundColor Green

# Di chuyển các agents còn lại từ thư mục agents cũ
Write-Host "Di chuyển các agents còn lại..." -ForegroundColor Yellow

# Core agents còn thiếu
if (Test-Path "agents\core\code-archaeologist.md") {
    Move-Item -Path "agents\core\code-archaeologist.md" -Destination "01-core\" -Force
    Write-Host "Đã di chuyển code-archaeologist.md" -ForegroundColor Green
}

if (Test-Path "agents\core\code-reviewer.md") {
    Move-Item -Path "agents\core\code-reviewer.md" -Destination "01-core\" -Force
    Write-Host "Đã di chuyển code-reviewer.md" -ForegroundColor Green
}

# Universal agents còn thiếu
if (Test-Path "agents\universal\frontend-developer.md") {
    Move-Item -Path "agents\universal\frontend-developer.md" -Destination "02-development\universal\" -Force
    Write-Host "Đã di chuyển frontend-developer.md" -ForegroundColor Green
}

if (Test-Path "agents\universal\tailwind-css-expert.md") {
    Move-Item -Path "agents\universal\tailwind-css-expert.md" -Destination "02-development\styling\" -Force
    Write-Host "Đã di chuyển tailwind-css-expert.md" -ForegroundColor Green
}

# Specialized agents
# Django
if (Test-Path "agents\specialized\django") {
    Get-ChildItem -Path "agents\specialized\django\*.md" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "02-development\specialized\django\" -Force
        Write-Host "Đã di chuyển $($_.Name)" -ForegroundColor Green
    }
}

# Laravel
if (Test-Path "agents\specialized\laravel") {
    Get-ChildItem -Path "agents\specialized\laravel\*.md" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "02-development\specialized\laravel\" -Force
        Write-Host "Đã di chuyển $($_.Name)" -ForegroundColor Green
    }
}

# Rails
if (Test-Path "agents\specialized\rails") {
    Get-ChildItem -Path "agents\specialized\rails\*.md" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "02-development\specialized\rails\" -Force
        Write-Host "Đã di chuyển $($_.Name)" -ForegroundColor Green
    }
}

# React
if (Test-Path "agents\specialized\react") {
    Get-ChildItem -Path "agents\specialized\react\*.md" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "02-development\specialized\react\" -Force
        Write-Host "Đã di chuyển $($_.Name)" -ForegroundColor Green
    }
}

# Vue
if (Test-Path "agents\specialized\vue") {
    Get-ChildItem -Path "agents\specialized\vue\*.md" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "02-development\specialized\vue\" -Force
        Write-Host "Đã di chuyển $($_.Name)" -ForegroundColor Green
    }
}

# Xóa thư mục agents cũ nếu còn
if (Test-Path "agents") {
    Remove-Item -Path "agents" -Recurse -Force
    Write-Host "Đã xóa thư mục agents cũ" -ForegroundColor Green
}

Write-Host "Hoàn thành việc tổ chức lại cấu trúc agents!" -ForegroundColor Green 