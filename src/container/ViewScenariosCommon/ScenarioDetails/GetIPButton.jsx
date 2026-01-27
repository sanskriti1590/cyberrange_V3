import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";

import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import DnsIcon from "@mui/icons-material/Dns";

import { toast } from "react-toastify";

const GetIPButton = ({ activeScenarioId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ips, setIps] = useState([]);
  const [copied, setCopied] = useState(null);

  const fetchIPs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/corporate/get-ip/${activeScenarioId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const json = await res.json();

      if (!json?.ips?.length) {
        toast.warning("No IPs available yet");
        setIps([]);
      } else {
        setIps(json.ips);
      }
    } catch (err) {
      toast.error("Failed to fetch IP addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchIPs();
  };

  const handleCopy = (ip) => {
    navigator.clipboard.writeText(ip);
    setCopied(ip);
    toast.success(`Copied ${ip}`);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<NetworkCheckIcon />}
        onClick={handleOpen}
        sx={{ borderColor: "#22D3EE", color: "#22D3EE", fontWeight: 700 }}
      >
        Get IP
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DnsIcon color="primary" />
          Network IP Addresses
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <Stack alignItems="center" py={6}>
              <CircularProgress />
              <Typography mt={2} fontSize={13} color="text.secondary">
                Fetching IPs…
              </Typography>
            </Stack>
          ) : ips.length ? (
            <Stack spacing={1.5} mt={1}>
              {ips.map((item, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1.5}
                  border="1px solid #1e293b"
                  borderRadius={1}
                >
                  <Stack>
                    <Typography fontSize={13} fontWeight={600}>
                      {item.hostname || "Machine"}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        fontSize={12}
                        sx={{
                          fontFamily: "monospace",
                          bgcolor: "#020617",
                          px: 1,
                          py: 0.3,
                          borderRadius: 0.5,
                        }}
                      >
                        {item.ip}
                      </Typography>

                      {item.type && (
                        <Chip size="small" label={item.type} />
                      )}
                    </Stack>
                  </Stack>

                  <IconButton onClick={() => handleCopy(item.ip)}>
                    {copied === item.ip ? (
                      <CheckIcon color="success" />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography
              textAlign="center"
              color="text.secondary"
              fontSize={13}
              py={4}
            >
              No IP addresses available
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GetIPButton;
