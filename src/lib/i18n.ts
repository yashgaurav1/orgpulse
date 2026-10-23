export type Locale = 'en' | 'hi' | 'kn';

export interface SurveyTranslations {
  notice: {
    title: string;
    badge: string;
    whatIsCollectedTitle: string;
    whatIsCollectedBody: string;
    whatIsNotCollectedTitle: string;
    whatIsNotCollectedBody: string;
    whoSeesWhatTitle: string;
    whoSeesWhatBody: string;
    minimumGroupTitle: string;
    minimumGroupBody: string;
    retentionTitle: string;
    retentionBody: string;
    purposeLimitTitle: string;
    purposeLimitBody: string;
    grievanceTitle: string;
    grievanceBody: string;
    misconductWarningTitle: string;
    misconductWarningBody: string;
    startButton: string;
  };
  survey: {
    title: string;
    subtitle: string;
    skippableNote: string;
    scaleLabels: { [key: number]: string };
    openQuestionTitle: string;
    openQuestionSubtext: string;
    openQuestionPlaceholder: string;
    charCount: string;
    submitButton: string;
    submittingButton: string;
  };
  thankYou: {
    title: string;
    message: string;
    privacyReminder: string;
  };
  questions: {
    [key: string]: {
      domain: string;
      text: string;
    };
  };
}

export const TRANSLATIONS: Record<Locale, SurveyTranslations> = {
  en: {
    notice: {
      title: 'Survey Notice & Privacy Declaration',
      badge: 'Privacy Notice (Legal Review Required)',
      whatIsCollectedTitle: 'What is collected',
      whatIsCollectedBody:
        'Your answers to 6 survey questions (1–5 scale) and an optional engineering output feedback comment. Your delivery squad and business unit are recorded as aggregate groupings.',
      whatIsNotCollectedTitle: 'What is strictly NOT collected',
      whatIsNotCollectedBody:
        'No employee names, email addresses, employee IDs, device identifiers, IP addresses, or fine-grained timestamps are collected or stored in the survey response database.',
      whoSeesWhatTitle: 'Who sees what',
      whoSeesWhatBody:
        'Delivery managers see aggregate squad score means only. Directors and HR see business-unit aggregates. No person in the company can see individual responses.',
      minimumGroupTitle: 'Minimum group threshold (N = 5)',
      minimumGroupBody:
        'If fewer than 5 people in your squad respond, your squad’s results are suppressed or rolled up into the business unit pool. No individual score can ever be isolated.',
      retentionTitle: 'Data retention',
      retentionBody:
        'Raw responses, comments, and single-use invite tokens are permanently deleted 90 days after the survey cycle closes. Only anonymized aggregate trends are retained.',
      purposeLimitTitle: 'Strict purpose limitation',
      purposeLimitBody:
        'Pulse results are used solely to improve team processes and resolve delivery roadblocks. Results are never used for appraisal, promotion, compensation, or redundancy decisions.',
      grievanceTitle: 'Grievance contact',
      grievanceBody:
        'For inquiries regarding data privacy or survey administration, contact: ethics-pulse@company.com (Designated Privacy Grievance Officer).',
      misconductWarningTitle: 'Not a misconduct channel',
      misconductWarningBody:
        'This survey is anonymous and not monitored for urgent alerts. For complaints regarding harassment, ethics violations, or misconduct, please use the company Internal Complaints Committee (POSH) or Whistleblower Portal.',
      startButton: 'I Understand: Take the Survey',
    },
    survey: {
      title: 'Quarterly Engineering Pulse',
      subtitle: 'Takes under 2 minutes. All questions are voluntary and skippable.',
      skippableNote: 'Any item may be left unanswered if you prefer not to rate it.',
      scaleLabels: {
        1: 'Strongly Disagree',
        2: 'Disagree',
        3: 'Neutral',
        4: 'Agree',
        5: 'Strongly Agree',
      },
      openQuestionTitle: 'Operational & Tooling Feedback (Optional)',
      openQuestionSubtext:
        'What operational change or tooling improvement would most enhance your daily engineering output? Please do NOT include personal names.',
      openQuestionPlaceholder: 'Describe technical or process improvements...',
      charCount: 'characters remaining',
      submitButton: 'Submit Anonymous Response',
      submittingButton: 'Submitting securely...',
    },
    thankYou: {
      title: 'Response Recorded',
      message:
        'Thank you for contributing to your squad’s operational health. Your single-use token has been burned, and your response has been saved anonymously with no connection to your identity.',
      privacyReminder:
        'You may close this tab now. The identical confirmation screen is shown regardless of individual rating choices.',
    },
    questions: {
      q1: {
        domain: 'Work purpose',
        text: "I understand how my current technical tasks contribute to the client's business goals.",
      },
      q2: {
        domain: 'Operational support',
        text: 'I have the access permissions, hardware, software tools, and technical guidance needed to finish my tasks without excessive delays.',
      },
      q3: {
        domain: 'Skill growth',
        text: 'Over the past three months, I have had opportunities to build technical or professional skills that advance my career.',
      },
      q4: {
        domain: 'Psychological safety',
        text: 'If I encounter an engineering roadblock or delivery problem, I can raise it to my lead without fear of negative consequences.',
      },
      q5: {
        domain: 'Workload sustainability',
        text: 'My daily workload allows me to disconnect from work outside regular business hours on most workdays.',
      },
      q6: {
        domain: 'Team advocacy',
        text: 'I would recommend my delivery squad to an engineering peer as a supportive and productive place to work.',
      },
    },
  },
  hi: {
    notice: {
      title: 'सर्वेक्षण सूचना एवं गोपनीयता घोषणा',
      badge: 'गोपनीयता सूचना (कानूनी समीक्षा आवश्यक)',
      whatIsCollectedTitle: 'क्या एकत्र किया जाता है',
      whatIsCollectedBody:
        '6 सर्वेक्षण प्रश्नों (1-5 पैमाना) के आपके उत्तर और एक वैकल्पिक सुझाव। आपकी टीम और इकाई केवल समूह के रूप में दर्ज की जाती है।',
      whatIsNotCollectedTitle: 'क्या बिल्कुल एकत्र नहीं किया जाता',
      whatIsNotCollectedBody:
        'कोई नाम, ईमेल पता, कर्मचारी आईडी, डिवाइस पहचानकर्ता, आईपी पता या समय सर्वेक्षण डेटाबेस में एकत्र या संग्रहीत नहीं किया जाता है।',
      whoSeesWhatTitle: 'कौन क्या देखता है',
      whoSeesWhatBody:
        'प्रबंधक केवल टीम के औसत स्कोर देखते हैं। निदेशक और मानव संसाधन केवल व्यावसायिक इकाई के कुल परिणाम देखते हैं। कोई भी व्यक्तिगत प्रतिक्रिया नहीं देख सकता।',
      minimumGroupTitle: 'न्यूनतम समूह आकार (N = 5)',
      minimumGroupBody:
        'यदि आपकी टीम में 5 से कम लोग उत्तर देते हैं, तो परिणाम छिपा दिए जाते हैं या मुख्य इकाई में मिला दिए जाते हैं।',
      retentionTitle: 'डेटा प्रतिधारण',
      retentionBody:
        'सर्वेक्षण चक्र बंद होने के 90 दिनों के बाद व्यक्तिगत प्रतिक्रियाएं, टिप्पणियां और टोकन हमेशा के लिए हटा दिए जाते हैं।',
      purposeLimitTitle: 'उद्देश्य सीमा',
      purposeLimitBody:
        'परिणामों का उपयोग कभी भी मूल्यांकन, पदोन्नति, वेतन या छंटनी के निर्णयों के लिए नहीं किया जाता है।',
      grievanceTitle: 'शिकायत संपर्क',
      grievanceBody:
        'डेटा गोपनीयता संबंधी प्रश्नों के लिए संपर्क करें: ethics-pulse@company.com (नामित गोपनीयता अधिकारी)।',
      misconductWarningTitle: 'दुराचार रिपोर्टिंग चैनल नहीं',
      misconductWarningBody:
        'यह सर्वेक्षण गुमनाम है। उत्पीड़न या नैतिक उल्लंघनों की रिपोर्ट करने के लिए कंपनी की आंतरिक समिति (POSH) या व्हिसलब्लोअर पोर्टल का उपयोग करें।',
      startButton: 'मैं समझ गया/गई: सर्वेक्षण शुरू करें',
    },
    survey: {
      title: 'तिमाही इंजीनियरिंग पल्स',
      subtitle: '2 मिनट से भी कम समय लगता है। सभी प्रश्न स्वैच्छिक हैं।',
      skippableNote: 'यदि आप किसी प्रश्न का मूल्यांकन नहीं करना चाहते हैं तो उसे छोड़ सकते हैं।',
      scaleLabels: {
        1: 'दृढ़ता से असहमत',
        2: 'असहमत',
        3: 'तटस्थ',
        4: 'सहमत',
        5: 'दृढ़ता से सहमत',
      },
      openQuestionTitle: 'परिचालन एवं टूलिंग फीडबैक (वैकल्पिक)',
      openQuestionSubtext:
        'कौन सा बदलाव आपके दैनिक इंजीनियरिंग कार्य को सबसे बेहतर बना सकता है? कृपया किसी का नाम न लिखें।',
      openQuestionPlaceholder: 'तकनीकी या प्रक्रिया सुधार का वर्णन करें...',
      charCount: 'अक्षर शेष',
      submitButton: 'गुमनाम प्रतिक्रिया जमा करें',
      submittingButton: 'सुरक्षित रूप से जमा किया जा रहा है...',
    },
    thankYou: {
      title: 'प्रतिक्रिया दर्ज की गई',
      message:
        'धन्यवाद! आपका टोकन रद्द कर दिया गया है और आपकी प्रतिक्रिया बिना किसी पहचान के सुरक्षित रूप से दर्ज कर ली गई है।',
      privacyReminder: 'आप इस पृष्ठ को अब बंद कर सकते हैं।',
    },
    questions: {
      q1: {
        domain: 'कार्य का उद्देश्य',
        text: 'मैं समझता/समझती हूँ कि मेरे तकनीकी कार्य ग्राहक के व्यावसायिक लक्ष्यों में कैसे योगदान करते हैं।',
      },
      q2: {
        domain: 'परिचालन सहायता',
        text: 'मेरे पास काम पूरा करने के लिए आवश्यक अनुमतियाँ, उपकरण और तकनीकी मार्गदर्शन उपलब्ध हैं।',
      },
      q3: {
        domain: 'कौशल विकास',
        text: 'पिछले तीन महीनों में मुझे अपने करियर को आगे बढ़ाने के लिए तकनीकी कौशल विकसित करने के अवसर मिले हैं।',
      },
      q4: {
        domain: 'मनोवैज्ञानिक सुरक्षा',
        text: 'यदि मुझे कोई समस्या आती है, तो मैं बिना किसी डर के अपने लीड के सामने उसे रख सकता/सकती हूँ।',
      },
      q5: {
        domain: 'कार्यभार स्थिरता',
        text: 'मेरा दैनिक कार्यभार मुझे अधिकांश कार्यदिवसों में नियमित घंटों के बाद काम से अलग होने की अनुमति देता है।',
      },
      q6: {
        domain: 'टीम की अनुशंसा',
        text: 'मैं किसी इंजीनियरिंग साथी को अपनी टीम में काम करने की सलाह दूँगा/दूँगी।',
      },
    },
  },
  kn: {
    notice: {
      title: 'ಸಮೀಕ್ಷಾ ಸೂಚನೆ ಮತ್ತು ಗೌಪ್ಯತಾ ಘೋಷಣೆ',
      badge: 'ಗೌಪ್ಯತೆ ಸೂಚನೆ (ಕಾನೂನು ಪರಿಶೀಲನೆ ಅಗತ್ಯ)',
      whatIsCollectedTitle: 'ಏನನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ',
      whatIsCollectedBody:
        '6 ಸಮೀಕ್ಷಾ ಪ್ರಶ್ನೆಗಳಿಗೆ (1-5 ಪ್ರಮಾಣ) ನಿಮ್ಮ ಉತ್ತರಗಳು ಮತ್ತು ಐಚ್ಛಿಕ ಪ್ರತಿಕ್ರಿಯೆ. ನಿಮ್ಮ ತಂಡ ಮತ್ತು ವಿಭಾಗವನ್ನು ಕೇವಲ ಒಟ್ಟಾರೆ ಗುಂಪಾಗಿ ದಾಖಲಿಸಲಾಗುತ್ತದೆ.',
      whatIsNotCollectedTitle: 'ಏನನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ',
      whatIsNotCollectedBody:
        'ಯಾವುದೇ ಹೆಸರು, ಇಮೇಲ್ ವಿಳಾಸ, ಉದ್ಯೋಗಿ ಐಡಿ, ಸಾಧನ ಗುರುತಿಸುವಿಕೆ, ಐಪಿ ವಿಳಾಸ ಅಥವಾ ನಿಖರ ಸಮಯವನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ.',
      whoSeesWhatTitle: 'ಯಾರು ಏನನ್ನು ನೋಡುತ್ತಾರೆ',
      whoSeesWhatBody:
        'ಮ್ಯಾನೇಜರ್‌ಗಳು ತಂಡದ ಸರಾಸರಿ ಅಂಕಗಳನ್ನು ಮಾತ್ರ ನೋಡುತ್ತಾರೆ. ನಿರ್ದೇಶಕರು ಮತ್ತು ಮಾನವ ಸಂಪನ್ಮೂಲ ವಿಭಾಗದವರು ಒಟ್ಟಾರೆ ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡುತ್ತಾರೆ. ಯಾರೂ ವೈಯಕ್ತಿಕ ಉತ್ತರಗಳನ್ನು ನೋಡಲಾಗುವುದಿಲ್ಲ.',
      minimumGroupTitle: 'ಕನಿಷ್ಠ ಗುಂಪಿನ ನಿಯಮ (N = 5)',
      minimumGroupBody:
        'ನಿಮ್ಮ ತಂಡದಲ್ಲಿ 5 ಕ್ಕಿಂತ ಕಡಿಮೆ ಜನರು ಪ್ರತಿಕ್ರಿಯಿಸಿದರೆ, ಫಲಿತಾಂಶಗಳನ್ನು ಮರೆಮಾಡಲಾಗುತ್ತದೆ ಅಥವಾ ಮುಖ್ಯ ವಿಭಾಗಕ್ಕೆ ಸೇರಿಸಲಾಗುತ್ತದೆ.',
      retentionTitle: 'ಡೇಟಾ ಧಾರಣೆ ಅವಧಿ',
      retentionBody:
        'ಸಮೀಕ್ಷೆ ಮುಕ್ತಾಯವಾದ 90 ದಿನಗಳ ನಂತರ ವೈಯಕ್ತಿಕ ಉತ್ತರಗಳು ಮತ್ತು ಟೋಕನ್‌ಗಳನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲಾಗುತ್ತದೆ.',
      purposeLimitTitle: 'ಉದ್ದೇಶದ ಮಿತಿ',
      purposeLimitBody:
        'ಫಲಿತಾಂಶಗಳನ್ನು ಕಾರ್ಯಕ್ಷಮತೆ ಮೌಲ್ಯಮಾಪನ, ಬಡ್ತಿ, ವೇತನ ಅಥವಾ ನೌಕರಿಯಿಂದ ತೆಗೆದುಹಾಕಲು ಎಂದಿಗೂ ಬಳಸಲಾಗುವುದಿಲ್ಲ.',
      grievanceTitle: 'ದೂರು ಸಂಪರ್ಕ',
      grievanceBody:
        'ಗೌಪ್ಯತೆ ವಿಚಾರಣೆಗಳಿಗಾಗಿ ಸಂಪರ್ಕಿಸಿ: ethics-pulse@company.com (ಗೌಪ್ಯತಾ ಅಧಿಕಾರಿ).',
      misconductWarningTitle: 'ದುರ್ನಡತೆ ದೂರು ನೀಡುವ ಮಾರ್ಗವಲ್ಲ',
      misconductWarningBody:
        'ಈ ಸಮೀಕ್ಷೆಯು ಅನಾಮಧೇಯವಾಗಿದೆ. ಕಿರುಕುಳ ಅಥವಾ ನೈತಿಕ ಉಲ್ಲಂಘನೆಗಳ ಬಗ್ಗೆ ದೂರು ನೀಡಲು ಕಂಪನಿಯ ಆಂತರಿಕ ಸಮಿತಿ (POSH) ಅಥವಾ ವಿಸಿಲ್‌ಬ್ಲೋವರ್ ಪೋರ್ಟಲ್ ಬಳಸಿ.',
      startButton: 'ನನಗೆ ಅರ್ಥವಾಯಿತು: ಸಮೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ',
    },
    survey: {
      title: 'ತ್ರೈಮಾಸಿಕ ಎಂಜಿನಿಯರಿಂಗ್ ಪಲ್ಸ್',
      subtitle: '2 ನಿಮಿಷಗಳಿಗಿಂತ ಕಡಿಮೆ ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ. ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು ಐಚ್ಛಿಕವಾಗಿವೆ.',
      skippableNote: 'ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಬಿಟ್ಟುಬಿಡಬಹುದು.',
      scaleLabels: {
        1: 'ಬಲವಾಗಿ ಒಪ್ಪುವುದಿಲ್ಲ',
        2: 'ಒಪ್ಪುವುದಿಲ್ಲ',
        3: 'ತಟಸ್ಥ',
        4: 'ಒಪ್ಪುತ್ತೇನೆ',
        5: 'ಬಲವಾಗಿ ಒಪ್ಪುತ್ತೇನೆ',
      },
      openQuestionTitle: 'ಕಾರ್ಯಾಚರಣೆ ಮತ್ತು ಸಲಕರಣೆಗಳ ಪ್ರತಿಕ್ರಿಯೆ (ಐಚ್ಛಿಕ)',
      openQuestionSubtext:
        'ಯಾವ ಬದಲಾವಣೆಯು ನಿಮ್ಮ ದೈನಂದಿನ ಎಂಜಿನಿಯರಿಂಗ್ ಕೆಲಸವನ್ನು ಸುಧಾರಿಸಬಹುದು? ದಯವಿಟ್ಟು ಯಾರ ಹೆಸರನ್ನೂ ನಮೂದಿಸಬೇಡಿ.',
      openQuestionPlaceholder: 'ತಾಂತ್ರಿಕ ಅಥವಾ ಪ್ರಕ್ರಿಯೆ ಸುಧಾರಣೆಯನ್ನು ವಿವರಿಸಿ...',
      charCount: 'ಅಕ್ಷರಗಳು ಬಾಕಿ ಇವೆ',
      submitButton: 'ಅನಾಮಧೇಯ ಉತ್ತರ ಸಲ್ಲಿಸಿ',
      submittingButton: 'ಸುರಕ್ಷಿತವಾಗಿ ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
    },
    thankYou: {
      title: 'ಪ್ರತಿಕ್ರಿಯೆ ದಾಖಲಾಗಿದೆ',
      message:
        'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಟೋಕನ್ ರದ್ದುಗೊಂಡಿದೆ ಮತ್ತು ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಅನಾಮಧೇಯವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.',
      privacyReminder: 'ನೀವು ಈಗ ಈ ಟ್ಯಾಬ್ ಅನ್ನು ಮುಚ್ಚಬಹುದು.',
    },
    questions: {
      q1: {
        domain: 'ಕೆಲಸದ ಉದ್ದೇಶ',
        text: 'ನನ್ನ ಪ್ರಸ್ತುತ ತಾಂತ್ರಿಕ ಕಾರ್ಯಗಳು ಗ್ರಾಹಕರ ವ್ಯಾಪಾರ ಗುರಿಗಳಿಗೆ ಹೇಗೆ ಕೊಡುಗೆ ನೀಡುತ್ತವೆ ಎಂಬುದನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ.',
      },
      q2: {
        domain: 'ಕಾರ್ಯಾಚರಣೆಯ ಬೆಂಬಲ',
        text: 'ನನ್ನ ಕಾರ್ಯಗಳನ್ನು ಅತಿಯಾದ ವಿಳಂಬವಿಲ್ಲದೆ ಪೂರ್ಣಗೊಳಿಸಲು ಅಗತ್ಯವಾದ ಪರಿಕರಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶನ ನನ್ನ ಬಳಿ ಇದೆ.',
      },
      q3: {
        domain: 'ಕೌಶಲ್ಯ ಬೆಳವಣಿಗೆ',
        text: 'ಕಳೆದ ಮೂರು ತಿಂಗಳುಗಳಲ್ಲಿ ನನ್ನ ವೃತ್ತಿಜೀವನವನ್ನು ಮುನ್ನಡೆಸುವ ತಾಂತ್ರಿಕ ಕೌಶಲ್ಯಗಳನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಲು ನನಗೆ ಅವಕಾಶಗಳು ಸಿಕ್ಕಿವೆ.',
      },
      q4: {
        domain: 'ಮಾನಸಿಕ ಸುರಕ್ಷತೆ',
        text: 'ನನಗೆ ಯಾವುದೇ ಕೆಲಸದ ಸಮಸ್ಯೆ ಎದುರಾದರೆ, ಪರಿಣಾಮಗಳ ಭಯವಿಲ್ಲದೆ ನನ್ನ ಲೀಡ್ ಬಳಿ ಪ್ರಸ್ತಾಪಿಸಬಹುದು.',
      },
      q5: {
        domain: 'ಕೆಲಸದ ಹೊರೆ ಸಮತೋಲನ',
        text: 'ನನ್ನ ದೈನಂದಿನ ಕೆಲಸದ ಹೊರೆ ನನಗೆ ನಿಯಮಿತ ಕೆಲಸದ ಸಮಯದ ನಂತರ ವಿಶ್ರಾಂತಿ ಪಡೆಯಲು ಅನುವು ಮಾಡಿಕೊಡುತ್ತದೆ.',
      },
      q6: {
        domain: 'ತಂಡದ ಶಿಫಾರಸು',
        text: 'ನಾನು ನನ್ನ ಡೆಲಿವರಿ ತಂಡವನ್ನು ಸಹೋದ್ಯೋಗಿಗಳಿಗೆ ಕೆಲಸ ಮಾಡಲು ಉತ್ತಮ ಸ್ಥಳವಾಗಿ ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ.',
      },
    },
  },
};
