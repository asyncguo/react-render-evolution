"use server";

export async function getNoteAction() {
  return await (await fetch('http://localhost:3019/todos')).json()
}
