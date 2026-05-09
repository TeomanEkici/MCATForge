import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sections = [
  { id: 'bio-biochem', name: 'Biological & Biochemical Foundations of Living Systems', short_name: 'Bio/Biochem', order_index: 1 },
  { id: 'chem-phys', name: 'Chemical & Physical Foundations of Biological Systems', short_name: 'Chem/Phys', order_index: 2 },
  { id: 'psych-soc', name: 'Psychological, Social & Biological Foundations of Behavior', short_name: 'Psych/Soc', order_index: 3 },
  { id: 'cars', name: 'Critical Analysis and Reasoning Skills', short_name: 'CARS', order_index: 4 },
]

const subsections = [
  { id: 'biochemistry', section_id: 'bio-biochem', name: 'Biochemistry', order_index: 1 },
  { id: 'molecular-biology', section_id: 'bio-biochem', name: 'Molecular Biology', order_index: 2 },
  { id: 'genetics', section_id: 'bio-biochem', name: 'Genetics', order_index: 3 },
  { id: 'metabolism', section_id: 'bio-biochem', name: 'Metabolism', order_index: 4 },
  { id: 'cell-biology', section_id: 'bio-biochem', name: 'Cell Biology', order_index: 5 },
  { id: 'general-chemistry', section_id: 'chem-phys', name: 'General Chemistry', order_index: 1 },
  { id: 'organic-chemistry', section_id: 'chem-phys', name: 'Organic Chemistry', order_index: 2 },
  { id: 'physics', section_id: 'chem-phys', name: 'Physics', order_index: 3 },
  { id: 'thermodynamics', section_id: 'chem-phys', name: 'Thermodynamics', order_index: 4 },
  { id: 'electrochemistry', section_id: 'chem-phys', name: 'Electrochemistry', order_index: 5 },
  { id: 'psychology', section_id: 'psych-soc', name: 'Psychology', order_index: 1 },
  { id: 'sociology', section_id: 'psych-soc', name: 'Sociology', order_index: 2 },
  { id: 'behavioral-science', section_id: 'psych-soc', name: 'Behavioral Science', order_index: 3 },
  { id: 'passage-analysis', section_id: 'cars', name: 'Passage Analysis', order_index: 1 },
  { id: 'reading-comprehension', section_id: 'cars', name: 'Reading Comprehension', order_index: 2 },
  { id: 'logic-reasoning', section_id: 'cars', name: 'Logic & Reasoning', order_index: 3 },
]

const flashcards = [
  // Biochemistry
  { section: 'bio-biochem', subsection: 'biochemistry', front: 'What is the role of ATP synthase?', back: 'ATP synthase (Complex V) uses the proton gradient across the inner mitochondrial membrane to phosphorylate ADP to ATP via chemiosmosis.' },
  { section: 'bio-biochem', subsection: 'biochemistry', front: 'What are the essential amino acids?', back: 'Histidine, Isoleucine, Leucine, Lysine, Methionine, Phenylalanine, Threonine, Tryptophan, Valine (His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val).' },
  { section: 'bio-biochem', subsection: 'biochemistry', front: 'What is Km in enzyme kinetics?', back: 'Km (Michaelis constant) is the substrate concentration at which reaction velocity is half of Vmax. Low Km = high affinity for substrate.' },
  { section: 'bio-biochem', subsection: 'biochemistry', front: 'Describe competitive inhibition.', back: 'Competitive inhibitor resembles substrate and binds active site. Increases apparent Km, does NOT change Vmax. Overcome by increasing substrate concentration.' },
  { section: 'bio-biochem', subsection: 'biochemistry', front: 'What is the Henderson-Hasselbalch equation?', back: 'pH = pKa + log([A⁻]/[HA]). Used to calculate pH of a buffer solution.' },

  // Molecular Biology
  { section: 'bio-biochem', subsection: 'molecular-biology', front: 'What is the central dogma of molecular biology?', back: 'DNA → (transcription) → mRNA → (translation) → Protein. Information flows from DNA to RNA to protein.' },
  { section: 'bio-biochem', subsection: 'molecular-biology', front: 'What is the role of RNA polymerase?', back: 'RNA polymerase synthesizes RNA from a DNA template during transcription, reading 3\'→5\' and synthesizing 5\'→3\'.' },
  { section: 'bio-biochem', subsection: 'molecular-biology', front: 'What are Okazaki fragments?', back: 'Short DNA fragments synthesized on the lagging strand during DNA replication. Each fragment begins with an RNA primer and is later joined by DNA ligase.' },
  { section: 'bio-biochem', subsection: 'molecular-biology', front: 'What is alternative splicing?', back: 'Process where different exons of a pre-mRNA are joined in different combinations, allowing one gene to encode multiple proteins.' },

  // Genetics
  { section: 'bio-biochem', subsection: 'genetics', front: 'What is Hardy-Weinberg equilibrium?', back: 'p² + 2pq + q² = 1 and p + q = 1. Conditions: no mutation, no migration, random mating, large population, no natural selection.' },
  { section: 'bio-biochem', subsection: 'genetics', front: 'What is incomplete dominance?', back: 'Neither allele is completely dominant; heterozygotes show intermediate phenotype (e.g., red × white → pink flowers).' },
  { section: 'bio-biochem', subsection: 'genetics', front: 'What is X-linked recessive inheritance?', back: 'Males (XY) express trait with one copy; females (XX) need two copies. Carrier mothers pass to 50% of sons. Examples: hemophilia, color blindness.' },

  // Metabolism
  { section: 'bio-biochem', subsection: 'metabolism', front: 'What is the net ATP yield of glycolysis?', back: '2 net ATP (4 produced - 2 invested), 2 NADH, 2 pyruvate per glucose molecule. Occurs in cytoplasm.' },
  { section: 'bio-biochem', subsection: 'metabolism', front: 'What is beta-oxidation?', back: 'Process of breaking down fatty acids into acetyl-CoA in the mitochondria. Each cycle removes 2 carbons and yields 1 FADH₂, 1 NADH, 1 acetyl-CoA.' },
  { section: 'bio-biochem', subsection: 'metabolism', front: 'What is the role of insulin vs glucagon?', back: 'Insulin (fed state): promotes glucose uptake, glycogen synthesis, lipogenesis. Glucagon (fasting): promotes glycogenolysis, gluconeogenesis, lipolysis.' },

  // Cell Biology
  { section: 'bio-biochem', subsection: 'cell-biology', front: 'What is the function of the smooth ER?', back: 'Smooth ER synthesizes lipids and steroids, detoxifies drugs/alcohol, and stores calcium ions (especially in muscle cells).' },
  { section: 'bio-biochem', subsection: 'cell-biology', front: 'Describe the fluid mosaic model.', back: 'Cell membrane = phospholipid bilayer with embedded proteins. Phospholipids have hydrophilic heads (facing out) and hydrophobic tails (facing in). Proteins can be integral or peripheral.' },

  // General Chemistry
  { section: 'chem-phys', subsection: 'general-chemistry', front: 'What is Le Chatelier\'s Principle?', back: 'When a system at equilibrium is disturbed, it shifts to counteract the disturbance and re-establish equilibrium (concentration, pressure, temperature).' },
  { section: 'chem-phys', subsection: 'general-chemistry', front: 'What is the difference between strong and weak acids?', back: 'Strong acids fully dissociate in water (HCl, H₂SO₄, HNO₃). Weak acids partially dissociate and have an equilibrium constant Ka.' },
  { section: 'chem-phys', subsection: 'general-chemistry', front: 'What is Hess\'s Law?', back: 'The enthalpy change for a reaction is the same whether it occurs in one step or multiple steps. ΔH is a state function.' },

  // Organic Chemistry
  { section: 'chem-phys', subsection: 'organic-chemistry', front: 'What are the products of an SN2 reaction?', back: 'SN2 produces complete inversion of configuration (Walden inversion). One-step mechanism; backside attack by nucleophile. Favored with primary substrates and strong nucleophiles.' },
  { section: 'chem-phys', subsection: 'organic-chemistry', front: 'What distinguishes aldehydes from ketones?', back: 'Aldehydes have the carbonyl at the end of a carbon chain (C=O with H). Ketones have carbonyl between two carbons. Both are oxidizable but aldehydes are more reactive.' },
  { section: 'chem-phys', subsection: 'organic-chemistry', front: 'What is aromaticity? (Hückel\'s rule)', back: 'Aromatic compounds are cyclic, planar, fully conjugated, and have 4n+2 π electrons (n=0,1,2...). More stable than expected due to resonance.' },

  // Physics
  { section: 'chem-phys', subsection: 'physics', front: 'State Newton\'s Second Law.', back: 'F = ma. Net force equals mass times acceleration. Force is in Newtons (N), mass in kg, acceleration in m/s².' },
  { section: 'chem-phys', subsection: 'physics', front: 'What is Bernoulli\'s equation?', back: 'P + ½ρv² + ρgh = constant. As fluid velocity increases, pressure decreases. Conservation of energy applied to fluid flow.' },
  { section: 'chem-phys', subsection: 'physics', front: 'What is the equation for electric field strength?', back: 'E = kQ/r² (point charge). Direction is away from positive charges, toward negative charges. Units: N/C or V/m.' },

  // Thermodynamics
  { section: 'chem-phys', subsection: 'thermodynamics', front: 'What does ΔG < 0 indicate?', back: 'ΔG < 0 indicates a spontaneous reaction (exergonic). ΔG = ΔH - TΔS. At equilibrium ΔG = 0.' },
  { section: 'chem-phys', subsection: 'thermodynamics', front: 'State the First Law of Thermodynamics.', back: 'Energy cannot be created or destroyed, only converted. ΔU = Q - W. Internal energy change = heat added minus work done by system.' },

  // Electrochemistry
  { section: 'chem-phys', subsection: 'electrochemistry', front: 'What is the Nernst equation?', back: 'E = E° - (RT/nF)ln(Q). At 25°C: E = E° - (0.0592/n)log(Q). Used to calculate cell potential under non-standard conditions.' },
  { section: 'chem-phys', subsection: 'electrochemistry', front: 'In a galvanic cell, where does oxidation occur?', back: 'Oxidation occurs at the anode (negative electrode in galvanic cells). Reduction occurs at cathode. Mnemonic: AN OX, RED CAT.' },

  // Psychology
  { section: 'psych-soc', subsection: 'psychology', front: 'What is operant conditioning?', back: 'Learning through consequences. Positive reinforcement (add reward), negative reinforcement (remove aversive), positive punishment (add aversive), negative punishment (remove reward). Associated with Skinner.' },
  { section: 'psych-soc', subsection: 'psychology', front: 'What are Freud\'s levels of consciousness?', back: 'Conscious (current awareness), Preconscious (accessible memories), Unconscious (repressed material). Defense mechanisms protect ego from unconscious anxiety.' },
  { section: 'psych-soc', subsection: 'psychology', front: 'What is Maslow\'s hierarchy of needs?', back: 'From base to top: Physiological → Safety → Love/Belonging → Esteem → Self-actualization. Lower needs must be met before higher ones are pursued.' },

  // Sociology
  { section: 'psych-soc', subsection: 'sociology', front: 'What is social stratification?', back: 'Hierarchical arrangement of society into layers based on wealth, power, and prestige. Systems include caste (ascribed) and class (achieved).' },
  { section: 'psych-soc', subsection: 'sociology', front: 'What is the difference between prejudice and discrimination?', back: 'Prejudice = negative attitude toward a group. Discrimination = negative behavior/action against a group. One can be prejudiced without discriminating (and vice versa).' },

  // Behavioral Science
  { section: 'psych-soc', subsection: 'behavioral-science', front: 'What is cognitive dissonance?', back: 'Discomfort experienced when holding two conflicting beliefs or when behavior conflicts with beliefs. Reduced by changing beliefs, behavior, or rationalizing the inconsistency.' },
  { section: 'psych-soc', subsection: 'behavioral-science', front: 'What is the difference between classical and operant conditioning?', back: 'Classical conditioning (Pavlov): pairing neutral stimulus with unconditioned stimulus to elicit conditioned response. Operant conditioning (Skinner): behavior modified by consequences.' },

  // CARS
  { section: 'cars', subsection: 'passage-analysis', front: 'What is the main purpose of annotating a CARS passage?', back: 'Annotations help identify: main idea of each paragraph, author\'s tone/attitude, structure of argument, key transitions, and evidence vs. claims.' },
  { section: 'cars', subsection: 'reading-comprehension', front: 'What question types appear in CARS?', back: 'Main Idea, Detail, Inference, Reasoning (strengthen/weaken argument), Application (apply author\'s view to new scenario), Vocabulary in Context.' },
  { section: 'cars', subsection: 'logic-reasoning', front: 'What is an ad hominem fallacy?', back: 'Attacking the person making an argument rather than the argument itself. "You can\'t trust their climate data because they\'re funded by solar companies."' },
]

const quizQuestions = [
  {
    prompt: 'Which enzyme catalyzes the rate-limiting step of glycolysis?',
    options: ['Hexokinase', 'Phosphofructokinase-1', 'Pyruvate kinase', 'Aldolase'],
    correct_answer: 1,
    explanation: 'Phosphofructokinase-1 (PFK-1) catalyzes the conversion of fructose-6-phosphate to fructose-1,6-bisphosphate and is the key regulatory step in glycolysis.',
    subsection: 'metabolism',
    difficulty: 'medium',
  },
  {
    prompt: 'A patient has metabolic acidosis with low bicarbonate. Which compensatory response would you expect?',
    options: ['Decreased respiratory rate', 'Increased respiratory rate (hyperventilation)', 'Increased renal H+ excretion only', 'Decreased renal bicarbonate reabsorption'],
    correct_answer: 1,
    explanation: 'In metabolic acidosis, the respiratory system compensates by hyperventilating to blow off CO₂, which reduces H₂CO₃ and raises blood pH toward normal.',
    subsection: 'biochemistry',
    difficulty: 'hard',
  },
  {
    prompt: 'Which of the following best describes the effect of a noncompetitive inhibitor?',
    options: ['Increases Km, Vmax unchanged', 'Decreases Km, Vmax unchanged', 'Km unchanged, Vmax decreases', 'Increases both Km and Vmax'],
    correct_answer: 2,
    explanation: 'Noncompetitive inhibitors bind an allosteric site regardless of substrate presence. This reduces Vmax but does not affect Km (substrate affinity is unchanged).',
    subsection: 'biochemistry',
    difficulty: 'medium',
  },
  {
    prompt: 'An SN2 reaction will proceed fastest with which substrate?',
    options: ['Tertiary alkyl halide', 'Secondary alkyl halide', 'Primary alkyl halide', 'Neopentyl halide'],
    correct_answer: 2,
    explanation: 'SN2 reactions favor primary substrates due to less steric hindrance, allowing backside nucleophilic attack. Tertiary substrates undergo SN1 instead.',
    subsection: 'organic-chemistry',
    difficulty: 'easy',
  },
  {
    prompt: 'In a galvanic cell, what is the sign of ΔG° for a spontaneous reaction?',
    options: ['ΔG° > 0', 'ΔG° = 0', 'ΔG° < 0', 'ΔG° is undefined'],
    correct_answer: 2,
    explanation: 'For a spontaneous galvanic cell reaction, ΔG° < 0. The relationship is ΔG° = -nFE°cell, where n is moles of electrons and E°cell > 0 for spontaneous reactions.',
    subsection: 'electrochemistry',
    difficulty: 'easy',
  },
]

async function seed() {
  console.log('Seeding database...')

  const { error: secErr } = await supabase.from('sections').upsert(sections)
  if (secErr) { console.error('Sections error:', secErr); return }
  console.log('✓ Sections seeded')

  const { error: subErr } = await supabase.from('subsections').upsert(subsections)
  if (subErr) { console.error('Subsections error:', subErr); return }
  console.log('✓ Subsections seeded')

  const { error: fcErr } = await supabase.from('flashcards').upsert(
    flashcards.map(f => ({ ...f, id: undefined }))
  )
  if (fcErr) { console.error('Flashcards error:', fcErr); return }
  console.log(`✓ ${flashcards.length} flashcards seeded`)

  const { error: qqErr } = await supabase.from('quiz_questions').upsert(
    quizQuestions.map(q => ({ ...q, options: q.options }))
  )
  if (qqErr) { console.error('Quiz questions error:', qqErr); return }
  console.log(`✓ ${quizQuestions.length} quiz questions seeded`)

  console.log('\nSeeding complete!')
}

seed().catch(console.error)
