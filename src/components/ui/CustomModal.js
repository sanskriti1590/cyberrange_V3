import React from "react";
import {Backdrop, Fade, Modal, Stack} from "@mui/material";
import {Icons} from "../icons";

const CustomModal = (props) => {

  const {
    open,
    onClose,
    children,
    hideCloseIcon = false,
    disableExternalClick = false,
    sx,
  } = props;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 728,
    backgroundColor: "#16181F",
    borderRadius: 3,
    p: 4,
    ...sx,
  };

  return (
    <Modal
      open={open}
      onClose={disableExternalClick === false ? onClose : null}
      closeAfterTransition
      slots={{backdrop: Backdrop}}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Stack sx={style}>
          {hideCloseIcon === false && (
            <Stack alignItems='end'>
              <Icons.crossCircle
                style={{
                  fontSize: "32px",
                  color: "#9C9EA3",
                  cursor: "pointer",
                }}
                onClick={onClose}
              />
            </Stack>
          )}
          <Stack>
            {children}
          </Stack>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
