import { debounce } from "./debounce.ts";
import { assertEquals } from "./deps/testing.ts";
import { delay } from "https://deno.land/std@0.212.0/async/mod.ts";

Deno.test("debounce()", async (t) => {
  await t.step("resolves with result", async () => {
    const mockFunc = (arg: number) => Promise.resolve(arg * 2);
    const debouncedFunc = debounce(mockFunc);

    assertEquals(await debouncedFunc(5), { type: "resolve", value: 10 });
  });

  await t.step("resolves with result", async () => {
    const mockFunc = () => {
      throw new Error("Something went wrong");
    };
    const debouncedFunc = debounce(mockFunc);

    assertEquals(await debouncedFunc(), {
      type: "reject",
      value: new Error("Something went wrong"),
    });
  });

  await t.step("cancels previous job", async () => {
    const mockFunc = (arg: number) => delay(100).then(() => arg * 2);
    const debouncedFunc = debounce(mockFunc);

    const [result1, result2, result3, result4] = [
      debouncedFunc(1),
      debouncedFunc(2),
      debouncedFunc(3),
      debouncedFunc(4),
    ];
    await delay(100);

    assertEquals(await result1, { type: "resolve", value: 2 });
    assertEquals(await result2, { type: "cancel" });
    assertEquals(await result3, { type: "cancel" });
    assertEquals(await result4, { type: "resolve", value: 8 });
    assertEquals(await debouncedFunc(5), { type: "resolve", value: 10 });
  });
});
