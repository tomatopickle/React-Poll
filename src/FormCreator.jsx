import { useState } from "react";
import "./App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

function FormCreator() {
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ title: "", questions: [] });
  const open = Boolean(anchorEl);
  const openQuestionsMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeQuestionsMenu = (e) => {
    setAnchorEl(null);
    console.log(e.target.innerText);
    if (e.target.innerText == "") return;
    let question = {
      type: e.target.innerText,
      question: e.target.innerText + " question " + (questions.length + 1),
      id: Math.random(),
    };
    if (question.type != "Short Text") {
      question.options = [];
    }
    questions.push(question);
    setQuestions(questions);
  };
  function updateFormTitle(e) {
    const newForm = { ...form, title: e.target.value };
    setForm(newForm);
  }
  function startForm() {
    let id = Math.random();
    let formData = { ...form, questions: questions, id };
    console.log(formData);
    localStorage.setItem(id + "form", JSON.stringify(formData));
    const goToFormDash = () => navigate("/formDash?id=" + formData.id);
    goToFormDash();
  }
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Poll Creator
          </Typography>
          <Fab variant="extended" onClick={openQuestionsMenu}>
            Add Question
            <AddIcon sx={{ ml: 1 }} />
          </Fab>
          <Menu anchorEl={anchorEl} open={open} onClose={closeQuestionsMenu}>
            <MenuItem onClick={closeQuestionsMenu}>Short Text</MenuItem>
            <MenuItem onClick={closeQuestionsMenu}>Multiple Choice</MenuItem>
            <MenuItem onClick={closeQuestionsMenu}>Checkboxes</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: "5vh", paddingInline: "25%" }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Poll Settings</Typography>
            <br />
            <Box sx={{ paddingInline: "30px" }}>
              <Box sx={{ display: "flex" }}>
                <TextField
                  label="Poll Title"
                  value={form.title}
                  onInput={(e) => updateFormTitle(e)}
                  sx={{ width: "100%" }}
                ></TextField>
              </Box>
              <br />
              <br />
              <Box sx={{ display: "flex" }}>
                <div style={{ flex: 1 }}></div>
                <Button
                  disabled={form.title == "" || questions.length == 0}
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  sx={{ mr: "15px" }}
                >
                  Save
                </Button>
                <Button
                  disabled={form.title == "" || questions.length == 0}
                  variant="contained"
                  onClick={() => {
                    startForm();
                  }}
                >
                  Start
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <br />
        <Box>
          <QuestionsEditor questions={questions} setQuestions={setQuestions} />
        </Box>
      </Box>
    </>
  );
}
function QuestionsEditor(props) {
  // const [questions, setQuestions] = useState(props.questions);
  function addOption(index) {
    let newQuestions = [...props.questions];

    let option = { text: "", id: Math.random() };
    newQuestions[index].options.push(option);
    console.log(newQuestions);
    props.setQuestions(newQuestions);
  }
  function removeOption(questionIndex, optionIndex) {
    // Create a deep copy of questions
    const newQuestions = [...props.questions];

    // Remove the specific option
    const updatedOptions = newQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      options: updatedOptions,
    };

    // Update state with the new array
    props.setQuestions(newQuestions);
  }
  function updateOptionText(e, index, optionIndex) {
    let newQuestions = [...props.questions];
    newQuestions[index].options[optionIndex].text = e.target.value;
    props.setQuestions(newQuestions);
  }
  function updateQuestion(index, e) {
    let newQuestions = [...props.questions];
    newQuestions[index].question = e.target.value;
    props.setQuestions(newQuestions);
  }
  function deleteQuestion(index) {
    let newQuestions = [...props.questions];
    newQuestions = newQuestions.filter((_, i) => i !== index);
    props.setQuestions(newQuestions);
  }
  console.log(props);
  return (
    <Box id="questionsEditor">
      {props.questions.map((question, index) => {
        if (question.type == "Short Text") {
          return (
            <Card key={question.id}>
              <CardContent>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    value={question.question}
                    onInput={(e) => updateQuestion(index, e)}
                    label="Short text question"
                    sx={{ flex: 1 }}
                  ></TextField>
                  <IconButton
                    aria-label="delete"
                    onClick={() => deleteQuestion(index)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          );
        } else if (question.type == "Multiple Choice") {
          return (
            <Card key={question.id}>
              <CardContent>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    value={question.question}
                    onInput={(e) => updateQuestion(index, e)}
                    label="Multiple Choice Question"
                    sx={{ flex: 1 }}
                  ></TextField>
                  <IconButton
                    aria-label="delete"
                    onClick={() => deleteQuestion(index)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", marginBlock: 2 }}>
                  <div style={{ flex: 1 }}></div>
                  <Button onClick={() => addOption(index)}>Add Option</Button>
                </Box>
                <Box sx={{ display: "grid" }}>
                  <OptionsEditor
                    updateOptionText={updateOptionText}
                    question={question}
                    removeOption={removeOption}
                    index={index}
                  />
                </Box>
              </CardContent>
            </Card>
          );
        } else if (question.type == "Checkboxes") {
          return (
            <Card key={question.id}>
              <CardContent>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    value={question.question}
                    onInput={(e) => updateQuestion(index, e)}
                    label="Checkbox Question"
                    sx={{ flex: 1 }}
                  ></TextField>
                  <IconButton
                    aria-label="delete"
                    onClick={() => deleteQuestion(index)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", mt: 1 }}>
                  <div style={{ flex: 1 }}></div>
                  <Button onClick={() => addOption(index)}>Add Option</Button>
                </Box>
                <OptionsEditor
                  updateOptionText={updateOptionText}
                  question={question}
                  removeOption={removeOption}
                  index={index}
                />
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
              {index + 1}: {question.type}
            </div>
          );
        }
      })}
    </Box>
  );
}
function OptionsEditor(props) {
  let { question, updateOptionText, removeOption, index } = props;
  return (
    <>
      <Box sx={{ display: "grid" }}>
        {question.options.map((option, optionIndex) => (
          <Box sx={{ mb: 1, display: "flex", width: "100%" }} key={option.id}>
            <TextField
              onInput={(e) => updateOptionText(e, index, optionIndex)}
              sx={{ flex: 1 }}
              label={"Option " + (optionIndex + 1)}
            ></TextField>
            <IconButton
              aria-label="delete"
              onClick={() => removeOption(index, optionIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </>
  );
}
export default FormCreator;
