interface InfoItemProps {
    label: string;
    value: React.ReactNode;
  }
  
  const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
    <div className="flex flex-col gap-1">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-white text-sm">{value || '—'}</span>
    </div>
);
  
export default InfoItem