"use client";
import Link from "next/link";
import { useState } from "react";
import type { Professional } from "../data";

export function ProfessionalList({ items }: { items: Professional[] }) {
  const options = [
    "Todos",
    ...Array.from(new Set(items.map((p) => p.profession))),
  ];
  const [active, setActive] = useState("Todos");
  const filtered =
    active === "Todos" ? items : items.filter((p) => p.profession === active);
  return (
    <>
      <div className="filter-row" aria-label="Filtrar por especialidade">
        {options.map((option) => (
          <button
            className={active === option ? "active" : ""}
            key={option}
            onClick={() => setActive(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="professional-grid">
        {filtered.map((item) => (
          <article className="professional-card" key={item.slug}>
            <div className="portrait">
              <img
                src={item.image || "/logo-atos-med.jpeg"}
                alt={item.imageAlt}
                loading="lazy"
                style={{
                  objectPosition: item.imagePosition ?? "center",
                }}
              />
            </div>
            <div className="professional-info">
              <span>{item.profession}</span>
              <h2>{item.name}</h2>
              <p className="register">{item.register}</p>
              <div className="tag-list">
                {item.areas.slice(0, 3).map((area) => (
                  <em key={area}>{area}</em>
                ))}
              </div>
              <Link
                href={`/profissionais/${item.slug}`}
                className="card-action"
              >
                Ver perfil <b>→</b>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
