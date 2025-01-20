import { Suspense } from "react";
import { getClubs } from "./lib/clubs";
import LoadingPage from "./components/LoadingPage";
import ClientWrapper from "./components/ClientWrapper";
import ErrorPage from "./components/ErrorPage";

export default async function Home() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <MainContent />
    </Suspense>
  );
}

  async function MainContent() {
    try {
      const clubs = await getClubs();
      return <ClientWrapper clubs={clubs} />;
    } catch (error) {
      
      return <ErrorPage error={error}/>;
    }
  }