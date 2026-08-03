import { StateSchema, MessagesValue, type GraphNode, StateGraph, START, END } from "@langchain/langgraph";
import {z} from "zod";
import {mistralModel, cohereModel, geminiModel} from "./model.ai.js"
import {SystemMessage, HumanMessage} from "langchain";

const state = new StateSchema({
    problem: z.string().default(""),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
    })
})

const solutionNode: GraphNode<typeof state> = async (state) => {

    const [mistralResponse, cohereResponse] = await Promise.all([
        mistralModel.invoke(state.problem),
        cohereModel.invoke(state.problem),
    ])

    return {
        solution_1: mistralResponse.text,
        solution_2: cohereResponse.text
    }
}

const judgeNode: GraphNode<typeof state> = async (state) => {

    const {problem, solution_1, solution_2} = state;

    const judge = geminiModel.withStructuredOutput(
        z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
            solution_1_reasoning: z.string(),
            solution_2_reasoning: z.string()
        }),
    );

    const judgeResponse = await judge.invoke([
        new SystemMessage(`
            You are an impartial AI judge.
            Compare two responses to the same user problem.
            Evaluate each response independently on:
            - Accuracy
            - Completeness
            - Relevance
            - Clarity
            - Technical Correctness
            - Helpfulness
            Do not favor either model.
            Score each response from 0 to 10.
            Provide concise reasoning explaining the score for each response.
        `),
        new HumanMessage(`
            You are provided with one user problem and two AI-generated responses.
            Problem:
            ${problem}
            Solution 1:
            ${solution_1}
            Solution 2:
            ${solution_2}
            Evaluate each response independently based on the evaluation criteria specified in the system instructions. Assign a score from 0 to 10 for each response and provide concise reasoning that clearly justifies each score.
        `)
    ])

    return {
        judge: judgeResponse
    }
}

const graph = new StateGraph(state)
    .addNode("solution_node", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution_node")
    .addEdge("solution_node", "judge_node")
    .addEdge("judge_node", END)
    .compile()

export default async function (problem: string) { 

    const result = await graph.invoke({
        problem: problem
    })

    return result

}