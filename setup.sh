#!/bin/bash
# ====================================================================
# SCRIPT DE INSTALAÇÃO AUTOMÁTICA DA OPTAV.IA NA VPS (LINUX UBUNTU/DEBIAN)
# ====================================================================

echo "🚀 Iniciando Instalação da OPTAV.IA na VPS Linux..."

# 1. Atualizar Pacotes do Sistema
echo "📦 Atualizando pacotes do sistema..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential postgresql postgresql-contrib

# 2. Instalar Node.js v20 (LTS)
if ! command -v node &> /dev/null
then
    echo "🟢 Instalando Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✅ Node.js versão: $(node -v)"
echo "✅ NPM versão: $(npm -v)"

# 3. Instalar PM2 para Execução em Background
echo "⚙️ Instalando PM2 Process Manager..."
sudo npm install -g pm2

# 4. Configurar Banco de Dados PostgreSQL
echo "🐘 Configurando Banco de Dados PostgreSQL local..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo -u postgres psql -c "CREATE USER optavia_user WITH PASSWORD 'optavia_pass123';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE optavia_db OWNER optavia_user;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE optavia_db TO optavia_user;" 2>/dev/null || true

# 5. Configurar .env caso não exista
if [ ! -f .env ]; then
    echo "🔑 Criando arquivo .env a partir de .env.example..."
    cp .env.example .env
    
    echo "--------------------------------------------------------"
    echo "⚠️ ATENÇÃO: Digite sua GEMINI_API_KEY da Google AI Studio:"
    read -p "GEMINI_API_KEY: " user_gemini_key
    
    if [ ! -z "$user_gemini_key" ]; then
        sed -i "s/GEMINI_API_KEY=.*/GEMINI_API_KEY=$user_gemini_key/" .env
    fi
fi

# 6. Instalar Dependências e Realizar Build
echo "📦 Instalando dependências e compilando projeto..."
npm install
npm run build

# 7. Iniciar Aplicação no PM2
echo "🚀 Iniciando servidor com PM2 na porta 3000..."
pm2 stop optavia 2>/dev/null || true
pm2 start dist/server.cjs --name "optavia"
pm2 save
pm2 startup

echo "=========================================================="
echo "🎉 OPTAV.IA INSTALADA E RODANDO COM SUCESSO!"
echo "📍 Acesse seu painel em: http://$(curl -s ifconfig.me):3000"
echo "⚙️ Para ver logs em tempo real: pm2 logs optavia"
echo "=========================================================="
