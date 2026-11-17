# Repeat Leads & Multi-Step Forms

How Granite Manager handles a lead that is sent more than once: a second form, a quiz, a showroom sign-in, or a returning customer.

---

## Matching existing leads

Every request to `POST /v1/webhooks/new-lead-form/{company_id}` is first matched against the company's existing customers:

| Match on | How |
|---|---|
| `email` | Same email address, ignoring upper/lower case |
| `phone` | Same last 10 digits, ignoring formatting (`+1 (317) 555-1212` = `317-555-1212`) |

A match on **either** field is enough. If neither `email` nor `phone` is sent, the request always creates a new lead.

## What happens on a match

No duplicate customer is created. Instead:

1. **The new answers are added to the existing customer.** Every field that is still empty on the customer is filled in from the request.
2. **The deal is made active again** and moved to the first stage (**Not Contacted Yet**).
3. **The assigned sales rep and the managers are notified** that the lead came back.
4. If the customer had no open deal (a past customer), **a new deal is created** for them.

The response is the same `201 Created` as for a new lead.

<p class="stats-warning" style="color:#dc2626;background:#fef2f2;border:1px solid #dc2626;border-radius:6px;padding:0.875rem 1rem;font-weight:600;line-height:1.5;">
A repeat request fills in empty fields only. It never overwrites a value that is already saved, and it does not change the lead's <code style="color:#b91c1c;font-weight:700;">name</code>.
</p>

---

## Multi-step forms (contact form + quiz)

You can send a contact form and a separate quiz as two requests. The answers end up on the same lead as long as **both requests include the same `email` or `phone`**.

**Step 1 — contact form**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone": "+15551234567",
  "referral_source": "website",
  "form_name": "contact_page"
}
```

**Step 2 — quiz** (same email, so it attaches to John's lead)

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "referral_source": "website",
  "form_name": "kitchen_quiz",
  "remodel_type": "Kitchen Countertops",
  "project_size": "Approx 60 sq ft",
  "start_date": "Next month",
  "sink": "Undermount",
  "details": "Quiz: prefers light colors; has existing cabinets"
}
```

> **Tip:** If your quiz asks questions that have no field of their own, put them in `details` or `your_message` as `Question: answer` lines.

> **Tip:** The quiz can carry the email or phone in a hidden field filled from step 1, so the visitor doesn't type it twice.

---

## Showroom visits and returning customers

A showroom sign-in form, or any later form, works the same way: send it to the same endpoint with the visitor's email or phone, and it is linked to their earlier submission.
