# 💬 Chat App - Aplicativo de Mensagens em Tempo Real

Um aplicativo de chat moderno e completo construído com React, Convex e Daily.co para chamadas de vídeo.

![Chat App Preview](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=center)

## ✨ Funcionalidades

- 💬 **Mensagens em tempo real** - Chat instantâneo com atualizações ao vivo
- 👥 **Chats diretos e em grupo** - Converse individualmente ou crie grupos
- 📷 **Compartilhamento de imagens** - Envie e visualize imagens
- 🎥 **Chamadas de vídeo** - Videochamadas integradas com Daily.co
- 🔐 **Autenticação segura** - Sistema de login com Convex Auth
- 📱 **Interface responsiva** - Funciona perfeitamente em desktop e mobile
- 🌙 **Design moderno** - Interface escura e elegante

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (banco de dados reativo)
- **Autenticação**: Convex Auth
- **Videochamadas**: Daily.co
- **Deploy**: Vercel
- **Ícones**: Font Awesome

## 📦 Como Executar Localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/chat-app.git
cd chat-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Convex
```bash
# Instale a CLI do Convex globalmente (se ainda não tiver)
npm install -g convex

# Faça login no Convex
npx convex login

# Configure o projeto
npx convex dev
```

### 4. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
# Essas variáveis serão geradas automaticamente pelo Convex
CONVEX_DEPLOYMENT=dev:seu-deployment
VITE_CONVEX_URL=https://seu-deployment.convex.cloud

# Opcional: Para videochamadas com Daily.co
DAILY_API_KEY=sua_chave_daily_co
```

### 5. Execute o projeto
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🌐 Deploy na Vercel

### Deploy Automático
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente na Vercel:
   - `VITE_CONVEX_URL`: URL do seu deployment Convex
   - `DAILY_API_KEY` (opcional): Chave da API do Daily.co

### Deploy Manual
```bash
# Instale a CLI da Vercel
npm install -g vercel

# Faça o deploy
vercel
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── App.tsx              # Componente principal
│   ├── ChatApp.tsx          # Interface principal do chat
│   ├── VideoCallModal.tsx   # Modal de videochamadas
│   ├── UserList.tsx         # Lista de usuários
│   ├── CreateGroupModal.tsx # Modal de criação de grupos
│   ├── SignInForm.tsx       # Formulário de login
│   └── SignOutButton.tsx    # Botão de logout
├── convex/
│   ├── schema.ts           # Schema do banco de dados
│   ├── auth.ts             # Configuração de autenticação
│   ├── chats.ts            # Funções de chat
│   ├── messages.ts         # Funções de mensagens
│   ├── users.ts            # Funções de usuários
│   └── dailyRooms.ts       # Funções de videochamadas
├── public/
└── package.json
```

## 🔧 Configuração Adicional

### Daily.co (Videochamadas)
1. Crie uma conta em [Daily.co](https://daily.co)
2. Obtenha sua API key
3. Adicione a variável `DAILY_API_KEY` no seu `.env.local`

### Convex Auth
O projeto já vem configurado com autenticação por email/senha. Para adicionar outros provedores (Google, GitHub, etc.), consulte a [documentação do Convex Auth](https://docs.convex.dev/auth).

## 🎯 Como Usar

1. **Faça login** com email e senha
2. **Crie usuários de teste** clicando no ícone de usuário na barra lateral
3. **Inicie uma conversa** clicando no ícone de "+" e selecionando um usuário
4. **Crie grupos** clicando no ícone de usuários
5. **Envie mensagens** de texto ou imagens
6. **Inicie videochamadas** clicando nos ícones de telefone ou vídeo

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. Commit suas mudanças:
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
4. Push para a branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique as [Issues](https://github.com/seu-usuario/chat-app/issues) existentes
2. Crie uma nova issue se necessário
3. Consulte a [documentação do Convex](https://docs.convex.dev)

---

Feito com ❤️ usando React, Convex e Daily.co
