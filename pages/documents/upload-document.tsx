import SideNavBar from "../../components/layout/SideNavBar"
import UploadFile from "../../components/UploadFile"

export default function UploadDocument() {
    return (
        <div className="flex">
            <div className="flex-initial w-64">
                <SideNavBar />
            </div>
            <div className="flex justify-center w-full">
                <UploadFile />
            </div>
        </div>
    )
}