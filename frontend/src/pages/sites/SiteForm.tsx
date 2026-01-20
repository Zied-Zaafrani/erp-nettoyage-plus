import React, { useState } from 'react';
import { sitesService } from '@/services';
import { Site, CreateSiteDto } from '@/types';
import { Button, Input } from '@/components/ui';

interface SiteFormProps {
  onCreated?: (site: Site) => void;
}

const SiteForm: React.FC<SiteFormProps> = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dto: CreateSiteDto = {
        name,
        address,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        clientId: '', // TODO: Add client selection
      };
      const site = await sitesService.create(dto);
      setName('');
      setAddress('');
      setLatitude('');
      setLongitude('');
      if (onCreated) onCreated(site);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4 max-w-md">
      <Input
        label="Nom du site"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <Input
        label="Adresse"
        value={address}
        onChange={e => setAddress(e.target.value)}
        required
      />
      <Input
        label="Latitude (optionnel)"
        value={latitude}
        onChange={e => setLatitude(e.target.value)}
        type="number"
        step="any"
      />
      <Input
        label="Longitude (optionnel)"
        value={longitude}
        onChange={e => setLongitude(e.target.value)}
        type="number"
        step="any"
      />
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" isLoading={loading}>
        Ajouter le site
      </Button>
    </form>
  );
};

export default SiteForm;
