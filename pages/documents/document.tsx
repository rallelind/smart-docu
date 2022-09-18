import Document from "../../components/Document";
import SideNavBar from "../../components/layout/SideNavBar";

export async function getStaticProps() {

  const { ENVIRONMENT } = process.env;

  const res = await fetch(`${ENVIRONMENT}/api/pdf-data`)
  const document = await res.json()

  return {
    props: {
      document,
    },
  }
}

export default function Home({ document }) {

  return (
    <div className="flex">
      <div className="flex-initial w-64">
        <SideNavBar />
      </div>
      <div className="flex justify-center w-full">
        <Document 
            document={document}
          />
      </div>
    </div>
  )

}
