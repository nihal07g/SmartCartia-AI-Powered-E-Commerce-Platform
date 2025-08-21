import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execPromise = promisify(exec)

export async function GET(request) {
  try {
    // Call the Python script to get the questions
    const scriptPath = path.join(process.cwd(), "ml", "product_recommender.py")

    // Execute the Python script with --get-questions flag
    const { stdout, stderr } = await execPromise(`python ${scriptPath} --get-questions`)

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error getting questions" }, { status: 500 })
    }

    // Parse the output
    const questions = JSON.parse(stdout)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { answers } = body

    if (!answers) {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 })
    }

    // Call the Python script to get recommendations
    const scriptPath = path.join(process.cwd(), "ml", "product_recommender.py")

    // Write answers to a temporary file for the Python script to read
    const tempFilePath = path.join(process.cwd(), "temp", `answers_${Date.now()}.json`)
    fs.writeFileSync(tempFilePath, JSON.stringify(answers))

    // Execute the Python script
    const { stdout, stderr } = await execPromise(`python ${scriptPath} --recommend --input ${tempFilePath}`)

    // Clean up temporary file
    fs.unlinkSync(tempFilePath)

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error getting recommendations" }, { status: 500 })
    }

    // Parse the output
    const recommendations = JSON.parse(stdout)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
