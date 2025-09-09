/**
 * Exemplo de uso do Data Dragon Version Manager
 * Demonstra como automatizar a busca por links atualizados do Data Dragon
 */

import { 
  DataDragonVersionManager,
  getLatestDataDragonVersion,
  buildDataDragonUrl,
  getChampionImageUrl,
  getItemIconUrl,
  getChampionIconUrl
} from '../src/utils/dataDragonVersionManager';

/**
 * Exemplo básico: Obtendo a versão mais recente
 */
async function exemploVersaoAtual() {
  console.log('=== Exemplo: Versão Atual do Data Dragon ===');
  
  try {
    const versao = await getLatestDataDragonVersion();
    console.log(`Versão mais recente: ${versao}`);
    
    // Informações do cache
    const cacheInfo = DataDragonVersionManager.getCacheInfo();
    if (cacheInfo) {
      console.log(`Cache atualizado em: ${cacheInfo.lastUpdated}`);
    }
  } catch (error) {
    console.error('Erro ao obter versão:', error);
  }
}

/**
 * Exemplo: Construindo URLs para dados de campeões
 */
async function exemploDadosCampeoes() {
  console.log('\n=== Exemplo: URLs de Dados de Campeões ===');
  
  try {
    // URL para dados de todos os campeões
    const urlCampeoes = await buildDataDragonUrl('data/en_US/champion.json');
    console.log(`Dados de campeões: ${urlCampeoes}`);
    
    // URL para dados específicos de um campeão
    const urlAhri = await buildDataDragonUrl('data/en_US/champion/Ahri.json');
    console.log(`Dados da Ahri: ${urlAhri}`);
    
    // URL para dados de itens
    const urlItens = await buildDataDragonUrl('data/en_US/item.json');
    console.log(`Dados de itens: ${urlItens}`);
  } catch (error) {
    console.error('Erro ao construir URLs:', error);
  }
}

/**
 * Exemplo: URLs de imagens de campeões
 */
async function exemploImagensCampeoes() {
  console.log('\n=== Exemplo: URLs de Imagens de Campeões ===');
  
  try {
    // Splash art padrão da Ahri
    const splashAhri = await getChampionImageUrl('Ahri');
    console.log(`Splash da Ahri (skin padrão): ${splashAhri}`);
    
    // Splash art de uma skin específica
    const splashAhriSkin = await getChampionImageUrl('Ahri', 1);
    console.log(`Splash da Ahri (skin 1): ${splashAhriSkin}`);
    
    // Loading screen
    const loadingAhri = await getChampionImageUrl('Ahri', 0, 'loading');
    console.log(`Loading da Ahri: ${loadingAhri}`);
    
    // Ícone do campeão
    const iconeAhri = await getChampionIconUrl('Ahri');
    console.log(`Ícone da Ahri: ${iconeAhri}`);
  } catch (error) {
    console.error('Erro ao obter URLs de imagens:', error);
  }
}

/**
 * Exemplo: URLs de ícones de itens
 */
async function exemploIconesItens() {
  console.log('\n=== Exemplo: URLs de Ícones de Itens ===');
  
  try {
    // Alguns itens populares
    const itens = [
      { id: '1001', nome: 'Botas de Velocidade' },
      { id: '3031', nome: 'Gume do Infinito' },
      { id: '3089', nome: 'Capuz da Morte de Rabadon' },
      { id: '3742', nome: 'Cutelo Negro' }
    ];
    
    for (const item of itens) {
      const urlIcone = await getItemIconUrl(item.id);
      console.log(`${item.nome} (${item.id}): ${urlIcone}`);
    }
  } catch (error) {
    console.error('Erro ao obter URLs de itens:', error);
  }
}

/**
 * Exemplo: Fazendo requisições para obter dados reais
 */
async function exemploRequisicoesDados() {
  console.log('\n=== Exemplo: Fazendo Requisições para Dados Reais ===');
  
  try {
    // Obtém URL para dados de campeões
    const urlCampeoes = await buildDataDragonUrl('data/en_US/champion.json');
    
    // Faz a requisição
    const response = await fetch(urlCampeoes);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const dados: any = await response.json();
    const campeoes = Object.keys(dados.data);
    
    console.log(`Total de campeões encontrados: ${campeoes.length}`);
    console.log('Primeiros 10 campeões:', campeoes.slice(0, 10).join(', '));
    
    // Exemplo com um campeão específico
    const ahri = dados.data.Ahri;
    if (ahri) {
      console.log(`\nInformações da Ahri:`);
      console.log(`- Nome: ${ahri.name}`);
      console.log(`- Título: ${ahri.title}`);
      console.log(`- Tags: ${ahri.tags.join(', ')}`);
      
      // URL do ícone usando os dados obtidos
      const iconeUrl = await getChampionIconUrl(ahri.key);
      console.log(`- Ícone: ${iconeUrl}`);
    }
  } catch (error) {
    console.error('Erro ao fazer requisições:', error);
  }
}

/**
 * Exemplo: Gerenciamento de cache
 */
async function exemploGerenciamentoCache() {
  console.log('\n=== Exemplo: Gerenciamento de Cache ===');
  
  try {
    // Primeira busca (vai buscar da API)
    console.log('Primeira busca (da API):');
    const versao1 = await getLatestDataDragonVersion();
    console.log(`Versão: ${versao1}`);
    
    // Segunda busca (vai usar cache)
    console.log('\nSegunda busca (do cache):');
    const versao2 = await getLatestDataDragonVersion();
    console.log(`Versão: ${versao2}`);
    
    // Informações do cache
    const cacheInfo = DataDragonVersionManager.getCacheInfo();
    if (cacheInfo) {
      console.log(`Cache criado em: ${cacheInfo.lastUpdated}`);
    }
    
    // Forçar refresh
    console.log('\nForçando refresh (ignorando cache):');
    const versao3 = await getLatestDataDragonVersion(true);
    console.log(`Versão: ${versao3}`);
    
    // Limpar cache
    console.log('\nLimpando cache...');
    DataDragonVersionManager.clearCache();
    console.log('Cache limpo!');
  } catch (error) {
    console.error('Erro no gerenciamento de cache:', error);
  }
}

/**
 * Função principal que executa todos os exemplos
 */
async function executarExemplos() {
  console.log('🎮 Exemplos de Uso do Data Dragon Version Manager\n');
  
  await exemploVersaoAtual();
  await exemploDadosCampeoes();
  await exemploImagensCampeoes();
  await exemploIconesItens();
  await exemploRequisicoesDados();
  await exemploGerenciamentoCache();
  
  console.log('\n✅ Todos os exemplos executados!');
}

// Executa os exemplos se este arquivo for executado diretamente
if (require.main === module) {
  executarExemplos().catch(console.error);
}

export {
  exemploVersaoAtual,
  exemploDadosCampeoes,
  exemploImagensCampeoes,
  exemploIconesItens,
  exemploRequisicoesDados,
  exemploGerenciamentoCache,
  executarExemplos
};