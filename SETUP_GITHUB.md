# 🚀 Como Configurar o Repositório no GitHub

Siga estes passos para colocar seu código no GitHub:

## 📋 Pré-requisitos

1. **Conta no GitHub**: Crie uma conta em [github.com](https://github.com) se ainda não tiver
2. **Git instalado**: Verifique se o Git está instalado no seu computador:
   ```bash
   git --version
   ```

## 🔧 Passo a Passo

### 1. Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"New"** ou **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Configure o repositório:
   - **Repository name**: `chat-app-realtime` (ou o nome que preferir)
   - **Description**: `Aplicativo de chat em tempo real com React, Convex e Daily.co`
   - **Visibility**: Public (recomendado) ou Private
   - **NÃO** marque "Add a README file" (já temos um)
   - **NÃO** marque "Add .gitignore" (já temos um)
   - **NÃO** marque "Choose a license" (já temos um)
5. Clique em **"Create repository"**

### 2. Configurar Git Local

No terminal, navegue até a pasta do projeto e execute:

```bash
# Inicializar repositório Git
git init

# Configurar seu nome e email (se ainda não configurou)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "🎉 Primeiro commit: Chat App completo com React, Convex e Daily.co"

# Renomear branch para main (padrão atual do GitHub)
git branch -M main

# Conectar com o repositório remoto (substitua pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/chat-app-realtime.git

# Fazer push do código
git push -u origin main
```

### 3. Verificar Upload

1. Volte para a página do seu repositório no GitHub
2. Atualize a página (F5)
3. Você deve ver todos os arquivos do projeto

## 🌐 Configurar Deploy na Vercel

### Opção 1: Deploy Automático via GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**
4. Selecione seu repositório `chat-app-realtime`
5. Configure as variáveis de ambiente:
   - `VITE_CONVEX_URL`: Sua URL do Convex
   - `DAILY_API_KEY`: Sua chave do Daily.co (opcional)
6. Clique em **"Deploy"**

### Opção 2: Deploy Manual

```bash
# Instalar CLI da Vercel
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Seguir as instruções no terminal
```

## 🔐 Configurar Variáveis de Ambiente

### No Convex Dashboard
1. Acesse [dashboard.convex.dev](https://dashboard.convex.dev)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione `DAILY_API_KEY` se for usar videochamadas

### Na Vercel
1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - `VITE_CONVEX_URL`
   - `DAILY_API_KEY` (opcional)

## 📝 Comandos Úteis do Git

```bash
# Ver status dos arquivos
git status

# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push

# Puxar mudanças do GitHub
git pull

# Ver histórico de commits
git log --oneline

# Criar nova branch
git checkout -b nome-da-branch

# Trocar de branch
git checkout main
```

## 🆘 Problemas Comuns

### Erro de autenticação
Se der erro de autenticação, configure um token:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Selecione scopes: `repo`, `workflow`
4. Use o token como senha

### Arquivo muito grande
Se algum arquivo for muito grande:
```bash
# Ver arquivos grandes
git ls-files | xargs ls -la | sort -k5 -rn | head

# Remover arquivo do Git (mas manter local)
git rm --cached arquivo-grande.ext
echo "arquivo-grande.ext" >> .gitignore
git add .gitignore
git commit -m "Remove arquivo grande"
```

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado com sucesso
- [ ] README.md aparece na página do repositório
- [ ] Deploy configurado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Aplicativo funcionando online

---

🎉 **Parabéns!** Seu chat app está agora no GitHub e pronto para ser compartilhado!
