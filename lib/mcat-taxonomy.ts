import type { Section } from '@/types'

export const MCAT_SECTIONS: Section[] = [
  {
    id: 'bio-biochem',
    name: 'Biological & Biochemical Foundations of Living Systems',
    shortName: 'Bio/Biochem',
    subsections: [
      { id: 'biochemistry', sectionId: 'bio-biochem', name: 'Biochemistry' },
      { id: 'molecular-biology', sectionId: 'bio-biochem', name: 'Molecular Biology' },
      { id: 'genetics', sectionId: 'bio-biochem', name: 'Genetics' },
      { id: 'metabolism', sectionId: 'bio-biochem', name: 'Metabolism' },
      { id: 'cell-biology', sectionId: 'bio-biochem', name: 'Cell Biology' },
    ],
  },
  {
    id: 'chem-phys',
    name: 'Chemical & Physical Foundations of Biological Systems',
    shortName: 'Chem/Phys',
    subsections: [
      { id: 'general-chemistry', sectionId: 'chem-phys', name: 'General Chemistry' },
      { id: 'organic-chemistry', sectionId: 'chem-phys', name: 'Organic Chemistry' },
      { id: 'physics', sectionId: 'chem-phys', name: 'Physics' },
      { id: 'thermodynamics', sectionId: 'chem-phys', name: 'Thermodynamics' },
      { id: 'electrochemistry', sectionId: 'chem-phys', name: 'Electrochemistry' },
    ],
  },
  {
    id: 'psych-soc',
    name: 'Psychological, Social & Biological Foundations of Behavior',
    shortName: 'Psych/Soc',
    subsections: [
      { id: 'psychology', sectionId: 'psych-soc', name: 'Psychology' },
      { id: 'sociology', sectionId: 'psych-soc', name: 'Sociology' },
      { id: 'behavioral-science', sectionId: 'psych-soc', name: 'Behavioral Science' },
    ],
  },
  {
    id: 'cars',
    name: 'Critical Analysis and Reasoning Skills',
    shortName: 'CARS',
    subsections: [
      { id: 'passage-analysis', sectionId: 'cars', name: 'Passage Analysis' },
      { id: 'reading-comprehension', sectionId: 'cars', name: 'Reading Comprehension' },
      { id: 'logic-reasoning', sectionId: 'cars', name: 'Logic & Reasoning' },
    ],
  },
]

export function getSectionById(id: string) {
  return MCAT_SECTIONS.find((s) => s.id === id)
}

export function getSubsectionById(subsectionId: string) {
  for (const section of MCAT_SECTIONS) {
    const sub = section.subsections.find((s) => s.id === subsectionId)
    if (sub) return { section, subsection: sub }
  }
  return null
}
