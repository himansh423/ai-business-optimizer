import { auth } from "../../auth"

const LandingPage = async () => {
  const session = await auth();

  console.log("Home -> Session: ", session);
  return (
    <div>
      clkjd c
    </div>
  )
}

export default LandingPage
