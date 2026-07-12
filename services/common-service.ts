
export const triggerRevalidation = async (paths: string[], token: string) => {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paths }),
    });
  } catch (error) {
    // Revalidation failing shouldn't break the mutation UX — just log it
    console.error('Revalidation failed:', error);
  }
};