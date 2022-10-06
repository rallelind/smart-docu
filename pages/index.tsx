import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"


export default function Home() {

    const session = useSession()
    const router = useRouter()

    const landingPageNavigation = () => {
        if(session.status === "unauthenticated") {
            router.push("/api/auth/signin")
        } else {
            router.push("/documents/upload-document")
        }
    }

    return (
        <div>
            <div className="flex justify-center items-center">
                <Image 
                    src="/Documents-landing-page.jpg" 
                    width={400}
                    height={400}
                />
            </div>
            <div>
                <h2 className="text-center font-medium">Start uploading your PDF's</h2>
                <p className="text-center mt-5">
                    Sign in below and to upload your PDF. It does matter if they are 
                    scanned or not, they will be interpreted so you can mark text and 
                    comment your notes
                </p>
            </div>
            <div className="w-full flex justify-center mt-10">
                <button onClick={() => landingPageNavigation()} type="button" className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"}`}>
                    {session.status === "authenticated" ? "Go to your documents" : "Sign in"}
                </button>
            </div>
        </div>
    )
}