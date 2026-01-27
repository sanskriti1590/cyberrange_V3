// utilities/normalizeConsolePhases.js
export function normalizeConsolePhases(consoleData) {
  const phasesMap = {};

  // 1. Build phases from kill_chain_progress
  (consoleData.kill_chain_progress || []).forEach((p, idx) => {
    phasesMap[p.phase_id] = {
      id: p.phase_id,
      phase_name: p.phase_name,
      is_completed: p.is_completed,
      order: idx,
      flags: [],
    };
  });

  // 2. Attach flags to correct phase
  (consoleData.flag_data || []).forEach((flag) => {
    if (!phasesMap[flag.phase_id]) return;

    phasesMap[flag.phase_id].flags.push({
      id: flag.flag_id,
      flag_name: flag.flag_name,
      is_submitted: flag.is_submitted,
      points: flag.score || 0,
      hint_string: flag.hint_string,
    });
  });

  // 3. Return ordered array
  return Object.values(phasesMap).sort((a, b) => a.order - b.order);
}
