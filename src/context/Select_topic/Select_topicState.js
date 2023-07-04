import React from "react";

import Select_topicContext from "./Select_topicContext";

const Select_topicState = (props) => {
  const s1 = {
    name: "Avnish",
  };
  return (
    <Select_topicContext.Provider value={s1}>
      {props.children}
    </Select_topicContext.Provider>
  );
};

export default Select_topicState;
