import type { ComponentType } from "react";

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  lessons: number;
  completedLessons: number;
  xp: number;
}

export interface UserProgress {
  totalXp: number;
  level: number;
  streak: number;
  completedTopics: number;
  totalTopics: number;
}

import { GiDna2, GiBubblingFlask } from "react-icons/gi";
import { FaDna, FaVirus } from "react-icons/fa";
import { TbMicroscope, TbDna } from "react-icons/tb";

// Map from topicId → icon component.
// Used by pages that receive topic data from the API (JSON), since JSON cannot
// carry React component references — only the local data.ts array has them.
export const topicIconMap: Record<string, ComponentType<{ className?: string }>> = {
  dna: FaDna,
  rna: TbMicroscope,
  crispr: TbDna,
  cells: FaVirus,
  genetics: GiDna2,
  proteins: GiBubblingFlask,
};


export const topics: Topic[] = [
  {
    id: "dna",
    title: "DNA & Replication",
    description: "Explore the double helix and how DNA copies itself",
    icon: FaDna,
    color: "from-emerald-500 to-teal-600",
    lessons: 8,
    completedLessons: 5,
    xp: 250,
  },
  {
    id: "rna",
    title: "RNA & Transcription",
    description: "Learn how RNA carries genetic messages",
    icon: TbMicroscope,
    color: "from-cyan-500 to-blue-600",
    lessons: 6,
    completedLessons: 3,
    xp: 150,
  },
  {
    id: "crispr",
    title: "CRISPR Gene Editing",
    description: "Discover the revolutionary gene editing tool",
    icon: TbDna,
    color: "from-violet-500 to-purple-600",
    lessons: 10,
    completedLessons: 0,
    xp: 0,
  },
  {
    id: "cells",
    title: "Cell Biology",
    description: "Understand the building blocks of life",
    icon: FaVirus,
    color: "from-green-500 to-lime-600",
    lessons: 7,
    completedLessons: 7,
    xp: 350,
  },
  {
    id: "genetics",
    title: "Genetics & Heredity",
    description: "Explore how traits are passed down",
    icon: GiDna2,
    color: "from-rose-500 to-pink-600",
    lessons: 9,
    completedLessons: 2,
    xp: 100,
  },
  {
    id: "proteins",
    title: "Proteins & Enzymes",
    description: "The molecular machines of life",
    icon: GiBubblingFlask,
    color: "from-amber-500 to-orange-600",
    lessons: 6,
    completedLessons: 0,
    xp: 0,
  },
];

export const userProgress: UserProgress = {
  totalXp: 850,
  level: 7,
  streak: 12,
  completedTopics: 1,
  totalTopics: 6,
};

export const leaderboard = [
  { name: "BioNerd42", xp: 2340, avatar: null },
  { name: "GeneQueen", xp: 1890, avatar: null },
  { name: "CRISPRKid", xp: 1650, avatar: null },
  { name: "You", xp: 850, avatar: null, isUser: true },
  { name: "DNADude", xp: 720, avatar: null },
];

export const quizQuestions = [
  {
    question: "What is the shape of a DNA molecule?",
    options: ["Single helix", "Double helix", "Triple helix", "Flat ribbon"],
    correct: 1,
    explanation: "DNA has a double helix structure, discovered by Watson and Crick in 1953.",
  },
  {
    question: "Which base pairs with Adenine in DNA?",
    options: ["Guanine", "Cytosine", "Thymine", "Uracil"],
    correct: 2,
    explanation: "In DNA, Adenine (A) always pairs with Thymine (T) through two hydrogen bonds.",
  },
  {
    question: "What does CRISPR stand for?",
    options: [
      "Clustered Regularly Interspaced Short Palindromic Repeats",
      "Cellular Repair In Specific Palindromic Regions",
      "Coded RNA Interference System for Protein Regulation",
      "Chromosomal Recombination In Specific Protein Regions",
    ],
    correct: 0,
    explanation: "CRISPR stands for Clustered Regularly Interspaced Short Palindromic Repeats.",
  },
  {
    question: "Which organelle is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
    correct: 2,
    explanation: "Mitochondria produce ATP, the energy currency of the cell.",
  },
];

export const lessonContent = {
  dna: {
    title: "Introduction to DNA",
    sections: [
      {
        heading: "What is DNA?",
        content: "DNA (Deoxyribonucleic Acid) is the molecule that carries the genetic instructions for life. Found in nearly every cell of every living organism, DNA is like a biological blueprint that determines everything from your eye color to your susceptibility to certain diseases.",
      },
      {
        heading: "The Double Helix",
        content: "DNA has a unique twisted ladder shape called a double helix. The sides of the ladder are made of sugar (deoxyribose) and phosphate molecules, while the rungs are made of pairs of nitrogen-containing bases: Adenine (A) pairs with Thymine (T), and Guanine (G) pairs with Cytosine (C).",
      },
      {
        heading: "DNA Replication",
        content: "Before a cell divides, it must copy its DNA so each new cell gets a complete set of instructions. The double helix unwinds, and each strand serves as a template for building a new complementary strand. This process is called semi-conservative replication.",
      },
    ],
  },
  rna: {
    title: "RNA & Transcription",
    sections: [
      {
        heading: "What is RNA?",
        content: "RNA (Ribonucleic Acid) is a single-stranded molecule that plays crucial roles in converting the genetic information stored in DNA into proteins. Unlike DNA, RNA uses the base Uracil (U) instead of Thymine (T).",
      },
      {
        heading: "Types of RNA",
        content: "There are three main types: mRNA (messenger RNA) carries genetic code from DNA to ribosomes, tRNA (transfer RNA) brings amino acids to the ribosome, and rRNA (ribosomal RNA) forms part of the ribosome structure.",
      },
    ],
  },
};
