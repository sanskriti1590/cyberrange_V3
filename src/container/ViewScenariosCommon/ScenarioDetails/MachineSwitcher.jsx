import { MenuItem, Select } from "@mui/material";
import { switchMachineVersion2 } from "../../../APIConfig/version2Scenario";

export default function MachineSwitcher({ machines = [], activeScenarioId, onSwitch }) {
  if (!machines.length) {
    return <span style={{ color: "#9CA3AF", fontSize: 12 }}>No machines available</span>;
  }

  const handleChange = async (e) => {
    await switchMachineVersion2({
      active_scenario_id: activeScenarioId,
      instance_id: e.target.value,
    });
    onSwitch?.();
  };

  return (
    <Select size="small" onChange={handleChange} value="">
      {machines.map((m) => (
        <MenuItem key={m.id} value={m.id}>
          {m.name} ({m.team})
        </MenuItem>
      ))}
    </Select>
  );
}
