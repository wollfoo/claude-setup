# Script để tổ chức lại cấu trúc agents
Write-Host "Bắt đầu tổ chức lại cấu trúc agents..." -ForegroundColor Green

# 1. Di chuyển Orchestrators
Write-Host "Di chuyển Orchestrators..." -ForegroundColor Yellow
Move-Item -Path "workflow-orchestrator.md" -Destination "00-orchestrators\" -Force
Move-Item -Path "agents\orchestrators\tech-lead-orchestrator.md" -Destination "00-orchestrators\" -Force
Move-Item -Path "agents\orchestrators\project-analyst.md" -Destination "00-orchestrators\" -Force
Move-Item -Path "agents\orchestrators\team-configurator.md" -Destination "00-orchestrators\" -Force

# 2. Di chuyển Core Agents
Write-Host "Di chuyển Core Agents..." -ForegroundColor Yellow
Move-Item -Path "code-archaeologist.md" -Destination "01-core\" -Force
Move-Item -Path "codebase-research-analyst.md" -Destination "01-core\" -Force
Move-Item -Path "code-searcher.md" -Destination "01-core\" -Force
Move-Item -Path "debug-specialist.md" -Destination "01-core\" -Force
Move-Item -Path "agents\core\code-reviewer.md" -Destination "01-core\" -Force
Move-Item -Path "agents\core\documentation-specialist.md" -Destination "01-core\" -Force
Move-Item -Path "agents\core\performance-optimizer.md" -Destination "01-core\" -Force

# 3. Di chuyển Universal Development Agents
Write-Host "Di chuyển Universal Development Agents..." -ForegroundColor Yellow
Move-Item -Path "software-engineer.md" -Destination "02-development\universal\" -Force
Move-Item -Path "agents\universal\backend-developer.md" -Destination "02-development\universal\" -Force
Move-Item -Path "agents\universal\frontend-developer.md" -Destination "02-development\universal\" -Force
Move-Item -Path "agents\universal\api-architect.md" -Destination "02-development\universal\" -Force
Move-Item -Path "frontend-designer.md" -Destination "02-development\universal\" -Force

# 4. Di chuyển Specialized Development Agents
Write-Host "Di chuyển Specialized Development Agents..." -ForegroundColor Yellow
# Django
Move-Item -Path "agents\specialized\django\*" -Destination "02-development\specialized\django\" -Force
# Laravel
Move-Item -Path "agents\specialized\laravel\*" -Destination "02-development\specialized\laravel\" -Force
# Rails
Move-Item -Path "agents\specialized\rails\*" -Destination "02-development\specialized\rails\" -Force
# React
Move-Item -Path "agents\specialized\react\*" -Destination "02-development\specialized\react\" -Force
# Vue
Move-Item -Path "agents\specialized\vue\*" -Destination "02-development\specialized\vue\" -Force

# 5. Di chuyển Styling Agents
Write-Host "Di chuyển Styling Agents..." -ForegroundColor Yellow
Move-Item -Path "agents\universal\tailwind-css-expert.md" -Destination "02-development\styling\" -Force

# 6. Di chuyển Quality Agents
Write-Host "Di chuyển Quality Agents..." -ForegroundColor Yellow
Move-Item -Path "code-refactorer.md" -Destination "03-quality\" -Force
Move-Item -Path "security-auditor.md" -Destination "03-quality\" -Force

# 7. Di chuyển Documentation Agents
Write-Host "Di chuyển Documentation Agents..." -ForegroundColor Yellow
Move-Item -Path "technical-documentation-specialist.md" -Destination "04-documentation\" -Force
Move-Item -Path "content-writer.md" -Destination "04-documentation\" -Force
Move-Item -Path "prd-writer.md" -Destination "04-documentation\" -Force

# 8. Di chuyển Planning Agents
Write-Host "Di chuyển Planning Agents..." -ForegroundColor Yellow
Move-Item -Path "planning-strategist.md" -Destination "05-planning\" -Force
Move-Item -Path "project-task-planner.md" -Destination "05-planning\" -Force
Move-Item -Path "vibe-coding-coach.md" -Destination "05-planning\" -Force

# 9. Di chuyển Infrastructure Agents
Write-Host "Di chuyển Infrastructure Agents..." -ForegroundColor Yellow
Move-Item -Path "devops-infrastructure-specialist.md" -Destination "06-infrastructure\" -Force
Move-Item -Path "tech-knowledge-assistant.md" -Destination "06-infrastructure\" -Force

# 10. Di chuyển Utility Agents
Write-Host "Di chuyển Utility Agents..." -ForegroundColor Yellow
Move-Item -Path "memory-bank-synchronizer.md" -Destination "07-utilities\" -Force
Move-Item -Path "get-current-datetime.md" -Destination "07-utilities\" -Force

# 11. Xóa thư mục agents cũ
Write-Host "Xóa thư mục agents cũ..." -ForegroundColor Yellow
Remove-Item -Path "agents" -Recurse -Force

Write-Host "Hoàn thành tổ chức lại cấu trúc agents!" -ForegroundColor Green 