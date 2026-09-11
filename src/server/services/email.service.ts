export async function sendEmail(input: { to: string; subject: string; html: string }) {
  console.info("Email queued", input.to, input.subject);
  return { id: crypto.randomUUID() };
}
