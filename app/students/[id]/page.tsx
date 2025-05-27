interface StudentProfileProps {
  params: Promise<{ id: string }>;
}

const StudentProfile = async ({ params }: StudentProfileProps) => {
  const { id } = await params;

  return <div className="flex flex-col w-full">{id}</div>;
};

export default StudentProfile;
