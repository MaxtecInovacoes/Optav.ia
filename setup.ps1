# ====================================================================
# SCRIPT DE INSTALAÇÃO AUTOMÁTICA DA OPTAV.IA NA VPS WINDOWS (POWERSHELL)
# ====================================================================

Write-Host "🚀 Iniciando Instalação da OPTAV.IA na VPS Windows..." -ForegroundColor Green

# 1. Verificar Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado! Baixe e instale o Node.js v20 de https://nodejs.org/" -ForegroundColor Red
    Exit
}

Write-Host "✅ Node.js $(node -v) detectado." -ForegroundColor Green

# 2. Criar arquivo .env
if (!(Test-Path .env)) {
    Write-Host "🔑 Criando .env a partir de .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    $apiKey = Read-Host "Digite sua GEMINI_API_KEY (Google AI Studio)"
    if ($apiKey) {
        (Get-Content .env) -replace 'GEMINI_API_KEY=.*', "GEMINI_API_KEY=$apiKey" | Set-Content .env
    }
}

# 3. Instalar Dependências e Build
Write-Host "📦 Instalando pacotes npm..." -ForegroundColor Cyan
npm install

Write-Host "🛠️ Compilando projeto para produção..." -ForegroundColor Cyan
npm run build

# 4. Instalar e rodar via PM2
npm install -g pm2
pm2 stop optavia
pm2 start dist/server.cjs --name "optavia"
pm2 save

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "🎉 OPTAV.IA INSTALADA COM SUCESSO NA PORTA 3000!" -ForegroundColor Green
Write-Host "📍 Acesse em: http://localhost:3000" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
