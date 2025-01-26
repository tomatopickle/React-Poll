import { useState } from "react";
import "./App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Item from "@mui/material/Box";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import { Link } from "react-router";

function App() {
  let [pollCode,setPollCode] = useState("");

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Poll
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          marginBlock: "3%",
          paddingInline: "10%",
        }}
      >
        <Item sx={{ width: "50%" }}>
          <div style={{ margin: "3%" }}>
            <Card sx={{ margin: "15px", height: "50vh" }}>
              <CardContent>
                <Typography variant="h4">Create a Poll</Typography>
                <AddIcon
                  sx={{ margin: "auto", display: "block", fontSize: 100 }}
                  color="primary"
                ></AddIcon>
                <br />

                <p style={{ textAlign: "center" }}>
                  Create a new poll to start now or later
                </p>
                <br />
               <Link to="/formCreator">
                <Button
                  href="/formCreator"
                  
                  sx={{ margin: "auto",textAlign:"center", display: "block", width: "90%" }}
                  // fullWidth
                  variant="contained"
                  color="primary"
                >
                  Create Poll
                </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Item>
        <Item sx={{ width: "50%" }}>
          <div style={{ margin: "3%" }}>
            <Card sx={{ margin: "15px", height: "50vh" }}>
              <CardContent>
                <Typography variant="h4">Respond to a Poll</Typography>
                <br />
                <p>Type in the ID of the poll in the input box below</p>
                <TextField
                  fullWidth
                  value={pollCode}
                  onChange={(e) => {
                    setPollCode(e.target.value);
                  }}
                  sx={{ margin: "auto", display: "block", width: "90%" }}
                  id="outlined-basic"
                  label="Poll Code"
                  variant="outlined"
                />
                {/* <Box sx={{display:"flex",width:"100%",marginTop:"15px"}}>
                  <div style={{width:"100%"}}></div>
                <Button>Start</Button>
                </Box> */}
                <div style={{ height: "100%", display: "block" }}></div>
                <Button
                onClick={()=>{window.location.href=`/forms?id=${pollCode}`}}
                  sx={{
                    margin: "auto",
                    display: "block",
                    width: "90%",
                    marginTop: "10vh",
                  }}
                  variant="contained"
                >
                  Start
                </Button>
              </CardContent>
            </Card>
          </div>
        </Item>
      </Box>
    </>
  );
}
export default App;
