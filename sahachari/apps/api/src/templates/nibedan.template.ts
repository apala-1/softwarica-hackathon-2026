import { WizardFormData } from "../types/wizard.types";
import { TDocumentDefinitions } from "pdfmake/interfaces";

function nepaliDate(): string {
  // Returns today's date in Nepali format (AD date formatted for now)
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
}

function genderLabel(g?: string): string {
  if (g === "male") return "पुरुष";
  if (g === "female") return "महिला";
  if (g === "other") return "अन्य";
  return "";
}

export function buildNibedanTemplate(
  data: WizardFormData,
): TDocumentDefinitions {
  const { location, story, violence, people } = data;
  const { complainant, accused, witnesses } = people;

  const witnessLines =
    witnesses.length > 0
      ? witnesses
          .map(
            (w, i) =>
              `${i + 1}. ${w.name}${w.relation ? `, ${w.relation}` : ""}${w.address ? `, ${w.address}` : ""}`,
          )
          .join("\n")
      : "कोही साक्षी छैनन्";

  const violenceMap: Record<string, string> = {
    physical_violence: "शारीरिक हिंसा",
    mental_violence: "मानसिक हिंसा",
    sexual_violence: "यौन हिंसा",
    economic_violence: "आर्थिक हिंसा",
  };

  const violenceList =
    violence.selectedTypes.length > 0
      ? violence.selectedTypes.map((id) => violenceMap[id] ?? id).join(", ")
      : "उल्लेख गरिएको छैन";

  return {
    defaultStyle: {
      font: "NotoSansDevanagari",
      fontSize: 11,
      lineHeight: 1.5,
    },
    pageMargins: [50, 60, 50, 60],
    content: [
      // Header
      {
        text: "निवेदन",
        style: "header",
        alignment: "center",
        marginBottom: 4,
      },
      {
        text: `(घरेलु हिंसा (कसुर र सजाय) ऐन, २०६६ अन्तर्गत)`,
        alignment: "center",
        fontSize: 10,
        color: "#555555",
        marginBottom: 20,
      },

      // To
      {
        text: [
          { text: "सेवामा,\n", bold: true },
          `न्यायिक समिति / वडा कार्यालय\n`,
          `${location.palika}, ${location.district}\n`,
          `${location.province}`,
          location.ward ? `, वडा नं. ${location.ward}` : "",
        ],
        marginBottom: 16,
      },

      // Subject
      {
        text: [
          { text: "विषय: ", bold: true },
          "घरेलु हिंसाको उजुरी दर्ता गराइदिनु हुन अनुरोध।",
        ],
        marginBottom: 16,
      },

      // Salutation
      {
        text: "महोदय/महोदया,",
        marginBottom: 8,
      },

      // Complainant info
      {
        text: "निवेदकको विवरण:",
        bold: true,
        marginBottom: 4,
      },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            ["पूरा नाम", complainant.name || "—"],
            ["उमेर", complainant.age ? `${complainant.age} वर्ष` : "—"],
            ["लिङ्ग", genderLabel(complainant.gender) || "—"],
            ["ठेगाना", complainant.address || "—"],
            ["सम्पर्क", complainant.phone || "—"],
          ],
        },
        layout: "lightHorizontalLines",
        marginBottom: 14,
      },

      // Accused info
      {
        text: "प्रतिवादीको विवरण:",
        bold: true,
        marginBottom: 4,
      },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            ["पूरा नाम", accused.name || "—"],
            ["उमेर", accused.age ? `${accused.age} वर्ष` : "—"],
            ["लिङ्ग", genderLabel(accused.gender) || "—"],
            ["ठेगाना", accused.address || "—"],
            ["सम्बन्ध", accused.relation || "—"],
          ],
        },
        layout: "lightHorizontalLines",
        marginBottom: 14,
      },

      // Story
      {
        text: "घटनाको विवरण:",
        bold: true,
        marginBottom: 4,
      },
      {
        text: story.enhancedStory || story.rawStory,
        marginBottom: 14,
        alignment: "justify",
      },

      // Violence types
      {
        text: "हिंसाका प्रकार:",
        bold: true,
        marginBottom: 4,
      },
      {
        text: violenceList,
        marginBottom: 14,
      },

      // Witnesses
      {
        text: "साक्षीहरू:",
        bold: true,
        marginBottom: 4,
      },
      {
        text: witnessLines,
        marginBottom: 20,
      },

      // Request
      {
        text: "अतः माथि उल्लेखित घटनाको उचित छानबिन गरी कानुन बमोजिम कारबाही गरिदिनु हुन विनम्र अनुरोध गर्दछु।",
        marginBottom: 24,
        alignment: "justify",
      },

      // Footer
      {
        columns: [
          {
            text: [{ text: "मिति: ", bold: true }, nepaliDate()],
          },
          {
            text: [
              { text: "निवेदकको दस्तखत: ", bold: true },
              "................................",
            ],
            alignment: "right",
          },
        ],
      },
    ],
    styles: {
      header: {
        font: "NotoSansDevanagari",
        fontSize: 18,
        bold: true,
      },
    },
  };
}
