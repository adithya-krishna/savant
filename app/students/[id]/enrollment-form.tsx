'use client';

import PreferredSlotSelection from './preferred-slots-selection';

const EnrollmentForm = ({ id }: { id: string }) => {
  return (
    <div className="w-full">
      <p>{id}</p>
      <PreferredSlotSelection />
      {/* <ButtonToggleGroup items={timeSlots} /> */}
    </div>
  );
};

export default EnrollmentForm;
