import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { HelpCircle, User2 } from "lucide-react"

import { db } from "@/lib/db"
import { getAvailableCount } from "@/lib/org-limits"
import { checkSubscription } from "@/lib/subscription"

import { Hint } from "@/components/hint"
import { Skeleton } from "@/components/ui/skeleton"
import { FormPopover } from "@/components/form/form-popover"
import { MAX_FREE_BOARD } from "@/constants/boards"
 
export const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="size-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm size-full p-2 overflow-hidden"
            style={{backgroundImage: `url(${board.imageThumbUrl})`}}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition "/>
            <p className="relative font-semibold text-white">
              {board.title}
            </p>
          </Link>
        ))}
        <FormPopover sideOffset={10} side="right">
          <div
            role="button"
            className="aspect-video relative size-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm ">Create new board</p>
            <span className="text-xs">
              {isPro ? "Unlimited" : `${MAX_FREE_BOARD - availableCount} remaining`}
            </span>
            <Hint
              sideOffset={40}
              description={`
              Free Workspaces can have up to 5 open boards. For unlimited board upgrade this workspace.
              `}
            >
              <HelpCircle
                className="absolute bottom-2 right-2 size-[14px]"
              />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-grid-cols-4 gap-4">
      <Skeleton className="aspect-video size-full p-2" />
      <Skeleton className="aspect-video size-full p-2" />
      <Skeleton className="aspect-video size-full p-2" />
      <Skeleton className="aspect-video size-full p-2" />
      <Skeleton className="aspect-video size-full p-2" />
      <Skeleton className="aspect-video size-full p-2" />
      <Skeleton className="aspect-video size-full p-2" />
      <Skeleton className="aspect-video size-full p-2" />
    </div>
  )
}