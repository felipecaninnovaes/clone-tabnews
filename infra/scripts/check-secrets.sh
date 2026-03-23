#!/bin/bash

# Cores para o terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verificando segredos no repositório...${NC}\n"

# Padrões de busca (Regex)
PATTERNS=(
    # Chaves API comuns (formato específico)
    "AIza[0-9A-Za-z\\-_]{35}"                    # Google API Key
    "AKIA[0-9A-Z]{16}"                           # AWS Access Key
    "[0-9a-zA-Z]{32}\.apps\.googleusercontent"   # Google OAuth
    "sk-[a-zA-Z0-9]{48}"                         # OpenAI API Key
    "ghp_[0-9a-zA-Z]{36}"                        # GitHub Personal Access Token
    "gho_[0-9a-zA-Z]{36}"                        # GitHub OAuth Token
    
    # Padrões genéricos - atribuição direta (const, let, var, export)
    "(const|let|var|export)\s+\w*[Aa]pi[Kk]ey\w*\s*=\s*['\"][^'\"]{8,}['\"]"
    "(const|let|var|export)\s+\w*[Ss]ecret\w*\s*=\s*['\"][^'\"]{8,}['\"]"
    "(const|let|var|export)\s+\w*[Pp]assword\w*\s*=\s*['\"][^'\"]{8,}['\"]"
    "(const|let|var|export)\s+\w*[Tt]oken\w*\s*=\s*['\"][^'\"]{8,}['\"]"
    
    # Padrões em objetos e atribuições
    "['\"]?api[_-]?key['\"]?\s*[:=]\s*['\"][^'\"]{8,}['\"]"
    "['\"]?secret[_-]?key['\"]?\s*[:=]\s*['\"][^'\"]{8,}['\"]"
    "['\"]?access[_-]?token['\"]?\s*[:=]\s*['\"][^'\"]{8,}['\"]"
    "['\"]?auth[_-]?token['\"]?\s*[:=]\s*['\"][^'\"]{8,}['\"]"
    
    # Private Keys
    "-----BEGIN.*PRIVATE KEY-----"
    "-----BEGIN RSA PRIVATE KEY-----"
    "-----BEGIN OPENSSH PRIVATE KEY-----"
)

# Arquivos e diretórios a ignorar
IGNORE_PATHS=(
    "node_modules"
    ".git"
    "*.log"
    "*.lock"
    "package-lock.json"
    "yarn.lock"
    "dist"
    "build"
    ".next"
    "coverage"
)

# Arquivos .env permitidos (não serão verificados)
ALLOWED_ENV_FILES=(
    ".env.development"
    ".env.example"
    ".env.test"
)

# Monta o comando find com exclusões
FIND_CMD="find . -type f"
for IGNORE in "${IGNORE_PATHS[@]}"; do
    if [[ "$IGNORE" == *"*"* ]]; then
        FIND_CMD="$FIND_CMD ! -name '$IGNORE'"
    else
        FIND_CMD="$FIND_CMD ! -path '*/$IGNORE/*' ! -name '$IGNORE'"
    fi
done

EXIT_CODE=0
ISSUES_FOUND=0

# Função para verificar se um arquivo deve ser pulado
should_skip_file() {
    local file=$1
    
    # Pula arquivos .env permitidos
    for ALLOWED in "${ALLOWED_ENV_FILES[@]}"; do
        if [[ "$file" == *"$ALLOWED" ]]; then
            return 0
        fi
    done
    
    # Pula o próprio script de verificação e o pre-commit
    if [[ "$file" == *"check-secrets.sh" ]] || [[ "$file" == *"pre-commit" ]]; then
        return 0
    fi
    
    return 1
}

# Executa a busca
FILES=$(eval $FIND_CMD)

for FILE in $FILES; do
    # Remove o "./" do início
    FILE=${FILE#./}
    
    # Pula arquivos binários
    if ! file "$FILE" | grep -q "text"; then
        continue
    fi
    
    # Verifica se deve pular este arquivo
    if should_skip_file "$FILE"; then
        continue
    fi
    
    # Verifica cada padrão
    for PATTERN in "${PATTERNS[@]}"; do
        if grep -qiE "$PATTERN" "$FILE" 2>/dev/null; then
            echo -e "${RED}[ALERTA]${NC} Possível segredo detectado em: ${YELLOW}$FILE${NC}"
            
            # Mostra as linhas problemáticas (mascarando parcialmente o valor)
            grep -niE "$PATTERN" "$FILE" | while IFS= read -r line; do
                echo -e "  ${BLUE}↳${NC} $line"
            done
            echo ""
            
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
            EXIT_CODE=1
            break
        fi
    done
done

# Verifica arquivos .env não permitidos
echo -e "\n${BLUE}🔒 Verificando arquivos .env sensíveis...${NC}"
ENV_FILES=$(find . -type f -name "*.env*" ! -path "*/node_modules/*")

for FILE in $ENV_FILES; do
    FILE=${FILE#./}
    
    # Verifica se está na lista de permitidos
    ALLOWED=false
    for ALLOWED_FILE in "${ALLOWED_ENV_FILES[@]}"; do
        if [[ "$FILE" == "$ALLOWED_FILE" ]]; then
            ALLOWED=true
            break
        fi
    done
    
    if [[ "$ALLOWED" == false ]]; then
        echo -e "${RED}[ALERTA]${NC} Arquivo .env sensível encontrado: ${YELLOW}$FILE${NC}"
        echo -e "  ${BLUE}↳${NC} Este arquivo não deve estar no repositório!"
        echo ""
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        EXIT_CODE=1
    fi
done

# Resultado final
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Nenhum problema encontrado!${NC}"
else
    echo -e "${RED}✗ Foram encontrados $ISSUES_FOUND problema(s)${NC}"
    echo -e "  Revise os arquivos acima antes de fazer push."
fi
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

exit $EXIT_CODE
