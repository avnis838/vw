import React from "react";

const Dialogbox = () => {
  return (
    <>
      <Dialog onClose={handleClose} open={openDialog}>
        <DialogTitle> Confirm Dialog </DialogTitle>
        <h3 style={{ marginTop: "-10px", padding: "5px 10px" }}>
          Are you sure to delete the item?{" "}
        </h3>
        <br></br>
        <div style={divStyle}>
          <button style={confirmButtonStyle} onClick={handleClose}>
            Confirm
          </button>
          <button style={confirmButtonStyle} onClick={handleClose}>
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default Dialogbox;
