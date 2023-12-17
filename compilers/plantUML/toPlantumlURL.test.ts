import { toPlantUML } from "./toPlantumlURL.ts";
import { assertEquals } from "../../deps/testing.ts";

Deno.test("toPlantUML()", async (t) => {
  await t.step("png", () => {
    const uml = `
    @startuml
    class Car
    @enduml
  `;
    assertEquals(
      toPlantUML(uml, "png"),
      "https://www.plantuml.com/plantuml/png/ur800eVYaiIYajBS72uGBpadiRXOmJcn2CnpICrBWSW00000",
    );
  });
  await t.step("ascii", () => {
    const uml = `
    @startuml
    class Car
    @enduml
  `;
    assertEquals(
      toPlantUML(uml),
      "https://www.plantuml.com/plantuml/svg/ur800eVYaiIYajBS72uGBpadiRXOmJcn2CnpICrBWSW00000",
    );
  });

  await t.step("unicode", () => {
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
      toPlantUML(uml),
      "https://www.plantuml.com/plantuml/svg/RP7D2e9058NtFSLzWG5dAcZf8xGF5vQMjL3HMRHDeI9h6H944FG3ORIeHJ-FCsO-HgER36SppBttVETSkB9BLOVsL9FI2e3HrtJeMXPjMqDUDXrhe7Sev1eNY4GmmXXL9JvhOPAif_5zbeIHygyWICAWcXheflRhuI9r5b5OG94Y5OWe8g2gc5C8GRgTny-0_pAJzpXA9rS53DMsTRDWGB8fyoxCFp7lmVmDVyinDS5ozOoCNqiUyhajc3SIk3VoxDqnMHsIS5yMPBlAt3Q_mHS0",
    );
  });
});
