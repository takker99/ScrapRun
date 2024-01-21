export type Result<T, E = unknown> = { type: "resolve"; value: T } | {
  type: "reject";
  value: E;
} | { type: "cancel" };
export const debounce = <Args extends unknown[], T>(
  func: (...args: Args) => Promise<T>,
): (...args: Args) => Promise<Result<T>> => {
  let job: [
    Args,
    (value: Result<T> | PromiseLike<Result<T>>) => void,
  ] | undefined;
  let running: Promise<void> | undefined;

  const run = async () => {
    while (job) {
      const [args, resolve] = job;
      job = undefined;
      try {
        const result = await func(...args);
        resolve({ type: "resolve", value: result });
      } catch (value) {
        resolve({ type: "reject", value });
      }
    }
    running = undefined;
  };
  return (...args) => {
    const { resolve, promise } = Promise.withResolvers<Result<T>>();
    job?.[1]?.({ type: "cancel" });
    job = [args, resolve];
    running ??= run();
    return promise;
  };
};
