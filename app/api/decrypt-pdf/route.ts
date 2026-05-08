// app/api/decrypt-pdf/route.ts
import { exec } from "child_process";
import { writeFile, readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const bytes = await req.arrayBuffer();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const inPath = path.join(tmpdir(), `pdf-in-${id}.pdf`);
  const outPath = path.join(tmpdir(), `pdf-out-${id}.pdf`);

  try {
    await writeFile(inPath, Buffer.from(bytes));

    // --decrypt removes all encryption including object-level AES/RC4
    // works even without a password on permission-only encrypted PDFs
    await execAsync(`qpdf --decrypt "${inPath}" "${outPath}"`);

    const decrypted = await readFile(outPath);

    return new Response(decrypted, {
      status: 200,
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (err) {
    console.error("qpdf failed:", err);
    return new Response(
      JSON.stringify({ error: "Failed to decrypt PDF", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } finally {
    // always clean up tmp files
    await unlink(inPath).catch(() => {});
    await unlink(outPath).catch(() => {});
  }
}
