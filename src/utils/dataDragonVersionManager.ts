export class DataDragonVersionManager {
  private static readonly VERSION_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
  private static readonly CACHE_KEY = 'ddragon_version';
  private static readonly CACHE_DURATION = 5 * 60 * 1000;
  private static readonly FALLBACK_VERSION = '14.1.1';
  
  private static cachedVersion: string | null = null;
  private static cacheTimestamp: number = 0;

  static async getLatestVersion(forceRefresh: boolean = false): Promise<string> {
    if (!forceRefresh && this.cachedVersion && this.isCacheValid()) {
      return this.cachedVersion;
    }

    try {
      console.log('🔄 Buscando versão mais recente do Data Dragon...');
      const response = await fetch(this.VERSION_URL);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar versões: ${response.status}`);
      }

      const versions = await response.json() as string[];
      const latestVersion = versions[0];

      this.cachedVersion = latestVersion;
      this.cacheTimestamp = Date.now();

      console.log(`✅ Versão mais recente: ${latestVersion}`);
      return latestVersion;
    } catch (error) {
      console.error('❌ Erro ao buscar versão do Data Dragon:', error);
      
      const fallbackVersion = this.FALLBACK_VERSION;
      console.log(`🔄 Usando versão fallback: ${fallbackVersion}`);
      return fallbackVersion;
    }
  }

  public static async buildDataDragonUrl(path: string, forceRefresh: boolean = false): Promise<string> {
    const version = await this.getLatestVersion(forceRefresh);
    return `https://ddragon.leagueoflegends.com/cdn/${version}/${path}`;
  }

  public static async getChampionImageUrl(
    championKey: string, 
    skinNum: number = 0, 
    type: 'splash' | 'loading' = 'splash'
  ): Promise<string> {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/${type}/${championKey}_${skinNum}.jpg`;
  }

  public static async getItemIconUrl(itemId: string, forceRefresh: boolean = false): Promise<string> {
    const version = await this.getLatestVersion(forceRefresh);
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
  }

  public static async getChampionIconUrl(championKey: string, forceRefresh: boolean = false): Promise<string> {
    const version = await this.getLatestVersion(forceRefresh);
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championKey}.png`;
  }

  private static isCacheValid(): boolean {
    if (!this.cachedVersion || !this.cacheTimestamp) {
      return false;
    }

    const now = Date.now();
    const timeDiff = now - this.cacheTimestamp;
    return timeDiff < this.CACHE_DURATION;
  }

  public static clearCache(): void {
    this.cachedVersion = null;
    this.cacheTimestamp = 0;
  }

  public static getCacheInfo(): { version: string; lastUpdated: Date } | null {
    return this.cachedVersion ? {
      version: this.cachedVersion,
      lastUpdated: new Date(this.cacheTimestamp)
    } : null;
  }
}

export const getLatestDataDragonVersion = (forceRefresh?: boolean) => DataDragonVersionManager.getLatestVersion(forceRefresh);
export const buildDataDragonUrl = (path: string, forceRefresh?: boolean) => DataDragonVersionManager.buildDataDragonUrl(path, forceRefresh);
export const getChampionImageUrl = (championKey: string, skinNum?: number, type?: 'splash' | 'loading') => 
  DataDragonVersionManager.getChampionImageUrl(championKey, skinNum, type);
export const getItemIconUrl = (itemId: string, forceRefresh?: boolean) => DataDragonVersionManager.getItemIconUrl(itemId, forceRefresh);
export const getChampionIconUrl = (championKey: string, forceRefresh?: boolean) => DataDragonVersionManager.getChampionIconUrl(championKey, forceRefresh);