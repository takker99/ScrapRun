export const findLatestCache = async (
  request: Request,
  options?: CacheQueryOptions,
): Promise<Response | undefined> => {
  const cacheNames = await globalThis.caches.keys();

  for (const date of cacheNames.sort().reverse()) {
    const cache = await caches.open(date);
    const res = await cache.match(request, options);
    if (res) return res;
  }
};

export const saveCache = async (request: Request, response: Response) => {
  const cacheNames = (await globalThis.caches.keys()).filter((name) =>
    name.startsWith("api")
  );
  const cacheName = cacheNames.sort().reverse().at(0);
  if (!cacheName) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
};
