import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import BalanceIcon from "@mui/icons-material/Balance";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { AuthQuery } from "@/graphql/queries";

import { useLazyQuery } from "@apollo/client";
import { MouseEventHandler, useEffect } from "react";

const App = () => {
  const [auth, { data, loading, error }] = useLazyQuery(AuthQuery);

  // https://dev.to/mremanuel/add-the-new-google-sign-in-to-your-react-app-p6m
  useEffect(() => {
    console.log("useEffect");

    const initializeGsi = () => {
      console.log("initializeGsi");
      google.accounts.id.initialize({
        client_id:
          "531981676179-g8co36oq94vm580uqi1ntj42gidjcl2m.apps.googleusercontent.com",
        callback: (response) => {
          console.log("response", response);
          console.log("cred", response.credential);
        },
      });

      const parent = document.getElementById("google_btn");
      if (parent) {
        google.accounts.id.renderButton(parent, { type: "standard" });
      }
      google.accounts.id.prompt();
    };

    if (!document.getElementById("google-client-script")) {
      console.log("Load Google Client Script");
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = initializeGsi;
      script.async = true;
      script.id = "google-client-script";
      document.querySelector("body")?.appendChild(script);
    }
  }, []);

  const theme = createTheme();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  const onButtonClick: MouseEventHandler = async (event) => {
    console.log("onButtonClick", event);
    const r = await auth({
      variables: { username: "admin", password: "admin" },
    });
    console.log("auth =", r, data);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div id="google_btn"></div>
        <AppBar position="relative">
          <Toolbar>
            <BalanceIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Reactサンプルアプリケーション
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} sx={{ mt: 2 }}>
          <Typography
            component="h1"
            variant="h4"
            align="left"
            color="text.primary"
            gutterBottom
          >
            顧客リスト
          </Typography>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5]}
            checkboxSelection
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={onButtonClick}>
            一括更新
          </Button>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
