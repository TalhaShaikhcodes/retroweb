import { useState, useEffect, useCallback } from 'react';

export interface UserGif {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export function useUserGifs(projectId: string | undefined) {
  const [userGifs, setUserGifs] = useState<UserGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGifs = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/gifs`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch GIFs');
      }

      setUserGifs(data.gifs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GIFs');
      console.error('Error fetching user GIFs:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const uploadGif = useCallback(
    async (file: File): Promise<UserGif | null> => {
      if (!projectId) return null;

      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/projects/${projectId}/gifs`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload GIF');
        }

        // Refresh the list
        await fetchGifs();

        return data.gif;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload GIF';
        setError(errorMessage);
        console.error('Error uploading GIF:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [projectId, fetchGifs]
  );

  const deleteGif = useCallback(
    async (gifId: string): Promise<boolean> => {
      if (!projectId) return false;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/projects/${projectId}/gifs/${gifId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete GIF');
        }

        // Refresh the list
        await fetchGifs();

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete GIF';
        setError(errorMessage);
        console.error('Error deleting GIF:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [projectId, fetchGifs]
  );

  // Fetch GIFs on mount and when projectId changes
  useEffect(() => {
    fetchGifs();
  }, [fetchGifs]);

  return {
    userGifs,
    loading,
    error,
    uploadGif,
    deleteGif,
    refresh: fetchGifs,
  };
}
