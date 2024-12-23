import { features } from '../constants';
import { blogo } from '../assets/images';



const Features = () => {
  return (
    <div className='max-container mx-auto grid grid-cols-2 gap-8'>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-500 text-gradient">
            Why choose us?
          </h2>
          <img src={blogo} alt="" className='mx-auto'/>
        </div>

        {/* Features Grid */}
        <div className="grid grid-flow-row gap-3 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white-400">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Features