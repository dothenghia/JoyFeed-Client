
import logojoyfeed from '../../assets/joyfeed.png'

const Header = ({ open, setOpen }) => {
    // console.log('[Header] render')

    return (
        <div className="h-12 px-3 bg-primary flex justify-start items-center">

            <button
                className="px-1 py-1 rounded-md text-white hover:bg-primary-hover"
                onClick={() => setOpen(!open)}
            >
                {
                    open ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                }
            </button>

            <img
                src={logojoyfeed}
                alt="logo"
                className="h-8 absolute left-1/2 transform -translate-x-1/2"
            />
        </div>
    )
}

export default Header