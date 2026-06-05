import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';
import useSandboxSearch from '../hooks/useSandboxSearch';

const typeConfig = {
  JOURNAL: {
    labelKey: 'typeJournal',
    icon: 'lucide:book-open',
    badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    iconClass: 'text-blue-400',
  },
  AUTHOR: {
    labelKey: 'typeAuthor',
    icon: 'lucide:user',
    badgeClass: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    iconClass: 'text-purple-400',
  },
  ARTICLE: {
    labelKey: 'typeArticle',
    icon: 'lucide:file-text',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    iconClass: 'text-emerald-400',
  },
  KEYWORD: {
    labelKey: 'typeKeyword',
    icon: 'lucide:hash',
    badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    iconClass: 'text-amber-400',
  },
  AREA: {
    labelKey: 'typeArea',
    icon: 'lucide:layers',
    badgeClass: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    iconClass: 'text-pink-400',
  },
  CATEGORY: {
    labelKey: 'typeCategory',
    icon: 'lucide:tag',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    iconClass: 'text-indigo-400',
  },
};

const defaultType = {
  labelKey: 'search',
  icon: 'lucide:help-circle',
  badgeClass: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  iconClass: 'text-gray-400',
};

export default function Sandbox() {
  const { t } = useTranslation();
  const {
    searchValue,
    setSearchValue,
    isLoading,
    searchResult,
    error,
    handleTagClick,
    handleSearchSubmit,
  } = useSandboxSearch();

  const tags = [
    'LLM',
    'RAG',
    'Transformer',
    'Computer Vision',
    'Reinforcement Learning',
  ];

  return (
    <section id="search-sandbox" className="py-24 relative bg-dark-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Glowing border container */}
        <div className="relative group p-[1px] rounded-3xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/10 to-cyan-500/20 hover:from-cyan-400/40 hover:via-indigo-500/30 hover:to-cyan-400/40 transition-all duration-500 shadow-2xl">

          {/* Card Body */}
          <div className="bg-[#0c101d] rounded-[23px] px-6 py-12 sm:p-16 text-center relative z-10 overflow-hidden">

            {/* Header label */}
            <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6">
              <Icon icon="lucide:sparkle" className="text-cyan-400 animate-spin-slow" />
              <span>{t('sandboxTitle')}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative mb-6">
              <div className="relative flex items-center">
                {/* Search Icon */}
                <div className="absolute left-5 text-gray-500 flex items-center pointer-events-none">
                  <Icon icon="lucide:search" className="text-xl" />
                </div>

                {/* Input Text Box */}
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t('sandboxPlaceholder')}
                  className="w-full pl-14 pr-32 py-4.5 rounded-full bg-white/5 border border-white/8 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80 focus:bg-white/8 text-sm sm:text-base transition-all duration-300 shadow-inner"
                />

                {/* Search Button inside input */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center space-x-2 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Icon icon="lucide:loader-2" className="animate-spin" />
                      <span>...</span>
                    </>
                  ) : (
                    <>
                      <span>{t('searchBtn')}</span>
                      <Icon icon="lucide:arrow-right" className="text-xs" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Tag suggestions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-4xl mx-auto">
              <span className="text-xs text-gray-500 font-bold tracking-wider uppercase flex items-center space-x-1">
                <Icon icon="lucide:sliders" className="text-[10px]" />
                <span>{t('tryNowLabel')}</span>
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-3.5 py-1.5 rounded-full bg-white/3 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-400 text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Mock Results */}
            {isLoading && (
              <div className="mt-10 max-w-2xl mx-auto p-6 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center space-x-3 text-sm text-gray-400 animate-pulse">
                <Icon icon="lucide:database" className="text-cyan-400 animate-bounce" />
                <span>Analyzing publications databases...</span>
              </div>
            )}

            {error && (
              <div className="mt-10 max-w-2xl mx-auto p-6 rounded-2xl bg-red-950/20 border border-red-800/20 text-left animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center space-x-3 text-red-400">
                  <Icon icon="lucide:alert-circle" className="text-xl shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-sm">API Error</h5>
                    <p className="text-xs text-gray-400 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {searchResult && (
              <div className="mt-10 max-w-2xl mx-auto p-6 rounded-2xl bg-[#0e1424]/80 backdrop-blur-md border border-white/10 text-left animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-green-400" />
                    <span className="text-xs font-bold tracking-wider uppercase text-green-400">
                      {t('realData')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {t('sourceLiveApi')}
                  </span>
                </div>
                <h4 className="font-display font-bold text-white text-base sm:text-lg mb-4">
                  {t('resultsFor')} "<span className="text-cyan-400">{searchResult.keyword}</span>"
                </h4>

                {searchResult.items && searchResult.items.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                    {searchResult.items.map((item, index) => {
                      const cfg = typeConfig[item.type] || defaultType;
                      return (
                        <div
                          key={item.id || index}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-cyan-500/30 transition-all duration-200 group"
                        >
                          <div className="flex items-center space-x-3.5 min-w-0">
                            <div className={`p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-cyan-500/20 transition-all duration-200 ${cfg.iconClass}`}>
                              <Icon icon={cfg.icon} className="text-lg" />
                            </div>
                            <span className="font-medium text-white text-sm sm:text-base truncate group-hover:text-cyan-300 transition-colors duration-200">
                              {item.name}
                            </span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${cfg.badgeClass}`}>
                            {t(cfg.labelKey)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Icon icon="lucide:search-x" className="text-4xl text-gray-500 mb-3" />
                    <p className="text-sm text-gray-400">{t('noResults')}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

