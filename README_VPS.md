# 🚀 GUIA DE IMPLANTAÇÃO DA OPTAV.IA VIA DEPLOYFLOW / VPS (LINUX / WINDOWS / DOCKER)

Este guia explica como instalar e executar a plataforma **OPTAV.IA (Esteira Automática de Vendas com IA + Google Meu Negócio Scraper + Meowhats API + DeployFlow)** em qualquer VPS Linux (Ubuntu/Debian) ou Windows Server, com banco de dados PostgreSQL e integração com DeployFlow e GitHub Actions para **atualização automática no git push**.

---

## ⚡ IMPLANTAÇÃO AUTOMÁTICA VIA DEPLOYFLOW (RECOMENDADO)

Com o **DeployFlow**, você pode conectar diretamente este repositório do GitHub e implantar na sua VPS sem precisar rodar comandos manuais no terminal:

1. Acesse o painel **DeployFlow**.
2. Conecte sua VPS Linux/Windows ou servidor Cloud.
3. Adicione o repositório do GitHub.
4. Adicione as variáveis de ambiente em **Environment Variables**:
   - `GEMINI_API_KEY`: Chave da API Gemini da Google AI Studio.
   - `DATABASE_URL`: URL do PostgreSQL (ex: `postgresql://postgres:postgres123@localhost:5432/optavia_db`).
   - `MEOWHATS_API_TOKEN`: Token da sua instância no Meowhats.
   - `MEOWHATS_INSTANCE_ID`: ID da instância do WhatsApp.
5. Clique em **Deploy**. O DeployFlow compilará o projeto e manterá a VPS atualizada a cada novo `git push`!

---

## 📋 PRÉ-REQUISITOS DA VPS
- **Memória RAM**: Mínimo 1GB (Recomendado 2GB)
- **Sistema Operacional**: Ubuntu 22.04 LTS+, Debian 11+ ou Windows Server 2019/2022
- **Porta**: 3000 liberada no Firewall/Security Group da VPS

---

## 📲 CONFIGURAÇÃO DA MEOWHATS REST API (WHATSAPP GATEWAY)

Para envio real de mensagens via WhatsApp e resposta automática do SDR, adicione no arquivo `/.env`:

```env
MEOWHATS_API_URL=https://api.meowhats.com/v1
MEOWHATS_API_TOKEN=seu_token_meowhats_aqui
MEOWHATS_INSTANCE_ID=sua_instancia_123
```

### 🔗 Configuração do Webhook do Meowhats na Dashboard:
No painel do Meowhats, adicione a URL de Webhook do seu servidor para receber respostas dos clientes em tempo real:
`http://SEU_IP_DA_VPS:3000/api/webhooks/whatsapp`

---

## 🔄 ATUALIZAÇÃO AUTOMÁTICA VIA GITHUB ACTIONS (CI/CD)

Sempre que você fizer alterações no código e enviar para o GitHub (`git push`), a VPS será atualizada **automaticamente** sem precisar acessar o terminal!

### Como ativar o GitHub Actions no repositório:
O GitHub bloqueia o envio direto de arquivos `.github/workflows` via apps sem permissão de workflow no OAuth. Por isso, salvamos o modelo em `deploy_workflow.yml.example`.

Para ativar no GitHub:
1. No seu repositório no GitHub, crie o arquivo `.github/workflows/deploy.yml` e cole o conteúdo do arquivo `deploy_workflow.yml.example`.
2. Vá em **Settings** > **Secrets and variables** > **Actions** do seu repositório GitHub.
3. Adicione as 3 variáveis secretas:
   - `VPS_HOST`: O endereço IP da sua VPS (ex: `191.252.100.50`)
   - `VPS_USER`: O usuário da VPS (ex: `ubuntu` ou `root`)
   - `VPS_SSH_KEY`: A sua chave SSH privada (conteúdo do arquivo `id_rsa`)
4. Pronto! O workflow `.github/workflows/deploy.yml` executará o `git pull`, `npm run build` e `pm2 restart optavia` automaticamente em cada `git push`!

---

## ⚡ OPÇÃO 1: INSTALAÇÃO RÁPIDA VIA DOCKER COMPOST (RECOMENDADO)

```bash
# 1. Clone o repositório na sua VPS
git clone https://github.com/seu-usuario/optavia.git
cd optavia

# 2. Copie e edite suas variáveis de ambiente
cp .env.example .env
nano .env # (cole sua GEMINI_API_KEY e MEOWHATS_API_TOKEN)

# 3. Suba a aplicação e o PostgreSQL
docker compose up -d --build
```
Acesse em: `http://SEU_IP_DA_VPS:3000`

---

## 🐧 OPÇÃO 2: INSTALAÇÃO AUTOMÁTICA EM VPS LINUX (UBUNTU / DEBIAN)

Execute o script autônomo `setup.sh`:

```bash
git clone https://github.com/seu-usuario/optavia.git
cd optavia
chmod +x setup.sh
./setup.sh
```

---

## 💻 OPÇÃO 3: INSTALAÇÃO EM VPS WINDOWS SERVER

No **PowerShell** como Administrador:
```powershell
git clone https://github.com/seu-usuario/optavia.git
cd optavia
Set-ExecutionPolicy Unrestricted -Scope Process
.\setup.ps1
```

---

## 🔐 SEGURANÇA & ISOLAMENTO DE ARQUIVOS (.ENV)

- **A API Key do Gemini e da Meowhats NUNCA são enviadas para o navegador ou expostas no frontend**.
- Toda chamada à IA e envio de mensagens passam pelo proxy seguro em `server.ts`.
- O arquivo `.env` fica armazenado **exclusivamente na raiz da VPS**.

---

## 🌐 CONFIGURAR NGINX + DOMÍNIO PRÓPRIO + SSL GRATUITO (HTTPS)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo nano /etc/nginx/sites-available/optavia
```

Adicione:
```nginx
server {
    server_name seu-dominio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative e gere o certificado HTTPS:
```bash
sudo ln -s /etc/nginx/sites-available/optavia /etc/nginx/sites-enabled/
sudo systemctl restart nginx
sudo certbot --nginx -d seu-dominio.com.br
```
