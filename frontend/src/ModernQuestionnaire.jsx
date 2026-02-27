import { useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Container
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


const questions = [

{
  column: "FRUITS_VEGGIES",
  title: "Fruit & Vegetable Intake",
  description: "How often do you consume nutritious foods like fruits and vegetables?",
  options: [
    { label: "Rarely", value: 2 },
    { label: "Sometimes", value: 5 },
    { label: "Often", value: 8 },
    { label: "Daily", value: 10 }
  ]
},

{
  column: "DAILY_STRESS",
  title: "Daily Stress Level",
  description: "How much mental pressure or stress do you experience daily?",
  options: [
    { label: "Very Low", value: 2 },
    { label: "Moderate", value: 5 },
    { label: "High", value: 8 },
    { label: "Extreme", value: 10 }
  ]
},

{
  column: "PLACES_VISITED",
  title: "Recreation & Travel",
  description: "How often do you visit new places or engage in recreational activities?",
  options: [
    { label: "Almost Never", value: 2 },
    { label: "Occasionally", value: 5 },
    { label: "Regularly", value: 8 },
    { label: "Very Frequently", value: 10 }
  ]
},

{
  column: "CORE_CIRCLE",
  title: "Support System",
  description: "How strong is your close support circle of friends or family?",
  options: [
    { label: "Very Weak", value: 2 },
    { label: "Average", value: 5 },
    { label: "Strong", value: 8 },
    { label: "Very Strong", value: 10 }
  ]
},

{
  column: "SUPPORTING_OTHERS",
  title: "Helping Others",
  description: "How often do you provide emotional or practical support to others?",
  options: [
    { label: "Rarely", value: 2 },
    { label: "Sometimes", value: 5 },
    { label: "Often", value: 8 },
    { label: "Very Often", value: 10 }
  ]
},

{
  column: "SOCIAL_NETWORK",
  title: "Social Interaction",
  description: "How socially connected do you feel with others?",
  options: [
    { label: "Isolated", value: 2 },
    { label: "Moderate", value: 5 },
    { label: "Active", value: 8 },
    { label: "Highly Connected", value: 10 }
  ]
},

{
  column: "ACHIEVEMENT",
  title: "Sense of Achievement",
  description: "How satisfied do you feel about your accomplishments?",
  options: [
    { label: "Very Low", value: 2 },
    { label: "Moderate", value: 5 },
    { label: "High", value: 8 },
    { label: "Very High", value: 10 }
  ]
},

{
  column: "DONATION",
  title: "Charitable Contribution",
  description: "How often do you contribute to society through charity or volunteering?",
  options: [
    { label: "Never", value: 2 },
    { label: "Occasionally", value: 5 },
    { label: "Regularly", value: 8 },
    { label: "Frequently", value: 10 }
  ]
},

{
  column: "BMI_RANGE",
  title: "Physical Health",
  description: "How would you rate your physical health and fitness level?",
  options: [
    { label: "Poor", value: 2 },
    { label: "Average", value: 5 },
    { label: "Good", value: 8 },
    { label: "Excellent", value: 10 }
  ]
},

{
  column: "TODO_COMPLETED",
  title: "Task Completion",
  description: "How effectively do you complete your planned daily tasks?",
  options: [
    { label: "Rarely Complete Tasks", value: 2 },
    { label: "Sometimes", value: 5 },
    { label: "Often", value: 8 },
    { label: "Always", value: 10 }
  ]
},

{
  column: "FLOW",
  title: "Focus & Flow State",
  description: "How often do you feel deeply focused and engaged in activities?",
  options: [
    { label: "Rarely", value: 2 },
    { label: "Sometimes", value: 5 },
    { label: "Often", value: 8 },
    { label: "Very Frequently", value: 10 }
  ]
},

{
  column: "DAILY_STEPS",
  title: "Physical Activity",
  description: "How active are you physically during a typical day?",
  options: [
    { label: "Very Low Activity", value: 2 },
    { label: "Moderate", value: 5 },
    { label: "Active", value: 8 },
    { label: "Highly Active", value: 10 }
  ]
},

{
  column: "LIVE_VISION",
  title: "Life Vision Clarity",
  description: "How clear are you about your future goals and direction?",
  options: [
    { label: "Very Unclear", value: 2 },
    { label: "Somewhat Clear", value: 5 },
    { label: "Clear", value: 8 },
    { label: "Very Clear", value: 10 }
  ]
},

{
  column: "SLEEP_HOURS",
  title: "Sleep Quality",
  description: "How would you rate your sleep duration and quality?",
  options: [
    { label: "Poor", value: 2 },
    { label: "Average", value: 5 },
    { label: "Good", value: 8 },
    { label: "Excellent", value: 10 }
  ]
},

{
  column: "LOST_VACATION",
  title: "Work-Life Breaks",
  description: "How often do you miss vacations or relaxation opportunities due to work?",
  options: [
    { label: "Very Often", value: 2 },
    { label: "Sometimes", value: 5 },
    { label: "Rarely", value: 8 },
    { label: "Never", value: 10 }
  ]
},

{
  column: "DAILY_SHOUTING",
  title: "Emotional Stability",
  description: "How often do you experience emotional outbursts like anger or frustration?",
  options: [
    { label: "Very Often", value: 2 },
    { label: "Sometimes", value: 5 },
    { label: "Rarely", value: 8 },
    { label: "Never", value: 10 }
  ]
},

{
  column: "SUFFICIENT_INCOME",
  title: "Financial Satisfaction",
  description: "How satisfied are you with your income relative to your needs?",
  options: [
    { label: "Not Sufficient", value: 2 },
    { label: "Barely Enough", value: 5 },
    { label: "Comfortable", value: 8 },
    { label: "Very Comfortable", value: 10 }
  ]
},

{
  column: "PERSONAL_AWARDS",
  title: "Recognition & Appreciation",
  description: "How often do you receive recognition or appreciation for your efforts?",
  options: [
    { label: "Rarely", value: 2 },
    { label: "Sometimes", value: 5 },
    { label: "Often", value: 8 },
    { label: "Very Often", value: 10 }
  ]
},

{
  column: "TIME_FOR_PASSION",
  title: "Time for Personal Interests",
  description: "How much time do you spend on hobbies or activities you enjoy?",
  options: [
    { label: "Almost None", value: 2 },
    { label: "Limited", value: 5 },
    { label: "Good Amount", value: 8 },
    { label: "Plenty", value: 10 }
  ]
},

{
  column: "WEEKLY_MEDITATION",
  title: "Mindfulness / Meditation",
  description: "How frequently do you practice relaxation or mindfulness activities?",
  options: [
    { label: "Never", value: 2 },
    { label: "Occasionally", value: 5 },
    { label: "Regularly", value: 8 },
    { label: "Daily", value: 10 }
  ]
},

{
  column: "AGE",
  title: "Age",
  description: "Please select your age range.",
  options: [
    { label: "Under 20", value: 2 },
    { label: "20–30", value: 5 },
    { label: "30–45", value: 8 },
    { label: "Above 45", value: 10 }
  ]
},

{
  column: "GENDER",
  title: "Gender",
  description: "Please select your gender.",
  options: [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 }
  ]
}

];


export default function ModernQuestionnaire({ onComplete }) {

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[step];

  const selectOption = (value) => {
    setAnswers({
      ...answers,
      [current.column]: value
    });
  };

  const next = async () => {

  console.log("Next clicked", step);

  if (step < questions.length - 1) {
    setStep(step + 1);
    return;
  }

  console.log("Submitting answers", answers);

  try {

    const features = questions.map(
      q => answers[q.column] || 0
    );

    console.log("Features:", features);

    const res = await axios.post(
      "http://127.0.0.1:8000/predict",
      { features }
    );

    console.log("Backend response:", res.data);

    const score = res.data.score;
    const label = res.data.label;

    const user = auth.currentUser;

    if (user) {

      await addDoc(collection(db, "analysis"), {
        userId: user.uid,
        inputs: answers,
        score,
        label,
        createdAt: serverTimestamp()
      });

      console.log("Saved to Firebase ✅");

    }

    if (onComplete) onComplete();

  } catch (err) {

    console.error("Submit error:", err);

  }

};

  const progress =
    ((step + 1) / questions.length) * 100;

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at top, #1e1b4b, #020617)",
        color: "white"
      }}
    >

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          py: 4
        }}
      >

        {/* Header */}
        <Box>

          <Typography sx={{ opacity: 0.7 }}>
            {step + 1}/{questions.length}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1 }}
          />

        </Box>

        {/* Space Added Here */}
        <Box sx={{ mt: 4 }}>

          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            <Typography variant="h4" sx={{ mb: 2 }}>
              {current.title}
            </Typography>

            <Typography sx={{ mb: 3 }}>
              {current.description}
            </Typography>

            {current.options.map((opt, index) => {

              const selected =
                answers[current.column] === opt.value;

              return (
                <Box
                  key={index}
                  onClick={() => selectOption(opt.value)}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    background: selected
                      ? "#6366f1"
                      : "#1e293b"
                  }}
                >
                  <Typography>{opt.label}</Typography>
                </Box>
              );
            })}

          </motion.div>

        </Box>

        {/* Button */}
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={next}
        >
          {step === questions.length - 1
            ? "Submit"
            : "Continue"}
        </Button>

      </Container>

    </Box>
  );
}