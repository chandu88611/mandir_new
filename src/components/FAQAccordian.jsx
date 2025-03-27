import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FaChevronDown } from "react-icons/fa";
import { styled } from "@mui/system";

const Root = styled("div")({
  width: "100%",
});

// const CustomAccordion = styled(Accordion)({
//   backgroundColor: 'green', // light red color
//   margin: '8px 0',
//   borderRadius:"10px",
//   color:'black'
// });

const Summary = styled(AccordionSummary)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Icon = styled(FaChevronDown)({
  color: "black", // dark color for the icon
});

const Question = styled(Typography)({
  fontWeight: "bold",
  color: "black",
});

const FAQ = () => {
  const faqData = [
    {
      question: "What is the mission of Giveaze Foundation?",
      answer:
        "Our mission is to preserve India's sacred heritage by renovating, restoring, and maintaining India's temples.",
    },
    {
      question: "How do you ensure transparency in the use of donations?",
      answer:
        "We ensure transparency by providing detailed reports on the utilization of donations, which are audited by independent third-party auditors.",
    },
    {
      question: "How do you select the temples for renovation and restoration?",
      answer:
        "We select temples based on their historical significance, cultural importance, and current state of disrepair.",
    },
    {
      question: "Can I specify which temple I want my donation to go towards?",
      answer:
        "Yes, you can donate by selecting the specific campaign which temple you want your donation to go towards.",
    },
    {
      question: "How can I get involved with the initiative?",
      answer:
        "You can get involved by donating, volunteering, or spreading the word about our initiative. Please email us at info@giveaze.com for more information.",
    },
    {
      question: "Who manages the day-to-day operations of the initiative?",
      answer:
        "Our team of experienced professionals manages the day-to-day operations of the initiative.",
    },
    {
      question:
        "How can I track the progress of the temple renovation and restoration projects?",
      answer:
        "We will provide regular updates on the progress of the projects through our website, social media, and email newsletters.",
    },
  ];

  return (
    <Root>
      {faqData.map((faq, index) => (
        <Accordion key={index}>
          <Summary
            expandIcon={<Icon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Question>{faq.question}</Question>
          </Summary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Root>
  );
};

export default FAQ;
