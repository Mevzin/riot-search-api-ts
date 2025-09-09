# 🐉 Automação do Data Dragon

Este documento explica como usar o sistema de automação para obter links atualizados do Data Dragon da Riot Games.

## 📋 Índice

- [O que é o Data Dragon?](#o-que-é-o-data-dragon)
- [Por que automatizar?](#por-que-automatizar)
- [Como funciona](#como-funciona)
- [Instalação e Uso](#instalação-e-uso)
- [Exemplos Práticos](#exemplos-práticos)
- [API Reference](#api-reference)
- [Cache e Performance](#cache-e-performance)
- [Tratamento de Erros](#tratamento-de-erros)

## O que é o Data Dragon?

O Data Dragon é um conjunto de arquivos estáticos fornecidos pela Riot Games que contém:

- 🏆 **Dados de campeões** (nomes, habilidades, estatísticas)
- 🛡️ **Dados de itens** (descrições, estatísticas, preços)
- 🎨 **Imagens** (splash arts, ícones, loading screens)
- 🔮 **Dados de runas e feitiços de invocador**
- 🌍 **Dados localizados** em múltiplos idiomas

### URLs do Data Dragon

Todos os recursos seguem este padrão:
```
https://ddragon.leagueoflegends.com/cdn/{VERSION}/{PATH}
```

Exemplo:
```
https://ddragon.leagueoflegends.com/cdn/14.1.1/data/en_US/champion.json
```

## Por que automatizar?

### ❌ Problema

Sem automação, você precisa:
1. Verificar manualmente qual é a versão mais recente
2. Atualizar hardcoded URLs em seu código
3. Lembrar de fazer isso a cada patch (aproximadamente a cada 2 semanas)
4. Lidar com URLs quebradas quando esquecer de atualizar

### ✅ Solução

Com automação:
1. **Busca automática** da versão mais recente via API
2. **Cache inteligente** para evitar requisições desnecessárias
3. **URLs sempre atualizadas** sem intervenção manual
4. **Fallbacks** para garantir que sua aplicação continue funcionando

## Como funciona

### 1. Busca da Versão

O sistema consulta o endpoint oficial da Riot:
```
https://ddragon.leagueoflegends.com/api/versions.json
```

Este endpoint retorna um array com todas as versões disponíveis, sendo a primeira sempre a mais recente:
```json
["14.1.1", "14.1.0", "13.24.1", ...]
```

### 2. Cache Inteligente

- **Duração**: 1 hora por padrão
- **Armazenamento**: Memória + localStorage (se disponível)
- **Invalidação**: Automática ou manual

### 3. Construção de URLs

Com a versão obtida, o sistema constrói automaticamente as URLs corretas para qualquer recurso.

## Instalação e Uso

### Importação

```typescript
import { 
  DataDragonVersionManager,
  getLatestDataDragonVersion,
  buildDataDragonUrl,
  getChampionImageUrl,
  getItemIconUrl,
  getChampionIconUrl
} from './src/utils/dataDragonVersionManager';
```

### Uso Básico

```typescript
// Obter a versão mais recente
const version = await getLatestDataDragonVersion();
console.log(version); // "14.1.1"

// Construir URL para dados de campeões
const championsUrl = await buildDataDragonUrl('data/en_US/champion.json');
console.log(championsUrl);
// "https://ddragon.leagueoflegends.com/cdn/14.1.1/data/en_US/champion.json"

// Obter URL de splash art
const splashUrl = await getChampionImageUrl('Ahri', 1);
console.log(splashUrl);
// "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_1.jpg"
```

## Exemplos Práticos

### 1. Carregando Dados de Campeões

```typescript
async function carregarCampeoes() {
  try {
    // URL sempre atualizada
    const url = await buildDataDragonUrl('data/en_US/champion.json');
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Processar dados dos campeões
    const champions = Object.values(data.data);
    console.log(`${champions.length} campeões carregados`);
    
    return champions;
  } catch (error) {
    console.error('Erro ao carregar campeões:', error);
  }
}
```

### 2. Exibindo Imagens de Campeões

```typescript
async function criarCardCampeao(championKey: string) {
  try {
    // URLs sempre atualizadas
    const iconUrl = await getChampionIconUrl(championKey);
    const splashUrl = await getChampionImageUrl(championKey);
    
    return {
      icon: iconUrl,
      splash: splashUrl,
      // Outros dados...
    };
  } catch (error) {
    console.error('Erro ao criar card:', error);
  }
}
```

### 3. Sistema de Itens

```typescript
async function carregarItens() {
  try {
    const url = await buildDataDragonUrl('data/en_US/item.json');
    const response = await fetch(url);
    const data = await response.json();
    
    // Adicionar URLs de ícones
    const itemsWithIcons = await Promise.all(
      Object.entries(data.data).map(async ([id, item]) => ({
        id,
        ...item,
        iconUrl: await getItemIconUrl(id)
      }))
    );
    
    return itemsWithIcons;
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
  }
}
```

### 4. Múltiplos Idiomas

```typescript
async function carregarCampeoesMultiIdioma() {
  const idiomas = ['en_US', 'pt_BR', 'es_ES', 'fr_FR'];
  
  const dados = await Promise.all(
    idiomas.map(async (idioma) => {
      const url = await buildDataDragonUrl(`data/${idioma}/champion.json`);
      const response = await fetch(url);
      return {
        idioma,
        dados: await response.json()
      };
    })
  );
  
  return dados;
}
```

## API Reference

### DataDragonVersionManager

#### `getLatestVersion(forceRefresh?: boolean): Promise<string>`

Obtém a versão mais recente do Data Dragon.

**Parâmetros:**
- `forceRefresh` (opcional): Ignora o cache e busca uma nova versão

**Retorna:** Promise com a versão mais recente (ex: "14.1.1")

#### `buildDataDragonUrl(path: string, forceRefresh?: boolean): Promise<string>`

Constrói uma URL completa para um recurso do Data Dragon.

**Parâmetros:**
- `path`: Caminho do recurso (ex: "data/en_US/champion.json")
- `forceRefresh` (opcional): Força busca de nova versão

**Retorna:** Promise com a URL completa

#### `getChampionImageUrl(championKey: string, skinNum?: number, type?: 'splash' | 'loading'): Promise<string>`

Obtém URL para imagens de campeões.

**Parâmetros:**
- `championKey`: Chave do campeão (ex: "Ahri")
- `skinNum` (opcional): Número da skin (padrão: 0)
- `type` (opcional): Tipo de imagem (padrão: "splash")

#### `getItemIconUrl(itemId: string, forceRefresh?: boolean): Promise<string>`

Obtém URL para ícones de itens.

#### `getChampionIconUrl(championKey: string, forceRefresh?: boolean): Promise<string>`

Obtém URL para ícones de campeões.

#### `clearCache(): void`

Limpa o cache da versão.

#### `getCacheInfo(): DataDragonVersion | null`

Obtém informações sobre o cache atual.

### Funções Utilitárias

```typescript
// Versões simplificadas para uso direto
const getLatestDataDragonVersion: () => Promise<string>
const buildDataDragonUrl: (path: string) => Promise<string>
const getChampionImageUrl: (championKey: string, skinNum?: number, type?: 'splash' | 'loading') => Promise<string>
const getItemIconUrl: (itemId: string) => Promise<string>
const getChampionIconUrl: (championKey: string) => Promise<string>
```

## Cache e Performance

### Configuração do Cache

- **Duração padrão**: 1 hora
- **Armazenamento**: Memória + localStorage
- **Chave**: `ddragon_version`

### Estratégia de Cache

1. **Primeira busca**: Consulta a API da Riot
2. **Buscas subsequentes**: Usa cache se válido
3. **Cache expirado**: Nova consulta à API
4. **Erro na API**: Usa cache como fallback

### Otimizações

```typescript
// ✅ Bom: Reutiliza a versão em cache
const url1 = await buildDataDragonUrl('data/en_US/champion.json');
const url2 = await buildDataDragonUrl('data/en_US/item.json');

// ❌ Evitar: Força refresh desnecessário
const url3 = await buildDataDragonUrl('data/en_US/champion.json', true);
const url4 = await buildDataDragonUrl('data/en_US/item.json', true);
```

## Tratamento de Erros

### Estratégia de Fallback

1. **Cache válido**: Usa versão em cache
2. **Cache expirado**: Tenta buscar nova versão
3. **Erro na API**: Usa cache como fallback
4. **Sem cache**: Usa versão hardcoded ("14.1.1")

### Exemplo de Tratamento

```typescript
async function exemploComTratamento() {
  try {
    const version = await getLatestDataDragonVersion();
    console.log(`Usando versão: ${version}`);
  } catch (error) {
    console.error('Erro ao obter versão:', error);
    
    // O sistema já fornece fallbacks automáticos
    // Sua aplicação continuará funcionando
  }
}
```

### Logs e Debugging

O sistema fornece logs detalhados:

```
✅ Versão obtida com sucesso: 14.1.1
⚠️  Usando versão em cache como fallback: 14.1.1
⚠️  Usando versão fallback: 14.1.1
❌ Erro ao obter versão do Data Dragon: [detalhes]
```

## 🚀 Próximos Passos

1. **Execute o exemplo**: `npm run example:datadragon`
2. **Integre em sua aplicação**: Importe as funções necessárias
3. **Configure cache**: Ajuste duração se necessário
4. **Monitore logs**: Verifique se está funcionando corretamente

## 📚 Recursos Adicionais

- [Documentação oficial do Data Dragon](https://riot-api-libraries.readthedocs.io/en/latest/ddragon.html)
- [Portal do desenvolvedor da Riot](https://developer.riotgames.com/)
- [Community Dragon (alternativa)](https://cdn.communitydragon.org/)

---

**💡 Dica**: O Data Dragon é atualizado alguns dias após cada patch. Se você notar que uma nova versão do jogo foi lançada mas o Data Dragon ainda não foi atualizado, isso é normal e esperado.