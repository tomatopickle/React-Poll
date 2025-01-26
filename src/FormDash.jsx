import { useState, useEffect } from "react";
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
import PropTypes, { func } from "prop-types";
import { Link } from "react-router";
import * as Ably from "ably";
import { PieChart } from "@mui/x-charts/PieChart";
import WordCloud from "react-d3-cloud";

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
  let form = JSON.parse(
    localStorage.getItem(location.search.replace("?id=", "") + "form")
  );
  console.log(form);

  return (
    <>
      <AblyProvider client={client}>
        <ChannelProvider channelName="forms">
          <AblyPubSub form={form} />
        </ChannelProvider>
      </AblyProvider>
    </>
  );
}
function AblyPubSub(props) {
  let [submissions, setSubmissions] = useState(0);
  let { form } = props;
  let initialSubmissionsData = [];
  let i = 0;
  form.questions.forEach((question) => {
    initialSubmissionsData[i] = [];
    i++;
  });
  let [submissionsData, setSubmissionsData] = useState(initialSubmissionsData);

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });
  console.log(form.id);
  const { channel } = useChannel("forms", form.id);

  function renderData(question, index) {
    let answers = submissionsData[index];
    if (question.type == "Checkboxes") {
      answers = answers.join("").split(",");
    }
    console.log(submissionsData);
    console.log(answers);
    let data = [];
    let i = 0;
    question.options.forEach((option) => {
      data.push({ id: i, value: 0, label: option.text });
      i++;
    });
    console.log(data);
    answers.forEach((answer) => {
      question.options.forEach((option, optionNumber) => {
        if (option.text == answer) {
          data[optionNumber].value++;
        }
      });
    });
    return data;
  }
  function renderTextData(index) {
    let answers = submissionsData[index];
    let data = [];
    answers.forEach((answer) => {
      data.push({ text: answer, value: Math.random() * 100 });
    });
    console.log(data);
    return data;
  }
  useEffect(() => {
    const handleEvent = (e) => {
      console.log(e);
      if (e.data.type == "qnReq") {
        console.log("TRUEE");
        channel.publish(form.id.toString(), {
          type: "qnRes",
          clientId: e.data.clientId,
          data: form,
        });
      } else if (e.data.type == "ansSubm") {
        console.log(e);
        setSubmissions(submissions + 1);
        let newSubmissionsData = [...submissionsData];
        let index = 0;
        e.data.submissionInfo.answers.forEach((answer) => {
          newSubmissionsData[index].push(answer);
          index++;
        });
        setSubmissionsData(newSubmissionsData);
        console.log(submissionsData);
      }
    };

    channel.subscribe(handleEvent);

    // Cleanup subscription on component unmount
    return () => {
      channel.unsubscribe(handleEvent);
    };
  }, [channel, form.id, submissions, submissionsData]);
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Poll
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ m: 15, paddingInline: "20vw", mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4">Your Form is Live!</Typography>
            <br />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Don't close this tab
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Here&apos;s the link to the form
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              value={`${location.origin}/forms?id=${form.id}`}
            ></TextField>
          </CardContent>
        </Card>
        <br />
        <Typography variant="h4">Responses {`(${submissions})`}</Typography>
        <br />
        <Box>
          {form.questions.map((question, index) => {
            if (question.type == "Short Text") {
              const minFontSize = 15;
              return (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h5">{question.question}</Typography>
                    <br />
                    <WordCloud
                      fontSize={
                        (50/Math.log2(renderTextData(index).length + 3))
                      }
                      width={400}
                      height={100}
                      data={renderTextData(index)}
                    />
                  </CardContent>
                </Card>
              );
            } else if (question.type == "Multiple Choice") {
              return (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h5">{question.question}</Typography>
                    <br />
                    <PieChart
                      series={[
                        {
                          data: renderData(question, index),
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </CardContent>
                </Card>
              );
            } else if (question.type == "Checkboxes") {
              return (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h5">{question.question}</Typography>
                    <br />
                    <PieChart
                      series={[
                        {
                          data: renderData(question, index),
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </CardContent>
                </Card>
              );
            }
          })}
        </Box>
      </Box>
      <br />
      <br />
    </>
  );
}
export default FormDash;
