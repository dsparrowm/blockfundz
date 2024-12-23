
const StatisticCard = ({label, value}) => {
  return (
    <div className="bg-[#f5f5f5] p-[20px] rounded-[8px] shadow-xl w-[170px]">
        <h3 className="text-[24px] font-extrabold text-orange-400 bg-[#f5f5f5] text-center">{value}</h3>
        <p className="mb-[10px] text-[18px] text-slate-500 bg-[#f5f5f5] text-center text-opacity-50">{label}</p>
    </div>
  )
}

export default StatisticCard