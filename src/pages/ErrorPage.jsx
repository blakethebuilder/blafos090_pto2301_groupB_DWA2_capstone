import { useRouteError } from "react-router-dom";
import { Button } from "@mui/material";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Button
        onClick={() => {
          window.history.back();
        }}
      >Go Back</Button>
    </div>
  );
}