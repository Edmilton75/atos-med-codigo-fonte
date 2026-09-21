"use client";
import { useState } from "react";
import type { Professional } from "../data";

export function ScheduleList({ items }: { items: Professional[] }) {
  const options = [
    "Todos",
    ...Array.from(new Set(items.map((p) => p.profession))),
  ];
  const [active, setActive] = useState("Todos");
  const filtered =
    active === "Todos" ? items : items.filter((p) => p.profession === active);
  return (
    <>
      <div className="filter-row">
        {options.map((option) => (
          <button
            className={active === option ? "active" : ""}
            onClick={() => setActive(option)}
            key={option}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="schedule-grid">
        {filtered.map((item) => (
          <article className="schedule-card" key={item.slug}>
            <div>
              <span>{item.profession}</span>
              <h2>{item.name}</h2>
              <small>{item.modality.join(" • ")}</small>
            </div>
            {item.schedule.map((row) => (
              <p key={row.day}>
                <b>{row.day.replace("-feira", "")}</b>
                <span>{row.hours}</span>
              </p>
            ))}
          </article>
        ))}
      </div>
    </>
  );
}
