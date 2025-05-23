interface StatProps {
  title: string | null | 0;
  subtitle: string | null | 0;
}

const Stat = ({ title, subtitle }: StatProps) => {
  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">{title ?? '-'}</div>
      <p className="text-xs text-muted-foreground">{subtitle ?? '-'}</p>
    </div>
  );
};

export default Stat;
