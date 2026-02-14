import { useEffect, useState } from "react";
import { getConsoleForWhiteVersion2 } from "../../../../APIConfig/version2Scenario";
import IndividualPlayer from "../../WhiteTeamConsole/IndividualPlayer";

const ConsolePlayerWrapper = ({
  scenarioId,
  participantId,
}) => {
  const [data, setData] = useState({});
  const [reload, setReload] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    fetchData();
  }, [participantId]);

  const fetchData = async () => {
    setLoad(true);
    try {
      const res = await getConsoleForWhiteVersion2(
        scenarioId,
        participantId
      );

      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed loading console");
    } finally {
      setLoad(false);
    }
  };

  return (
    <IndividualPlayer
      data={data}
      reload={reload}
      setReload={setReload}
      load={load}
      gameType={data?.scenario_type}
    />
  );
};

export default ConsolePlayerWrapper;
