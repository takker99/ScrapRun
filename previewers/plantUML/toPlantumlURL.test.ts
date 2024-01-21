import { toPlantUML } from "./toPlantumlURL.ts";
import { assertEquals } from "../../deps/testing.ts";

Deno.test("toPlantUML()", async (t) => {
  await t.step("png", async () => {
    const uml = `
    @startuml
    class Car
    @enduml
  `;
    assertEquals(
      await toPlantUML(uml, "png"),
      "https://www.plantuml.com/plantuml/png/~1U9pYKb1GK70eBaaiAYdDpU42yP9p4ekB5PmJYy0yXzIy58WC0000__y30Fz02xO0",
    );
  });
  await t.step("ascii", async () => {
    const uml = `
    @startuml
    class Car
    @enduml
  `;
    assertEquals(
      await toPlantUML(uml),
      "https://www.plantuml.com/plantuml/svg/~1U9pYKb1GK70eBaaiAYdDpU42yP9p4ekB5PmJYy0yXzIy58WC0000__y30Fz02xO0",
    );
  });

  await t.step("unicode", async () => {
    const uml = `@startgantt
  hide footbox
  Project starts 2021-11-30
  [12月上旬] starts 2021-12-01 and ends 2021-12-10
  [12月中旬] starts 2021-12-11 and ends 2021-12-20
  [12月下旬] starts 2021-12-21 and ends 2021-12-31
  -- 行事 --
  [冬至] happens 2021-12-22
  [クリスマス] starts 2021-12-24 and ends 2021-12-25
  [仕事納め] happens 2021-12-28
  [大晦日] happens 2021-12-31
 @endgantt`;
    assertEquals(
      await toPlantUML(uml),
      "https://www.plantuml.com/plantuml/svg/~1U9noA2v9B2f9JymhAU5IKCZ8J4bLIClFBqdAh-1IK0WeoizAJIvH0AifLZ0oC3BKDJJKDJRWKb28DZHwDgVZoOwkPzFNnAAgCD8rC5H8p4jHICrBGOWP8kjQYqsN8HPTHiYwkh7fCiAYozYGIq51LrVXnSAU9xkw5NHrGOOyRLlpedrph496Oa51QXwI0KOWsSTDwnyththSjFDnyxp7JJinhJ71uZXJaCudkwS-sTNzV4lluwP6BAPRWErUilpPp6NFfY_5L01ogqDgNWeu3W00003__mC095kAVm00",
    );
  });
});
