import React, { useEffect, useState } from 'react';
import { sitesService } from '@/services';
import { Site } from '@/types';
import { Card } from '@/components/ui';

interface SiteListProps {
  sites: Site[];
  loading: boolean;
  error: string | null;
}

const SiteList: React.FC<SiteListProps> = ({ sites, loading, error }) => {
  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sites.length === 0 ? (
        <Card>Aucun site trouvé.</Card>
      ) : (
        sites.map(site => (
          <Card key={site.id} className="p-4">
            <h4 className="font-bold text-lg">{site.name}</h4>
            <div className="text-sm text-gray-500">{site.address}</div>
            {/* Ajoute d'autres infos si besoin */}
          </Card>
        ))
      )}
    </div>
  );
};

export default SiteList;
