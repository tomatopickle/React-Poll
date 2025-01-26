import { useState } from "react";
import "./App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";

import PropTypes, { func } from "prop-types";
import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";

function FormDash() {
  const client = new Ably.Realtime({
    key: "FIRx1w.rZgtdQ:G8WUNcr0IsRGJ5nCrzFFcgQtfpD89G1al0G8-Wwp3z4",
  });
  console.log(client);

  return (
    <>
      <AblyProvider client={client}>
        <ChannelProvider channelName="forms">
          <AblyPubSub />
        </ChannelProvider>
      </AblyProvider>
    </>
  );
}
function AblyPubSub(props) {
  const navigate = useNavigate();
  let { form } = props;
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [answers, setAnswers] = useState([]);
  let id = location.search.replace("?id=", "") + "form";
  let clientId = Math.random();
  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
    channel.publish(id, { type: "qnReq", clientId });
  });
  function submitAnswers() {
    let submissionInfo = { answers, clientId, id, form };
    channel.publish(id, { type: "ansSubm", submissionInfo });
    setOpenModal(true);
  }
  const { channel } = useChannel("forms", id, (message) => {
    console.log(message);
  });
  channel.subscribe((data) => {
    let message = data;
    if (message.data.type == "qnRes" && message.data.clientId == clientId) {
      console.log(message.data);
      let newQuestions = message.data.data.questions;
      setFormData(message.data.data);
      let i = 0;
      let newAnswers = [];
      newQuestions.forEach(() => {
        newAnswers[i] = "";
        i++;
      });
      setAnswers(newAnswers);
      console.log(answers);
      console.log(newQuestions);
      setQuestions(newQuestions);
    }
  });
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Poll
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ m: 15, paddingInline: "20vw", mt: 5, mb: 3 }}>
        <Questions
          questions={questions}
          formData={formData}
          answers={answers}
          setAnswers={setAnswers}
        />
      </Box>

      <Box sx={{ display: "flex", paddingInline: "20vw", mr: 15 }}>
        <div style={{ width: "100%" }}></div>
        <Button onClick={submitAnswers} size="large" variant="contained">
          Submit
        </Button>
      </Box>
      <Dialog
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ p: 3 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Your response has been submitted
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You can respond again if you want
          </Typography>
          <br />
          <DialogActions>
            <Button
              onClick={() => {
                navigate(0);
              }}
              autoFocus
            >
              Submit Again
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <br></br>
    </>
  );
}
function Questions(props) {
  let { questions, formData, answers, setAnswers } = props;
  console.log(answers);
  function updateAnswer(e, index, type) {
    let newAnswers = [...answers];
    if (type == "checkbox") {
      let checkboxAnswers = answers[index].split(",");

      if (checkboxAnswers.includes(e.target.value)) {
        checkboxAnswers = checkboxAnswers.filter((c) => c !== e.target.value);
      } else {
        checkboxAnswers.push(e.target.value);
      }
      newAnswers[index] = checkboxAnswers.join(",");

      setAnswers(newAnswers);
      console.log(newAnswers);
      return;
    }
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
    console.log(e);
    console.log(newAnswers);
  }
  if (questions.length == 0) {
    return (
      <>
        <Box>
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6">Loading Form...</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </>
    );
  } else {
    return (
      <Box id="questions">
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {formData.title}
        </Typography>
        <br />
        {questions.map((question, index) => {
          if (question.type == "Short Text") {
            return (
              <Card key={question.id}>
                <CardContent>
                  <Box>
                    <Typography variant="h6">{question.question}</Typography>
                    <br />

                    <TextField
                      key={question.id}
                      value={answers[index]}
                      onInput={(e) => updateAnswer(e, index, "text")}
                      sx={{ width: "100%" }}
                    ></TextField>
                  </Box>
                </CardContent>
              </Card>
            );
          } else if (question.type == "Multiple Choice") {
            return (
              <Card key={question.id} sx={{ mt: 2 }}>
                <CardContent>
                  <Box sx={{ display: "grid" }}>
                    <FormControl>
                      <Typography variant="h6">{question.question}</Typography>
                      <RadioGroup
                        defaultValue={answers[index]}
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                      >
                        {question.options.map((option, optionIndex) => (
                          <FormControlLabel
                            key={option.text}
                            onInput={(e) => updateAnswer(e, index, "radio")}
                            value={option.text}
                            control={<Radio />}
                            label={option.text}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            );
          } else if (question.type == "Checkboxes") {
            return (
              <Card key={question.id} sx={{ mt: 2 }}>
                <CardContent>
                  <Box sx={{ display: "grid" }}>
                    <FormControl>
                      <Typography variant="h6">{question.question}</Typography>
                      <RadioGroup
                        defaultValue={answers[index]}
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                      >
                        {question.options.map((option, optionIndex) => (
                          <FormControlLabel
                            key={option.text}
                            value={option.text}
                            onInput={(e) => updateAnswer(e, index, "checkbox")}
                            control={<Checkbox />}
                            label={option.text}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            );
          } else {
            return (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                BURRRO
              </div>
            );
          }
        })}
      </Box>
    );
  }
}
export default FormDash;
