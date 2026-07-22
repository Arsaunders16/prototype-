import type { Idea } from "./types";

export type WorkflowData = {
  researchText: string;
  researchFileName: string | null;
  ideas: Idea[];
  createdAt: string;
  updatedAt: string;
};

export type SavedWorkflow = {
  id: string;
  title: string;
  workflowName: string;
  completedDate: string;
  data: WorkflowData;
};

export function createEmptyWorkflowData(): WorkflowData {
  const timestamp = new Date().toISOString();

  return {
    researchText: "",
    researchFileName: null,
    ideas: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}