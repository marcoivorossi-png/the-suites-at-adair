export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const required = ["full_name", "email"];
    for (const field of required) {
      if (!data[field] || !String(data[field]).trim()) {
        return Response.json({ ok: false, error: `Missing ${field}` }, { status: 400 });
      }
    }

    // Honeypot support.
    if (data.website) {
      return Response.json({ ok: true });
    }

    const apiKey = context.env.RESEND_API_KEY;
    const toEmail = context.env.INQUIRY_TO_EMAIL;
    const fromEmail = context.env.INQUIRY_FROM_EMAIL || "The Suites at Adair <onboarding@resend.dev>";

    if (!apiKey || !toEmail) {
      return Response.json(
        { ok: false, error: "Inquiry email service is not configured yet." },
        { status: 503 }
      );
    }

    const safe = (value) =>
      String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    const rows = [
      ["Name", data.full_name],
      ["Preferred suite", data.preferred_suite],
      ["Business", data.business_name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Business type", data.business_type],
      ["Move-in timing", data.move_in_timing],
      ["Leased a suite before", data.leased_suite_before],
      ["Preferred contact", data.preferred_contact_method],
      ["Instagram", data.instagram],
      ["Message", data.message],
    ];

    const html = `
      <h2>New Suites at Adair inquiry</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="font-weight:700;border-bottom:1px solid #ddd">${safe(label)}</td>
            <td style="border-bottom:1px solid #ddd">${safe(value)}</td>
          </tr>`).join("")}
      </table>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: data.email,
        subject: `New leasing inquiry from ${data.full_name}`,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend error:", detail);
      return Response.json({ ok: false, error: "Email delivery failed." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, error: "Unable to submit inquiry." }, { status: 500 });
  }
}
