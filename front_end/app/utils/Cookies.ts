const isClient = typeof window !== 'undefined';

const getAuthKey = (): string | undefined => {
  if (isClient) {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth='))
      ?.split('=')[1];
  }
  return undefined;
};

const deleteAuthKey = (): void => {
  if (isClient) {
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
};

export const authKey: string | undefined = getAuthKey();
export { deleteAuthKey };
