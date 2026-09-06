# Ipsylon

A responsive, single-page Croatian website for an accounting office. Built with plain HTML, CSS, and a little JavaScript. No dependencies, build step, external fonts, or analytics. Contact submissions are handled by Formspree after setup; its hosted pages have their own privacy and cookie practices.

## Preview

Open `index.html` in your browser. Alternatively, run this from the `ipsylon` directory:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000. Stop the server with Ctrl+C.

## Make it your own

- **Text and services:** edit `index.html`. All copy is sample copy; confirm services and working arrangements with the owner.
- **Contact information:** replace `info@ipsylon.example` everywhere in `index.html`, including the `mailto:` link. `.example` is a placeholder domain, so the current address cannot receive messages. Replace the phone and street address too. Once a real phone number is available, you can wrap it in a link such as `<a href="tel:+38512345678">+385 1 234 5678</a>`. Configure the contact form separately as described below.
- **Business details:** add the full registered business name and any required business disclosures confirmed by the owner before publishing. The page currently uses only the supplied brand name, Ipsylon.
- **Colors:** edit the variables at the top of `styles.css`.
- **Logo:** the wordmark and simple Y symbol are editable directly in `index.html`; the browser icon is `favicon.svg`.
- **Search preview:** edit the page `<title>` and description in `index.html`.
- **Placeholder notices:** remove the notice under the contact details and the footer's “Ogledna stranica” note once real content is in place.

The illustration is made with CSS and does not depict actual financial results. The footer year updates automatically. Navigation, anchor links, and native expandable FAQ answers remain usable without JavaScript. The contact form requires JavaScript to enable its submit button; visitors can also use the direct email link.

## Contact form (Formspree)

The website is configured to submit to `https://formspree.io/f/xrpgakdr`. The submit button enables automatically when JavaScript loads. Recipient settings are managed in the Formspree dashboard. Actual inbox delivery still needs to be confirmed with a test enquiry.

The steps below explain how to set up or replace the receiving form.

Formspree receives the form, stores submissions in its dashboard, and forwards email notifications to the configured inbox. You do not need your own backend or email server. Its [Free plan](https://help.formspree.io/articles/account-management/account-limits) currently includes 50 submissions per month and 30 days of submission history (checked September 6, 2026). Limits may change.

1. Create a free account at [Formspree](https://formspree.io/register), ideally using an email your friend controls, and verify the email address.
2. In the dashboard, choose **New Form**, name it **Ipsylon kontakt**, and select/verify the email address that should receive enquiries.
3. Open the form's **Integration** section and copy its endpoint. It looks like `https://formspree.io/f/abcdefgh` (this is just an example).
4. In `index.html`, find the `action` on `<form id="contact-form">` (currently `https://formspree.io/f/xrpgakdr`) and replace that address if switching forms. This is the only code setting needed. The submit button enables automatically when a valid-looking endpoint is present; this does not verify that the account is activated. The endpoint is public and is not a secret API key.
5. Keep Formspree's spam protection enabled. The form includes its supported `_gotcha` honeypot. A standard browser POST lets Formspree display any required CAPTCHA and its success or error page; visitors leave the Ipsylon page during submission.
6. Preview via `python3 -m http.server 8000` rather than `file://`, then publish using HTTPS. Submit a test enquiry yourself and confirm it appears both in the Formspree dashboard and the target email inbox (check spam too). Use the browser Back button to return to Ipsylon. Check delivery again from the published domain.

Until the endpoint is configured, the form displays a Croatian preparation notice and cannot send submissions. It never displays a fake success message. Required name, email, and message fields use browser validation; the company name is optional. The submit button prevents repeated clicks and is restored when returning to the page. No private credentials belong in these files.

The short notice below the form explains the use of Formspree. Before going live, have the owner review the site's privacy information for their actual handling of enquiries; the sample notice is not a complete business privacy policy.

If sending fails, Formspree displays the result. Check that the endpoint is correct, the recipient email is verified, the form is active, and the monthly allowance has not been reached. The direct email link remains an alternative. Local browser checks can verify validation and the outgoing POST, but inbox delivery requires the configured account.

Official setup reference: [Building an HTML Form](https://help.formspree.io/articles/building-your-form/building-an-html-form).

## Publish

Upload `index.html`, `styles.css`, `script.js`, and `favicon.svg` together to a static web host or a standard hosting account's public website directory. Keep the files in the same folder. This site does not require Node.js or a server application.

### Automatic Netlify deployments from GitHub

The repository is intended to deploy from its `main` branch. `netlify.toml` copies the four public website files into `dist`, which Netlify publishes. Documentation, editor settings, and Git files are not included in that directory. No dependencies or compilation are required.

To connect an existing Netlify project, open **Project configuration → Build & deploy → Continuous deployment → Repository**, link GitHub, and select `marocula/ipsylon`. Authorize the Netlify GitHub App for this repository if prompted. Choose `main` as the production branch, leave the base directory unset, and use the build command and publish directory from `netlify.toml`. Linking the existing project keeps its current website address.

For a new Netlify project, choose **Add new project → Import an existing project → GitHub**, then select the repository with the same settings. Confirm the deployed site is publicly accessible if your account defaults to private projects.

Once linked, edits become public when committed and pushed to `main`:

```sh
git add index.html styles.css script.js favicon.svg
git commit -m "Update website content"
git push
```

Run these commands from the `ipsylon` directory. Include other changed files explicitly when needed. Saving a file locally does not trigger deployment; pushing the commit does. You can also edit a file on GitHub and commit it to `main`. Netlify displays the deployment status in the project's **Deploys** view.

Setup reference: [Netlify repository linking](https://docs.netlify.com/build/git-workflows/repo-permissions-linking/).
