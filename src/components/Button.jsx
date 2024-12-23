/* eslint-disable react/prop-types */

const Button = ({label, iconUrl, iconClass, onClick}) => {
  return (
    <button className={iconClass} onClick={onClick}>
      {label}
      <img src={iconUrl} className="border-none"/>
    </button>
  )
}

export default Button