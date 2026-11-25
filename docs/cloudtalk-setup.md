# CloudTalk Setup

Granite Manager uses [CloudTalk](https://www.cloudtalk.io) for phone calls and SMS. Setup is done in the **CloudTalk Dashboard** and in Granite — not in the CloudTalk Developer Portal.

CloudTalk Dashboard: [https://dashboard.cloudtalk.io](https://dashboard.cloudtalk.io)

You need a **CloudTalk Admin** login for API keys, users, and numbers. If you are not a CloudTalk Admin, ask the person who manages CloudTalk for your company to complete those steps and send you the Agent ID and phone number.

Granite cannot turn CloudTalk on by itself. Finish the CloudTalk account, numbers, and (for US SMS) **A2P 10DLC** registration below **before** you expect calling or texting to work in the CRM.

---

## Before you can use CloudTalk

Do this in CloudTalk first. Until these are done, Granite will not have a working phone line or outbound SMS, even if Agent ID fields are filled in.

### 1. Create and activate the CloudTalk account

1. Sign up at [cloudtalk.io](https://www.cloudtalk.io) / [dashboard.cloudtalk.io](https://dashboard.cloudtalk.io).
2. Open the activation email and click the link.

CloudTalk may **auto-approve** you, or they may ask for **manual business verification**. If you get an email such as *Activate your CloudTalk account*, reply with the documents they request. Typical items: legal name, trading name, business registration number, website, a business social profile, and a registration document (for US companies often a **W-9**, IRS certificate, Secretary of State filing, or certificate of incorporation). Manual review is usually **24–48 hours**. CloudTalk’s article: [Account Activation Requirements](https://help.cloudtalk.io/en/articles/11991629-account-activation-requirements).

You cannot log in, buy numbers, or connect Granite until the account is activated.

### 2. Use a paid plan that includes API access

Granite talks to CloudTalk through the **API**. API keys exist on **Essential** and above (Expert / Custom). **Starter** has limited API access, no Workflow Automations, and is not enough for this CRM integration.

- Upgrade in CloudTalk **Account → Billing** (or with your CloudTalk account manager).
- Each CloudTalk user is a **paid seat**, including admins who only change settings.
- SMS/MMS is **not** included in the subscription. It is billed from CloudTalk **credit**. Keep credit on the account or outbound SMS stops.

CloudTalk: [Understanding pricing plans](https://help.cloudtalk.io/en/articles/13130387-understanding-pricing-plans-and-what-they-include), [SMS, MMS, and WhatsApp pricing](https://help.cloudtalk.io/en/articles/14652499-sms-mms-and-whatsapp-pricing).

### 3. Get at least one phone number (SMS-capable if you will text)

New accounts usually get a **trial/test number**. For production:

1. Dashboard → **Numbers** → **Get a number**.
2. Pick the country. US and Canada **local** and **toll-free** numbers can be bought instantly (no extra documents).
3. Filter by **Capability** so you only see **SMS** (and **MMS** if you need pictures).
4. Purchase. The number appears under **Numbers**.

Or **port** an existing number into CloudTalk (separate porting request; wait times vary).

US local numbers bought **before** A2P registration have **SMS disabled** until A2P is approved. After A2P is active, new US/Canada numbers you buy are linked to that registration automatically. CloudTalk: [How to add a new number](https://help.cloudtalk.io/en/articles/5465685-how-to-add-a-new-number-in-cloudtalk).

### 4. Register for US SMS (A2P 10DLC form)

If you send SMS to **US mobile numbers**, US carriers block the traffic until you complete **A2P 10DLC** (Application-to-Person, 10-digit long code). This is a carrier/TCR requirement, not a Granite setting. Conversational texts to existing customers still count as A2P when they go out through CloudTalk.

**Without this registration, outbound SMS from a US (+1) CloudTalk number to the USA is blocked.**

1. Read CloudTalk’s guide: [Registering Standard USA Numbers for Messaging (A2P 10DLC)](https://help.cloudtalk.io/en/articles/7222203-registering-standard-usa-numbers-for-messaging-a2p-10dlc).
2. Open their [A2P 10DLC registration form](https://docs.google.com/forms/d/e/1FAIpQLSdQlva683-BNNqhRuVk4ZvmPvGxbFHS9fpYkTLYhIXk5-OvRw/viewform) and fill it out. Use their [General Guidelines (A2P 10DLC Registration)](https://drive.google.com/file/d/1yloLNRg3CUDAdODyBzwLlDKO_3GG0AfU/view?usp=sharing) while you complete the Campaign section.
3. CloudTalk’s Numbers Support team submits **Brand** and **Campaign** to The Campaign Registry (TCR) for you. Registration with a previous carrier **does not transfer** — you must do it again with CloudTalk.
4. Wait **2–4 weeks** for carriers/TCR. You cannot skip this wait.

The form covers three parts:

| Part | What you provide |
| --- | --- |
| **Brand** | Legal business name, physical address, EIN (US) or other registration number, website, industry, authorized representative (name, email, title, phone). |
| **Campaign** | What you text and why (for Granite this is typically customer care / mixed use: appointment follow-up, quotes, survey links — not cold outreach). Include 2–5 **sample messages** with your real business name and **STOP** language. |
| **Opt-in** | Where the customer agrees to receive SMS **before** you text them. |

**Opt-in is required.** If you do not already collect SMS consent, add it before you submit (website contact form, paper form, or IVR). Reviewers reject forced consent (pre-checked boxes, mandatory SMS checkbox, phone required with no optional consent). A compliant web form usually has: optional phone field, unchecked SMS consent checkbox, “message and data rates may apply,” message frequency, HELP/STOP, and a privacy policy that says **mobile numbers are not shared with third parties**.

Most CloudTalk customers use **Low-volume Standard Brand** (under 6,000 US segments/day). TCR charges a one-time brand + campaign fee (CloudTalk quotes about **$19.50** for that path) and about **$1.50/month** for a Low Volume Mixed campaign. Fees are billed on your CloudTalk invoice; CloudTalk does not mark them up.

**Toll-free numbers** use a **different** form, not 10DLC: [toll-free A2P verification](https://help.cloudtalk.io/en/articles/7214064-how-to-verify-usa-and-canada-toll-free-numbers-for-a2p-messaging) and [this verification form](https://docs.google.com/forms/d/e/1FAIpQLSd80BsvvC3Xg5wi3y_72ES0d3eiGts6ckzSLuojgYJnzjS64w/viewform). Carrier review is typically **1–3 weeks**.

Some industries are banned on US/Canada SMS (for example CBD, vape, certain lending). See CloudTalk’s [unsupported use cases](https://help.cloudtalk.io/en/articles/8503648-usa-a2p-sms-faqs).

FAQs: [USA A2P SMS FAQs](https://help.cloudtalk.io/en/articles/8503648-usa-a2p-sms-faqs).

### 5. Add CloudTalk users and assign numbers

Create each person under **Users**, give them a seat, and set **Assigned numbers** / **Default outbound call number**. They must accept the invitation email and set a password so they can sign in to CloudTalk Phone.

### 6. Then connect Granite

Only after the account is active, the plan includes API, you have numbers, and US SMS registration is **approved** (if you text the USA):

- Paste API keys on the company (Super Admin).
- Paste each user’s **Agent ID** and CloudTalk **phone number** in Granite.
- Sign in to CloudTalk Phone from the CRM **Phone** panel and go **Online**.

The rest of this page is those Granite steps.

---

## What Granite uses CloudTalk for

| Feature | Where it shows up in Granite | What you set up |
| --- | --- | --- |
| Company connection | Superuser Dashboard → Companies | CloudTalk API Access Key and Secret |
| In-CRM phone | Sidebar **Phone** (Employee / Admin) | Agent ID + phone number on the CRM user, then sign in to CloudTalk Phone |
| Click-to-call | Phone icon on a customer or deal | Same as in-CRM phone |
| SMS | Sidebar **SMS** (`/employee/cloudtalk`) | Agent ID (required to send). Admins can view threads without sending |
| SMS templates and automated SMS flows | SMS page and deal SMS | Agent ID + phone number on the user who sends |
| Call history | Customer / deal activity; **Admin → Users Activity** | Agent ID on each rep |
| Recordings and transcribe | Call rows on customer / deal pages | Call recording enabled in CloudTalk |
| Call coaching | Employee dashboard | Agent ID + phone number, plus recorded calls |
| Screen pop | Opens the customer record when a call is answered | Automatic once contacts are synced |
| Post-install survey SMS | Sent after a checklist is submitted | **Office Manager** user with a CloudTalk phone number |
| Desktop / Telegram SMS alerts | Dashboard unread SMS; Telegram if connected | Agent ID so inbound SMS can be matched to the CRM user |

If the company also has RingCentral connected, Granite prefers RingCentral for SMS. Use this guide only when the company uses CloudTalk.

---

## 1. Connect the company (API keys)

A **CloudTalk Admin** creates the keys. A Granite **Super Admin** pastes them onto the company. Ordinary company admins cannot enter these keys in Granite company settings.

API Keys are available on CloudTalk **Essential** and above. If you do not see the API Keys tab, confirm the plan and that you are logged in as Admin. CloudTalk’s article: [How to access and generate your CloudTalk API keys](https://help.cloudtalk.io/en/articles/15272380-how-to-access-and-generate-your-cloudtalk-api-keys).

### In CloudTalk

1. Log in to the [CloudTalk Dashboard](https://dashboard.cloudtalk.io).
2. In the left navigation, go to **Account → Settings**.
3. Open the **API Keys** tab. Direct link: [dashboard.cloudtalk.io/menu/account/settings/API-keys](https://dashboard.cloudtalk.io/menu/account/settings/API-keys).
4. Click **+ Add API Key**.
5. Copy the **Access Key ID** and **Access Key Secret**. Treat the secret like a password.

### In Granite

1. Sign in as Super Admin.
2. Open **Superuser Dashboard → Companies**.
3. **Create Company** or **Edit** the company.
4. Paste into **CloudTalk Access Key** and **CloudTalk Access Secret**.
5. Save.

After this, Granite treats the company as CloudTalk-enabled (SMS, phone dock, call history). Each person still needs their own Agent ID and phone number (next sections).

---

## 2. Create people in CloudTalk

Each Granite user who will call or text needs a matching CloudTalk user (agent). CloudTalk’s article: [How to add new users](https://help.cloudtalk.io/en/articles/2144066-how-to-add-new-users).

1. In the CloudTalk Dashboard, open **Users**.
2. Click **+ Add User**.
3. Enter first name, last name, and email. The email is the CloudTalk login.
4. Assign a role (**Agent** is typical for sales reps).
5. Under **Advanced Settings**:
   - **Default outbound call number** — the public number customers see on outbound calls.
   - **Assigned numbers** — which CloudTalk numbers this person may use for outbound calls and SMS. If this is empty, they can use every number on the account.
6. Click **Save User**. The user gets an invitation email to set a password.

Do not use **VoiceAgents** for this. VoiceAgents are CloudTalk’s AI agents. Granite needs the numeric ID of a **human user** under **Users**.

---

## 3. Where to get the Agent ID

The Agent ID is a number CloudTalk assigns to the user. Granite stores it as **CloudTalk agent ID** (digits only).

Only a **CloudTalk Admin** can open user edit pages. If you are not a CloudTalk Admin, ask them to look this up.

1. Go to [dashboard.cloudtalk.io](https://dashboard.cloudtalk.io) and log in as CloudTalk Admin.
2. Open **Users**. (Older CloudTalk accounts may label this **Agents**.)
3. Search by name or email.
4. Click the user (or the edit icon) to open their profile.
5. Look at the browser address bar. The **Agent ID** is the number at the **end of the URL**.

Example: if the URL ends with `/123456`, the Agent ID is `123456`.

Paste that number into Granite (section 5). Do not invent it and do not use a VoiceAgent ID from **VoiceAgents → Agents**.

---

## 4. Where to get the phone number

The CloudTalk phone number is the **SMS sender line** for that Granite user. Granite stores digits only (at least 10). Include the country code when you copy it (for example `+1 317 676 7938` becomes `13176767938` in Granite).

### From Numbers

1. In the CloudTalk Dashboard, open **Numbers**.
2. Find the line this person should send SMS from (search by number or internal name).
3. Copy the full number, including country code.

CloudTalk Admins manage numbers here (request, port, edit). Agents do not have access to **Numbers**. CloudTalk’s numbers overview is in the [Users](https://help.cloudtalk.io/en/articles/9241618-users) help article under **Numbers Tab**.

### From the user’s assigned numbers

1. **Users** → open the user.
2. Open **Advanced Settings**.
3. Check **Assigned numbers** and **Default outbound call number**.
4. Use the SMS-capable number you want Granite to send from.

The number must be a CloudTalk number on your account and **SMS-capable**. Not every CloudTalk number can send SMS. For US outbound SMS, A2P 10DLC (or toll-free verification) must already be **approved** — see [Before you can use CloudTalk](#before-you-can-use-cloudtalk).

---

## 5. Enter Agent ID and phone in Granite

You need both fields for the in-CRM phone. Agent ID alone is enough to load that user’s CloudTalk calls and (for employees) to send SMS after the company is connected.

### The user enters it (My Account)

1. Employee sidebar → **My Account** (`/employee/user`), or Shop → **My Account**.
2. Under Personal Information, set **CloudTalk agent ID** and **CloudTalk phone number**.
3. Click **Save**.

These fields appear only after the company has CloudTalk API keys.

### A manager enters it for someone else

1. Sign in as Admin.
2. **Company settings → Users**.
3. Row **Actions → Edit**.
4. Set **CloudTalk agent ID** and **CloudTalk phone number**.
5. Click **Save**.

| Field | Why Granite needs it |
| --- | --- |
| **CloudTalk agent ID** | Matches calls and inbound SMS to the CRM user. Required to send SMS from `/employee/cloudtalk`. Required for **Made a call** / received / missed rows in **Admin → Users Activity**. |
| **CloudTalk phone number** | Outbound SMS line for that user (manual SMS, SMS flows, and Office Manager survey texts). Required (together with Agent ID) to show the sidebar **Phone** button. |

---

## 6. In-CRM phone (CloudTalk Phone)

Granite embeds [CloudTalk Phone](https://phone.cloudtalk.io) in a floating panel (`partner=granite-crm`). CloudTalk’s own guide: [Using CloudTalk Phone](https://help.cloudtalk.io/en/articles/2144759-using-cloudtalk-phone).

### Turn it on

1. Complete sections 1–5 (company keys, Agent ID, and phone number).
2. Stay on an **Employee** or **Admin** page.
3. In the sidebar, click **Phone**. The panel opens in the CRM tab.
4. Sign in with the same CloudTalk email and password used for that agent (or SSO if your CloudTalk Admin enabled it).
5. Allow microphone access in the browser.
6. Set status to **Online**. If the agent is offline, inbound calls and CloudTalk “create call” ringing will not reach this browser.

You can also use CloudTalk’s desktop or mobile app instead of (or in addition to) the CRM panel. If this computer should **not** ring, click the power icon next to **Phone** (**Turn off on this computer**). That disconnects the browser phone so mobile or desktop can ring.

The panel opens on its own when a call is ringing or you are dialing.

### Click-to-call

On a customer or deal, the phone icon copies the number and opens the CloudTalk panel. Paste into the CloudTalk dialer (`Ctrl`/`Cmd`+`V`), then call. Granite does not auto-dial the number into CloudTalk.

---

## 7. SMS in Granite

**Employee:** sidebar **SMS** → `/employee/cloudtalk`. You need a CloudTalk Agent ID to open this page and send. Without it, employees are redirected away from SMS.

**Admin:** **SMS** → `/admin/cloudtalk` is a company-wide, read-only inbox (filter by sales rep). Admins do not send from this page.

On a thread you can send text and images, use templates, and start automated SMS flows. The sender number is the **CloudTalk phone number** on the CRM user.

Granite can queue a send only if CloudTalk accepts it. For the USA that means the A2P 10DLC (or toll-free) registration is approved, the number is SMS-capable, and the CloudTalk account has **credit**. If A2P is still pending, CloudTalk blocks outbound SMS even though the CRM SMS page is open.

If the Agent ID is missing, the SMS UI can show: *Your account isn't linked to an SMS line yet — you can read SMS but not send.*

Company SMS templates: an admin adds them (onboarding points to **Deals → SMS Templates**). Reps pick templates when messaging from a deal or the SMS page.

Automated SMS flows need the user’s Agent ID **and** phone number. If they are missing, Granite asks you to add them in **My Account**.

---

## 8. Calls on customers, deals, and Users Activity

Granite loads CloudTalk call history with the user’s **Agent ID** (API: last six months on Users Activity).

On a **customer** or **deal**, activity includes CloudTalk calls. If CloudTalk recorded the call, you can play the recording and use **Transcribe**.

**Admin → Users Activity** does not have a separate Call history button. Open a rep’s activity dialog. Rows are labeled:

- **Made a call** — outbound
- **Received a call** — inbound answered
- **Missed a call** — inbound unanswered (including voicemail)

Reps without an Agent ID still appear; they simply have no CloudTalk call rows. A group inbound call that was never assigned to an agent does not show under a single rep.

**Call coaching** on the Employee dashboard uses recent recorded CloudTalk calls for users who have both Agent ID and phone number.

---

## 9. Customer records in CloudTalk (screen pop)

When a customer is saved in Granite, Granite syncs that contact into CloudTalk (name, phone, and a link back to the CRM customer page).

When you answer a call in the CRM phone panel, Granite tries to open that customer:

1. From the CloudTalk contact’s CRM link, if present.
2. Otherwise by matching the caller’s phone number.

No extra CloudTalk setting is required for this beyond the company API keys.

---

## 10. Numbers and inbound call routing (CloudTalk)

These settings live entirely in CloudTalk. Granite does not replace CloudTalk’s call flows.

**Numbers list:** Dashboard → **Numbers**. Edit a number for internal name, business hours, and **Configure call flow**.

**Call Flow Designer** (CloudTalk Admin): [Call Flow Designer Guide](https://help.cloudtalk.io/en/articles/3669429-call-flow-designer-guide).

Typical pattern for a personal sales line:

1. **Numbers** → the number → **Configure call flow** (or **+ Configure**).
2. Add **Ring to** → target **Agent** → pick that person.
3. Optionally add **Voicemail** on the unanswered branch.
4. Click **Save** in CloudTalk.

For a shared line, **Ring to** a **Group** instead of one agent. Put agents in **Groups** in the CloudTalk Dashboard.

---

## 11. Inbound SMS and calls into Granite (webhooks)

Outbound SMS you send **from Granite** is stored immediately. SMS sent only inside CloudTalk Phone, and inbound SMS/calls, reach Granite through CloudTalk **Workflow Automations** (Account → **Workflow Automations**).

A CloudTalk Admin creates workflows with:

- Trigger **Message → Received** → action **API Request** (inbound SMS into Granite)
- Trigger **Message → Sent** → action **API Request** (SMS sent in CloudTalk Phone)
- Trigger **Call → Ended** → action **API Request** (call events Granite uses for follow-up)

Granite provides the webhook URL for your **company ID** and the authorization header. Ask your Granite contact if these workflows are not already in place.

CloudTalk’s overview: [Configuring Workflow Automations](https://help.cloudtalk.io/en/articles/5450779-configuring-workflow-automations). Triggers include Call, Message, Contact, User, Recording, and Transcription. The action Granite needs is **API Request**, not Slack or CloudTalk’s built-in SMS action.

---

## 12. Office Manager survey texts

After a post-install checklist is submitted, Granite can SMS the survey link from the **Office Manager** user’s **CloudTalk phone number**. Assign **Office Manager** on that user in **Admin → Users** and set their CloudTalk phone number.

---

## Checklist

**On CloudTalk (do these first):**

1. Activate the CloudTalk account (click the email link; send business documents if they ask).
2. Be on **Essential** or higher (API + Workflow Automations). Add a **seat** for each person who will call or text.
3. Buy or port at least one **SMS-capable** number (**Numbers → Get a number**).
4. For SMS to the USA: fill out CloudTalk’s **[A2P 10DLC registration form](https://docs.google.com/forms/d/e/1FAIpQLSdQlva683-BNNqhRuVk4ZvmPvGxbFHS9fpYkTLYhIXk5-OvRw/viewform)** (local 10-digit numbers) or the **[toll-free verification form](https://docs.google.com/forms/d/e/1FAIpQLSd80BsvvC3Xg5wi3y_72ES0d3eiGts6ckzSLuojgYJnzjS64w/viewform)**. Wait until CloudTalk confirms approval (often **2–4 weeks** for 10DLC). Put SMS consent (opt-in) on your website/forms before you submit.
5. Keep **credit** on the CloudTalk account (SMS is billed from credit).
6. **Users → + Add User**, set **Assigned numbers** / **Default outbound call number**. Each user sets a password from the invitation email.

**Then in Granite:**

7. CloudTalk Admin: **Account → Settings → API Keys** → create a key pair.
8. Granite Super Admin: paste keys on the company in **Superuser Dashboard → Companies**.
9. Copy **Agent ID** from the user-edit URL and the SMS-capable number from **Numbers**.
10. Paste both into Granite **My Account** or **Admin → Users → Edit**.
11. Open sidebar **Phone**, sign in to CloudTalk Phone, go **Online**, allow the microphone.
12. Confirm SMS at `/employee/cloudtalk` and a test call.
13. Confirm Granite has CloudTalk workflows for inbound SMS (and sent SMS / calls if those should appear in the CRM).

---

## CloudTalk links

| Task | Where |
| --- | --- |
| Dashboard login | [dashboard.cloudtalk.io](https://dashboard.cloudtalk.io) |
| Account activation / business docs | [Account Activation Requirements](https://help.cloudtalk.io/en/articles/11991629-account-activation-requirements) |
| Plans (Essential+ for API) | [Pricing plans](https://help.cloudtalk.io/en/articles/13130387-understanding-pricing-plans-and-what-they-include) |
| Buy a number | **Numbers → Get a number** — [add a number](https://help.cloudtalk.io/en/articles/5465685-how-to-add-a-new-number-in-cloudtalk) |
| US SMS (A2P 10DLC form) | [Registration guide](https://help.cloudtalk.io/en/articles/7222203-registering-standard-usa-numbers-for-messaging-a2p-10dlc) · [registration form](https://docs.google.com/forms/d/e/1FAIpQLSdQlva683-BNNqhRuVk4ZvmPvGxbFHS9fpYkTLYhIXk5-OvRw/viewform) |
| US/Canada toll-free SMS | [Toll-free verification](https://help.cloudtalk.io/en/articles/7214064-how-to-verify-usa-and-canada-toll-free-numbers-for-a2p-messaging) · [verification form](https://docs.google.com/forms/d/e/1FAIpQLSd80BsvvC3Xg5wi3y_72ES0d3eiGts6ckzSLuojgYJnzjS64w/viewform) |
| API keys | **Account → Settings → API Keys** — [help article](https://help.cloudtalk.io/en/articles/15272380-how-to-access-and-generate-your-cloudtalk-api-keys) |
| Users / Agent ID | **Users** → edit user → ID at the end of the URL — [add users](https://help.cloudtalk.io/en/articles/2144066-how-to-add-new-users) |
| Phone numbers | **Numbers** — [users & numbers access](https://help.cloudtalk.io/en/articles/9241618-users) |
| CloudTalk Phone (web) | [phone.cloudtalk.io](https://phone.cloudtalk.io) — [using CloudTalk Phone](https://help.cloudtalk.io/en/articles/2144759-using-cloudtalk-phone) |
| Inbound routing | **Numbers** → configure call flow — [Call Flow Designer](https://help.cloudtalk.io/en/articles/3669429-call-flow-designer-guide) |
| Webhooks to Granite | **Account → Workflow Automations** — [workflow automations](https://help.cloudtalk.io/en/articles/5450779-configuring-workflow-automations) |
