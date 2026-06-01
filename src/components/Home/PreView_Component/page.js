"use client";

import { useState } from "react";
import Project from "./project";
import Modal from "./Modal";

const PROJECTS = [
  {
    title: "Amica Black Edition",
    src: "/Png1_circular/Chair6a_Amica Black .png",
    color: "#EFE8D3",
    category: "Task Seating System",
  },
  {
    title: "Gladus Matte Grey",
    src: "/Png1_circular/Chair6b_Gladus Grey.png",
    color: "#E0E5EC",
    category: "Executive Workspace",
  },
  {
    title: "Delton Ergonomic Pro",
    src: "/Png1_circular/Chair7_Delton.png",
    color: "#DCE3EB",
    category: "Ergonomic Framework",
  },
  {
    title: "FitWell Premium Active",
    src: "/Png1_circular/chair9_FitWell.png",
    color: "#F0E4DC",
    category: "Active Sitting Tech",
  },
];

export default function PreViewComponent() {
  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <section id="features" className="w-full bg-[#F9F9FB] text-zinc-800 py-14 relative flex flex-col items-center justify-center overflow-hidden border-t border-zinc-200/40">
      <div className="max-w-[1600px] w-full mx-auto px-8 lg:px-20">
        {/* Gallery Title */}
        <div className="mb-10 border-b border-zinc-200 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-orange-500 font-extrabold tracking-widest text-xs uppercase mb-3 block">
              Curated Seating Systems
            </span>
            <h2 className="text-4xl lg:text-[52px] font-black tracking-tight text-zinc-900 leading-none">
              Best Collection.
            </h2>
          </div>
          <p className="text-zinc-500 text-sm lg:text-base max-w-sm font-light leading-relaxed">
            Hover to view detailed architectural profiles of our flagship ergonomic seating frameworks.
          </p>
        </div>

        {/* Project List */}
        <div className="w-full flex flex-col relative z-20">
          {PROJECTS.map((project, index) => (
            <Project
              index={index}
              title={project.title}
              category={project.category}
              src={project.src}
              setModal={setModal}
              key={index}
            />
          ))}
        </div>

        {/* Custom Interactive Hover Modal */}
        <Modal modal={modal} projects={PROJECTS} />
      </div>
    </section>
  );
}
