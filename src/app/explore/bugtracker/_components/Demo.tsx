"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import type { FC } from "react";
import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban";
import { exampleStatuses } from "./constant";
import { GetBugs } from "../../../../../actions/GetBugs";
import { UpdateBugStatus } from "../../../../../actions/UpdateBugStatus";
import { DeleteBug } from "../../../../../actions/DeleteBug";
import { useToast } from "@/hooks/use-toast";
import { GetUserDetails } from "../../../../../actions/GetUserDetails";
import { useRouter } from "next/navigation";

const KanbanExample: FC = () => {
  const [features, setFeatures] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<string | null>(null);
  const { toast } = useToast();

  useLayoutEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await GetUserDetails();
        if (res.status === false) {
          throw new Error(res.msg);
        }
        setUserDetails(res?.decodeCookieValue?.id);
      } catch (error) {
        toast({
          title: "Login Kro",
          description: "Please Login to explore this.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  useLayoutEffect(() => {
    const fetchBugs = async () => {
      setLoading(true);
      try {
        const res = await GetBugs();
        if (res.status === false) {
          throw new Error(res.msg);
        }
        setFeatures(res.data as any);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, []);

  if (features === null) {
    return null;
  }

  const handleDelete = async (id: string) => {
    try {
      console.log("Worked");
      const res = await DeleteBug(id);
      if (res?.status === false) {
        throw new Error(res.msg);
      }
      setFeatures(features.filter((feature) => feature.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const statusName = over.id as string;
    const activeFeatureId = active.id as string;

    setFeatures(
      features.map((feature) => {
        if (feature.id === activeFeatureId) {
          return {
            ...feature,
            status: statusName,
            updatedAt: new Date().toISOString(),
          };
        }
        return feature;
      })
    );

    try {
      const updateStatus = await UpdateBugStatus({
        status: statusName,
        id: activeFeatureId,
      });

      if (updateStatus.status === false) {
        throw new Error(updateStatus.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KanbanProvider
      className="w-full max-h-fit  p-4 md:p-6"
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-wrap gap-4 md:gap-6">
        {exampleStatuses.map((status) => (
          <KanbanBoard
            key={status.name}
            id={status.name}
            className="flex-1 min-w-[250px] md:min-w-[300px] max-w-[100%] md:max-w-[calc(50%-1rem)] lg:max-w-[calc(33.333%-1rem)]"
          >
            <KanbanHeader name={status.name} color={status.color} />
            <KanbanCards>
              {features
                .filter((feature) => feature.status === status.name)
                .map((feature, index) => (
                  <KanbanCard
                    key={feature.id}
                    id={feature.id}
                    name={feature.bugText}
                    parent={status.name}
                    index={index}
                    className="p-2 md:p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-start gap-x-4 justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <p className="m-0 flex-1 text-black font-medium text-sm">
                          {feature.bugText}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(feature.id);
                        }}
                        className="p-0 border-0 bg-transparent"
                      >
                        <X className="text-red-500 min-w-5 md:min-w-8 cursor-pointer hover:text-red-600" />
                      </button>
                    </div>
                    <p className="m-0 text-xs text-muted-foreground">
                      {format(new Date(feature.startDate), "MMM d")} -{" "}
                      {format(new Date(feature.endDate), "MMM d, yyyy")}
                    </p>
                  </KanbanCard>
                ))}
            </KanbanCards>
          </KanbanBoard>
        ))}
      </div>
    </KanbanProvider>
  );
};

export { KanbanExample };
