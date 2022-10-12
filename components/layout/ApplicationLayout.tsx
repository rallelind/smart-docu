import SideNavBar from "../navbars/SideNavBar"

const ApplicationLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="flex-none w-64 mr-5">
                <SideNavBar />
            </div>
            {children}
        </div>
    )
}

export default ApplicationLayout