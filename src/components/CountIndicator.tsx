import { client } from "apis";
import { TodoType } from "App";
import { useJuunzziQuery } from "hooks/useJuunzziQuery";
import React from "react";

const CountIndicator = ({ completedCount }: { completedCount: number }) => {
  const data = useJuunzziQuery(
    "/todos",
    async () => await client.get<TodoType[]>("/todos"),
    "CountIndicator"
  );

  return <div>Total completed todo : {completedCount}</div>;
};

export default CountIndicator;
