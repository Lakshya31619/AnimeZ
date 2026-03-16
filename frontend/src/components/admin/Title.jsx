import React from "react";

function Title({ text1, text2 }) {
  return (
    <h1 className="font-semibold text-2xl md:text-3xl text-white">
      {text1}{" "}
      <span className="underline text-primary decoration-2 underline-offset-4">
        {text2}
      </span>
    </h1>
  );
}

export default Title;