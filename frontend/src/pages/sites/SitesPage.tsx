import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Plus, List, Map as MapIcon, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sitesService } from '@/services';
import { Site } from '@/services/api/sitesApi';
import { Button, Input, Badge } from '@/components/ui';
import SiteMap from './components/SiteMap';
// import SiteList from './SiteList';
// import SiteForm from './SiteForm';

export default function SitesPage() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';

    // View State
    const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    // const [isFormOpen, setIsFormOpen] = useState(false);

    // Data Fetching
    const { data, isLoading } = useQuery({
        queryKey: ['sites', search],
        queryFn: () => sitesService.getAll({
            limit: 100, // Load more for map
            search: search || undefined
        }),
    });

    const sites = data?.data || [];

    // Handlers
    const handleSearch = (value: string) => {
        if (value) {
            setSearchParams({ ...Object.fromEntries(searchParams), search: value });
        } else {
            const newParams = Object.fromEntries(searchParams);
            delete newParams.search;
            setSearchParams(newParams);
        }
    };

    const handleSiteSelect = (site: Site) => {
        setSelectedSite(site);
        // Open sidebar details in future, for now just highlight
    };

    const handleCreate = () => {
        setSelectedSite(null);
        // setIsFormOpen(true);
    };

    return (
        <div className="h-[calc(100vh-theme(spacing.32))] flex flex-col gap-4">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin className="text-primary-600" />
                        {t('sites.title')}
                    </h1>
                    <p className="text-sm text-gray-500">{sites.length} {t('sites.subtitle')}</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={t('common.search')}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus size={16} />
                        <span className="hidden sm:inline">{t('common.add')}</span>
                    </Button>

                    {/* Mobile View Toggles (Hidden on Desktop if Split is enforced) */}
                    <div className="flex bg-gray-100 rounded-lg p-1 lg:hidden">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded ${viewMode === 'map' ? 'bg-white shadow' : ''}`}
                        >
                            <MapIcon size={16} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Main Content - Split View */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Left: List */}
                <div className={`
          flex-col w-full lg:w-1/3 min-w-[350px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
          ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}
        `}>
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Liste des sites</span>
                        <Button variant="ghost" size="sm" className="h-8 gap-2">
                            <Filter size={14} />
                            Filtres
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500">Chargement...</div>
                        ) : sites.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">Aucun site trouvé</div>
                        ) : (
                            sites.map((site: Site) => (
                                <div
                                    key={site.id}
                                    onClick={() => handleSiteSelect(site)}
                                    className={`
                    p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md
                    ${selectedSite?.id === site.id
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'
                                        }
                  `}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{site.name}</h3>
                                        {selectedSite?.id === site.id && <Badge variant="secondary" className="text-xs">Sélectionné</Badge>}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-start gap-1">
                                        <MapPin size={14} className="mt-0.5 shrink-0" />
                                        <span>{site.address || site.city || 'Sans adresse'}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Map */}
                <div className={`
          flex-1 rounded-xl overflow-hidden relative shadow-sm
          ${viewMode === 'list' ? 'hidden lg:block' : 'block'}
        `}>
                    <SiteMap
                        sites={sites}
                        selectedSite={selectedSite}
                        searchQuery={search}
                        onSiteSelect={handleSiteSelect}
                    />
                    {/* Floating Action Button for Mobile Map View could go here */}
                </div>
            </div>

            {/* Logic components (Modals usually) */}
            {/* <SiteForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} /> */}
        </div>
    );
}
