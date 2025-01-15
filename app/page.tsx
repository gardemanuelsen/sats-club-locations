import { Suspense } from "react";
import ListView from "./components/ListView";
import MapView from "./components/MapView";
import { getClubs } from "./lib/clubs";
import LoadingPage from "./components/LoadingPage";
import ClientWrapper from "./components/ClientWrapper";

export default async function Home() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <MainContent />
    </Suspense>
  );

  async function MainContent() {
    const clubs = await getClubs();

    return <ClientWrapper clubs={clubs} />;
  }
}
