"use client";

import { IoIosMore } from "react-icons/io";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { useActionState, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IShuttlecockTube } from "@/types";
import {
  deleteShuttlecockTubeAction,
  renameShuttlecockTubeAction,
} from "@/actions/shuttlecockTube";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

export default function ShuttlecockTubeItem({
  shuttlecockTube,
  remaining,
}: {
  shuttlecockTube: IShuttlecockTube;
  remaining: number;
}) {
  const [mode, setMode] = useState<"rename" | "delete" | null>(null);
  const [renameState, renameAction, renamePending] = useActionState(
    renameShuttlecockTubeAction,
    {
      success: false,
      error: null,
    }
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteShuttlecockTubeAction,
    {
      success: false,
      error: null,
    }
  );

  useEffect(() => {
    if (renameState?.success) {
      toast.success("Renamed successfully");
      setMode(null);
    }

    if (deleteState?.success) {
      toast.success("Deleted successfully");
      setMode(null);
    }
  }, [renameState, deleteState]);

  return (
    <div className="bg-secondary-bg border border-border rounded-sm px-4 py-4 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        {/* name */}
        <p className={`${mode === "rename" && "hidden"} text-sm`}>
          {shuttlecockTube.name}
        </p>

        {/* input */}
        {!mode && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IoIosMore size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setMode("rename")}>
                <MdEditSquare color="#fafafa" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("delete")}>
                <MdDelete color="#fafafa" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* rename form */}
        <form
          action={renameAction}
          className={`flex items-center justify-between gap-x-4 w-full ${
            mode !== "rename" && "hidden"
          }`}
        >
          <Input
            name="name"
            className="flex-1 bg-secondary-bg border border-border text-sm"
            placeholder="Name"
            defaultValue={shuttlecockTube.name}
          />
          <Input
            hidden
            name="shuttlecockTubeId"
            defaultValue={shuttlecockTube.id}
          />

          <div className="flex items-center gap-x-4">
            <Button type="submit" className="text-xs">
              {renamePending ? <ClipLoader size={12} /> : "Confirm"}
            </Button>
            <Button
              type="button"
              className="bg-secondary-bg text-white border border-border hover:bg-primary-bg text-xs"
              onClick={() => setMode(null)}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* delete form */}
        <form
          action={deleteAction}
          className={`flex items-center gap-x-4 ${
            mode !== "delete" && "hidden"
          }`}
        >
          <Input
            hidden
            name="shuttlecockTubeId"
            defaultValue={shuttlecockTube.id}
          />
          <Button
            type="submit"
            className="bg-rose-500 text-white hover:bg-rose-600 text-xs"
          >
            {deletePending ? (
              <ClipLoader size={12} color="#fafafa" />
            ) : (
              "Confirm"
            )}
          </Button>
          <Button
            type="button"
            className="bg-secondary-bg text-white border border-border hover:bg-primary-bg text-xs"
            onClick={() => setMode(null)}
          >
            Cancel
          </Button>
        </form>
      </div>

      {/* price */}
      <p className="text-sm">Price: {shuttlecockTube.price} Baht</p>

      {/* remaining */}
      <p className="text-sm">Remaining: {remaining}</p>

      {renameState.error && (
        <p className="text-sm text-red-500">{renameState.error}</p>
      )}
    </div>
  );
}
