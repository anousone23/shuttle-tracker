import Link from "next/link";

import Header from "@/components/Header";
import ShuttlecockTubeItem from "@/components/ShuttlecockTubeItem";
import { Button } from "@/components/ui/button";
import { getAllShuttlecockTubes } from "@/api/server/shuttlecockTube";
import { getRemainingShuttlecocks } from "@/api/server/shuttlecock";

export default async function InventoryPage() {
  const shuttlecock_tubes = await getAllShuttlecockTubes();

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-y-8">
      <Header>
        <p className="font-bold">
          Shuttle cock tube: {shuttlecock_tubes.length}
        </p>
      </Header>

      {/* Shuttle cock tube list */}
      <div className="flex-1 flex flex-col gap-y-4 overflow-y-auto">
        {shuttlecock_tubes.length > 0 ? (
          shuttlecock_tubes.map(async (item) => {
            const remaining = await getRemainingShuttlecocks(item.id);

            return (
              <ShuttlecockTubeItem
                key={item.id}
                shuttlecockTube={item}
                remaining={remaining}
              />
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center">
            Your inventory is emtpy.
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <Button asChild>
          <Link href="/inventory/add">Add new tube</Link>
        </Button>
      </div>
    </div>
  );
}
