# Improve Domain Trust

Granite checks the company domain and shows **Inbox trust**: Good, Review, or High Risk. The score is a spam risk estimate from public DNS. **Lower is better.**

| Score | Label |
| --- | --- |
| 0–20 | Good |
| 21–50 | Review |
| 51–100 | High Risk |

A healthy sending domain has working mail (MX), one SPF record, one DMARC record, and DKIM from the mailbox provider. Fix the items Granite lists on the company, in the order below. DNS changes can take up to 72 hours to show up.

If your registrar adds the root domain for you, enter only the host part (`_dmarc`, not `_dmarc.example.com`).

Use the **company domain** for company email. Addresses on Gmail, Yahoo, Outlook.com, or another free provider stay High Risk: those domains are shared, so the company cannot build its own sender reputation there.

This page is about the company domain that sends and receives mail. Amazon SES records used so Granite can receive inbound mail are a separate setup: [Inbound Email Setup](/inbound-email-setup).

## 1. Get off blocklists

If the domain is listed on Spamhaus DBL or a similar list, mailbox providers can reject or spam-folder the mail no matter how correct SPF and DKIM are.

1. Check the listing at [Spamhaus DBL](https://www.spamhaus.org/dbl/).
2. Request removal there, and stop whatever caused the listing (compromised mail, spam from the domain) before you ask again.

## 2. Publish MX records

MX records tell the internet where the company mailbox is. Without them, the domain does not look like a real mail domain.

Add the MX records your provider gives you:

- **Google Workspace:** the Google MX hosts from the Workspace setup page.
- **Microsoft 365:** the `*.mail.protection.outlook.com` host Microsoft shows for the domain.
- **GoDaddy email:** the `secureserver.net` MX hosts from the GoDaddy email setup.

## 3. Publish one SPF record

SPF is one TXT record on the **root** of the domain. It lists who is allowed to send mail for that domain. There must be **one** SPF record. A second TXT that also starts with `v=spf1` makes SPF fail.

Suggested records for the mailbox Granite detects:

- Google Workspace: `v=spf1 include:_spf.google.com -all`
- Microsoft 365: `v=spf1 include:spf.protection.outlook.com -all`
- Amazon SES: `v=spf1 include:amazonses.com -all`
- GoDaddy email: `v=spf1 include:secureserver.net -all`

If the company sends from more than one of these, keep a **single** TXT and combine the includes, still ending in `-all`. Example for Workspace plus SES:

`v=spf1 include:_spf.google.com include:amazonses.com -all`

Then fix these SPF problems if they are present:

- **`+all`** — allows anyone to send as the domain. Replace it with `-all`.
- **`?all`** — does not fail unauthorized senders. Change it to `-all`.
- **`~all` while DMARC is missing or `p=none`** — prefer `-all` until DMARC enforces.
- **`ptr`** — remove it. It is deprecated and slow.
- **Broken `include:`** — each include must be a hostname, for example `include:_spf.google.com`.
- **More than 10 DNS lookups** — receivers treat that as an SPF failure. Remove extra includes or flatten the record. Do not add another SPF TXT to “fix” it.

## 4. Publish one DMARC record

Add one TXT record:

- **Name/Host:** `_dmarc`
- **Value:** `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; fo=1`

Replace `yourdomain.com` with the company domain. The mailbox in `rua` must be able to receive reports.

If two DMARC records exist, delete the weaker one and keep a single record. The stronger policy wins in this order: `reject`, then `quarantine`, then `none`.

`p=none` only monitors. It meets the bare Gmail and Yahoo minimum and does not enforce. After reports look clean, change the same record:

1. `p=quarantine`
2. Then `p=reject`

Do not jump to `p=reject` on the first day if legitimate mail is still sent from a service that is not in SPF or DKIM.

## 5. Turn on DKIM

DKIM signs outgoing mail. Enable it in the mailbox admin, then publish the DNS records that provider shows.

### Google Workspace

1. [Google Admin](https://admin.google.com) → **Apps** → **Google Workspace** → **Gmail** → **Authenticate email**.
2. Generate the key and start authentication.
3. Publish the TXT record at `google._domainkey`.

Granite looks for the `google` selector. Another provider’s DKIM on the same domain does not replace this if the company sends from Workspace.

### Microsoft 365

1. Microsoft 365 Defender (or the Exchange admin center) → DKIM for the domain.
2. Publish the two CNAME records Microsoft gives you: `selector1._domainkey` and `selector2._domainkey`.
3. Enable DKIM signing for that domain.

### Other mailbox providers

Turn on DKIM in that provider and publish the records they give you. Common names include `default`, `k1`, `s1`, and `mail`. If none of the usual selectors exist in DNS, receivers cannot verify the signature.

## What “done” looks like

Inbox trust can reach **Good** when all of these are true:

- MX points at the real mailbox
- One SPF record ends in `-all`, with no `ptr`, no broken includes, and no more than 10 lookups
- One DMARC record uses `p=quarantine` or `p=reject`
- DKIM is published for the mailbox you actually send from (`google` for Workspace, `selector1` or `selector2` for Microsoft 365)
- The domain is not on the checked blocklists

After you save DNS, wait for the registrar to publish the records, then check Inbox trust again.
