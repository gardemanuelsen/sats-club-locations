import MapView from "./components/MapView";



export default async function Home() {



  return (
    <div className="flex flex-col items-center h-dvh gap-12 m-4">
      <div>
      <h1 className="text-4xl font-bold">Sats Club Locations</h1>
      </div>
          <MapView/>
    </div>
  );
}
