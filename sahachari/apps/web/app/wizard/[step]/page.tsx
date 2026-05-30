// import StepSafety from '../../../components/wizard/StepSafety';
// import StepLocation from '../../../components/wizard/StepLocation';
// import StepStory from '../../../components/wizard/StepStory';
// import StepViolence from '../../../components/wizard/StepViolence';
// import StepPeople from '../../../components/wizard/StepPeople';
// import StepReview from '../../../components/wizard/StepReview';
// import WizardShell from '../../../components/wizard/WizardShell';

// const STEPS: Record<string, React.ReactNode> = {
//   '1': <StepSafety />,
//   '2': <StepLocation />,
//   '3': <StepStory />,
//   '4': <StepViolence />,
//   '5': <StepPeople />,
//   '6': <StepReview />,
// };

// export default function WizardPage({ params }: { params: { step: string } }) {
//   return (
//     <WizardShell>
//       {STEPS[params.step] ?? <StepSafety />}
//     </WizardShell>
//   );
// }

'use client';
import { use } from 'react';
import StepSafety from '../../../components/wizard/StepSafety';
import StepLocation from '../../../components/wizard/StepLocation';
import StepStory from '../../../components/wizard/StepStory';
import StepViolence from '../../../components/wizard/StepViolence';
import StepPeople from '../../../components/wizard/StepPeople';
import StepReview from '../../../components/wizard/StepReview';
import WizardShell from '../../../components/wizard/WizardShell';

const STEPS: Record<string, React.ReactNode> = {
  '1': <StepSafety />,
  '2': <StepLocation />,
  '3': <StepStory />,
  '4': <StepViolence />,
  '5': <StepPeople />,
  '6': <StepReview />,
};

export default function WizardPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = use(params);
  return (
    <WizardShell>
      {STEPS[step] ?? <StepSafety />}
    </WizardShell>
  );
}