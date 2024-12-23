
const DashboardCard = ({coin}) => (
  <div className="relative backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-lg border border-white/20 max-w-md w-full">
    {/* <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-lg -z-10" />
    <div className="flex justify-start items-center ">
      <h2 className="text-[12px] font-bold text-red-500 mb-4">
        {name || 'Bitcoin Balance'}
      </h2>
      <div className="justify-end">
        <img src={icon} alt="bitcoin icon" /> 
      </div>
    </div>
    <div className="flex items-center">
      <span className="text-gray-400 ml-2">$</span>
      <span className={`text-4xl font-bold ${color}`}>
        {balance || '5000'}
      </span>
      
    </div> */}

    <h2 className="text-[19px] text-white-400">
      {`${coin.name} Balance`}
    </h2>
    <p className="text-white-400 ">{coin.balance}</p>
  </div>
  );

  export default DashboardCard