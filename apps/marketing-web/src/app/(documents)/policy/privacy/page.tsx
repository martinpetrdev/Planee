import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy – Planee",
	description: "How Planee processes your personal data.",
};

const CONTACT_EMAIL = "me@martinpetr.dev";

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
	return (
		<h2 id={id} className="text-2xl font-bold mt-10 mb-3 scroll-mt-24">
			{children}
		</h2>
	);
}

function H3({ children }: { children: React.ReactNode }) {
	return <h3 className="text-lg font-bold mt-6 mb-2">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
	return <p className="mb-3 leading-relaxed">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
	return <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>;
}

function Cookies({ rows }: { rows: [string, string, string][] }) {
	return (
		<div className="overflow-x-auto mb-3">
			<table className="w-full text-sm text-left border-collapse">
				<thead>
					<tr className="border-b">
						<th className="py-2 pr-4">Cookie</th>
						<th className="py-2 pr-4">Purpose</th>
						<th className="py-2">Duration</th>
					</tr>
				</thead>
				<tbody>
					{rows.map(([name, purpose, duration]) => (
						<tr key={name} className="border-b align-top">
							<td className="py-2 pr-4 font-mono break-all">{name}</td>
							<td className="py-2 pr-4">{purpose}</td>
							<td className="py-2">{duration}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

const Mail = () => (
	<a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
		{CONTACT_EMAIL}
	</a>
);

export default function Page() {
	return (
		<article className="max-w-3xl mx-auto mt-20 px-4 pb-16">
			<h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
			<P>
				<i>Effective date: 9 October 2026</i>
			</P>
			<P>
				This Privacy Policy explains how personal data is processed when you use
				Planee, the Android application <i>dev.martinpetr.planee</i>, the web
				application at <i>app.planee.martinpetr.dev</i> and the website{" "}
				<i>planee.martinpetr.dev</i> (together the <b>"Service"</b>). It is
				provided in accordance with Regulation (EU) 2016/679 (General Data
				Protection Regulation, <b>"GDPR"</b>) and Czech Act No. 110/2019 Coll.,
				on the Processing of Personal Data.
			</P>

			<H2>1. Controller</H2>
			<P>
				The controller of your personal data is <b>Martin Petr</b>, a private
				individual residing in the Czech Republic (<b>"we"</b>, <b>"us"</b>).
				The Service is provided free of charge and on a non-commercial basis.
			</P>
			<P>
				For any questions or requests regarding your personal data, contact us
				at <Mail />. No data protection officer has been appointed, as we are
				not required to appoint one.
			</P>

			<H2>2. Summary</H2>
			<UL>
				<li>
					We process only the data needed to run your account and your task
					list.
				</li>
				<li>
					We do <b>not</b> sell your data, do <b>not</b> show ads, and do{" "}
					<b>not</b> use analytics, tracking or advertising SDKs.
				</li>
				<li>
					We do not access your location, contacts, camera, microphone, photos
					or files.
				</li>
				<li>All data is transmitted encrypted (HTTPS/TLS).</li>
				<li>
					You can request deletion of your account and all associated data at
					any time (see{" "}
					<a className="underline" href="#delete-account">
						Section 9
					</a>
					).
				</li>
			</UL>

			<H2>3. Accounts and the Early Access Program</H2>
			<P>
				The Service is currently available only through an invite-based{" "}
				<b>Early Access Program</b>. Public self-registration is not open. The
				process works as follows:
			</P>
			<UL>
				<li>
					You may sign up for the program through our Google Form, where you
					give us your email addresses (see{" "}
					<a className="underline" href="#early-access">
						Section 4.1
					</a>
					).
				</li>
				<li>
					We send you a personal, single-use invite link. When you open it and
					enter your email address, our identity service (Keycloak), which we
					operate ourselves, sends you an invitation email.
				</li>
				<li>
					Using the invitation, you register in Keycloak. As part of
					registration you are asked to confirm that you have read and agree to
					this Privacy Policy; an account cannot be created without this
					confirmation.
				</li>
			</UL>
			<P>
				Confirming this policy at registration does not make consent the legal
				basis for processing – the legal bases for each purpose are listed in
				Section 4. You log in to the Service through Keycloak.
			</P>

			<H2>4. What data we process, why, and on what legal basis</H2>

			<H3>
				<span id="early-access" className="scroll-mt-24">
					4.1 Early Access Program sign-up
				</span>
			</H3>
			<UL>
				<li>
					<b>Data:</b> the email address of the Google account you want to use
					for testing the Android app, and the email address to which we should
					send the registration guide and invite link (these may be the same),
					together with any other answers you give in the form.
				</li>
				<li>
					<b>Purpose:</b> adding you to the list of testers of the Android app
					in the Google Play testing program, and sending you the registration
					guide and your invite link.
				</li>
				<li>
					<b>Legal basis:</b> steps taken at your request before providing the
					Service (Art. 6(1)(b) GDPR).
				</li>
			</UL>
			<P>
				The form is provided through Google Forms. The Google account email is
				entered into the tester list in Google Play Console so that Google Play
				lets you install the test version of the app.
			</P>

			<H3>4.2 Invitations</H3>
			<UL>
				<li>
					<b>Data:</b> the email address you enter on the invite page, and the
					invitation record in Keycloak (email address, time it was sent and
					its expiry).
				</li>
				<li>
					<b>Purpose:</b> sending you the invitation email and letting you
					complete registration.
				</li>
				<li>
					<b>Legal basis:</b> steps taken at your request before providing the
					Service (Art. 6(1)(b) GDPR).
				</li>
			</UL>
			<P>
				Invite links are single-use and are deleted once used. They do not
				contain any personal data.
			</P>

			<H3>4.3 Account data</H3>
			<UL>
				<li>
					<b>Data:</b> your name, email address, username, password (stored only
					as a salted hash), an internal user identifier, your account roles,
					membership in the Early Access Program, the time you confirmed this
					Privacy Policy, and the date the account was created and last
					updated.
				</li>
				<li>
					<b>Purpose:</b> creating and managing your account, authenticating
					you, and linking your tasks to you.
				</li>
				<li>
					<b>Legal basis:</b> performance of a contract – providing the Service
					you asked for (Art. 6(1)(b) GDPR).
				</li>
			</UL>

			<H3>4.4 Your tasks</H3>
			<UL>
				<li>
					<b>Data:</b> content you enter into the app – task name, expected
					duration, due date, priority, completion status, and the times the
					task was created and changed.
				</li>
				<li>
					<b>Purpose:</b> storing your tasks and synchronising them between your
					devices.
				</li>
				<li>
					<b>Legal basis:</b> performance of a contract (Art. 6(1)(b) GDPR).
				</li>
			</UL>
			<P>
				Your tasks are private: they are visible only to you and are not shared
				with other users. Please do not enter sensitive information (e.g. about
				health) into task names – the Service is not designed for it.
			</P>

			<H3>4.5 Push notifications</H3>
			<UL>
				<li>
					<b>Data:</b> a push token identifying the app installation on your
					device, linked to your account, and the content of the notification
					(which may include information about your tasks).
				</li>
				<li>
					<b>Purpose:</b> delivering notifications to your device (e.g.
					reminders and updates about your tasks).
				</li>
				<li>
					<b>Legal basis:</b> performance of a contract (Art. 6(1)(b) GDPR).
					Notifications are shown only if you grant the notification permission
					in Android; you can revoke it at any time in your device settings.
				</li>
			</UL>

			<H3>4.6 Technical logs</H3>
			<UL>
				<li>
					<b>Data:</b> technical server logs (IP address, time and type of
					request, error messages). We do not keep a history of your logins.
				</li>
				<li>
					<b>Purpose:</b> keeping the Service and your account secure, detecting
					abuse and unauthorised access, and troubleshooting errors.
				</li>
				<li>
					<b>Legal basis:</b> our legitimate interest in the security and proper
					operation of the Service (Art. 6(1)(f) GDPR).
				</li>
			</UL>

			<H3>4.7 Feature configuration</H3>
			<P>
				To decide which features of the Service are enabled for you, your user
				identifier, email address and account roles are evaluated by a feature
				management tool (Flipt) that we host ourselves. The legal basis is our
				legitimate interest in gradually rolling out and testing features (Art.
				6(1)(f) GDPR). No data is passed to any third party for this purpose.
			</P>

			<P>
				We do not use your data for automated decision-making or profiling that
				produces legal or similarly significant effects on you (Art. 22 GDPR).
			</P>

			<H2 id="cookies">5. Cookie policy and data stored on your device</H2>
			<P>
				We use only <b>strictly necessary cookies</b> – cookies without which
				you could not log in and use the Service. They are not used for
				analytics, advertising or tracking, and are not shared with third
				parties. Under § 89(3) of Czech Act No. 127/2005 Coll., on Electronic
				Communications, such cookies do not require your consent, which is why
				we do not show a cookie banner. You can delete or block cookies in your
				browser settings at any time, but you will then not be able to log in.
			</P>

			<H3>Website (planee.martinpetr.dev)</H3>
			<P>
				The website does not use any cookies, analytics or third-party scripts.
				Fonts are served from our own server, so your browser does not contact
				third-party font services.
			</P>

			<H3>Login – identity service (kc.cloud.martinpetr.dev)</H3>
			<P>
				Our Keycloak identity service sets the following cookies when you
				register or log in:
			</P>
			<Cookies
				rows={[
					[
						"AUTH_SESSION_ID, KC_AUTH_SESSION_HASH",
						"Link the steps of a login or registration together.",
						"Browser session",
					],
					[
						"KC_RESTART",
						"Allows a login to be restarted if it times out.",
						"Browser session",
					],
					[
						"KEYCLOAK_IDENTITY, KEYCLOAK_SESSION",
						"Keep you logged in to the identity service (single sign-on) and allow logout.",
						"Browser session, or until the login session expires",
					],
					[
						"KEYCLOAK_REMEMBER_ME",
						"Remembers your username, only if you tick “Remember me”.",
						"Up to 1 year",
					],
					[
						"KEYCLOAK_LOCALE",
						"Remembers the language you selected on the login page.",
						"Browser session",
					],
				]}
			/>

			<H3>Web application (app.planee.martinpetr.dev)</H3>
			<Cookies
				rows={[
					[
						"oidc.web_session",
						"Encrypted login session (access and refresh tokens) keeping you logged in.",
						"Up to 30 days",
					],
					[
						"oidc.web_profile",
						"Encrypted basic profile (name, email) shown in the app.",
						"Up to 30 days",
					],
					[
						"oidc.web_idtoken",
						"Encrypted identity token used to log you out.",
						"Up to 30 days",
					],
					[
						"codeVerifier",
						"One-time security value protecting the login (PKCE).",
						"Browser session",
					],
				]}
			/>
			<P>
				The web application does not use local storage for tracking and does
				not load any analytics or advertising scripts.
			</P>

			<H3>Android app</H3>
			<P>
				The app does not use cookies. It stores your login tokens in the
				encrypted secure storage of your device and keeps a local cache of your
				tasks while running. This data is removed when you log out or uninstall
				the app. The app does not contain any analytics, advertising or crash
				reporting SDKs.
			</P>

			<H3>Google Form</H3>
			<P>
				When you fill in the Early Access Program sign-up form, Google may set
				its own cookies under its own cookie policy (
				<a className="underline" href="https://policies.google.com/technologies/cookies">
					policies.google.com/technologies/cookies
				</a>
				). We have no control over these cookies.
			</P>

			<H2>6. Recipients and processors</H2>
			<P>
				We do not sell or rent your personal data and do not share it for
				advertising purposes. We use the following providers, only to the extent
				necessary to operate the Service:
			</P>
			<UL>
				<li>
					<b>Contabo GmbH</b>, Germany – server hosting. All our servers,
					including the database, identity service, email service and feature
					management tool, run in Contabo data centres in Germany. Contabo acts
					as our processor.
				</li>
				<li>
					<b>650 Industries, Inc. (Expo)</b>, USA – push notification delivery
					service. Receives the push token and notification content. Acts as our
					processor.
				</li>
				<li>
					<b>Google (Firebase Cloud Messaging)</b> – delivers push notifications
					to Android devices on behalf of Expo. Receives the push token and
					notification content.
				</li>
				<li>
					<b>Google Ireland Limited (Google Forms)</b> – hosts the Early Access
					Program sign-up form and stores its responses. Acts as our processor.
				</li>
				<li>
					<b>Google (Google Play)</b> – runs the testing program; the Google
					account email of testers is added to the tester list in Google Play
					Console. Google also distributes the app and provides in-app
					update checks. Google processes data related to app downloads and
					updates as an independent controller under its own privacy policy (
					<a className="underline" href="https://policies.google.com/privacy">
						policies.google.com/privacy
					</a>
					).
				</li>
			</UL>
			<P>
				We may also disclose personal data to public authorities where we are
				legally obliged to do so.
			</P>

			<H2>7. Transfers outside the EU/EEA</H2>
			<P>
				Your account data and tasks are stored in the European Union (Germany).
				Push notification data (push token and notification content) may be
				transferred to the USA via Expo and Google, and Early Access Program
				form responses and the Google Play tester list may be processed by
				Google outside the EU. Such transfers are carried
				out on the basis of the European Commission's adequacy decision for the
				EU–US Data Privacy Framework (where the recipient is certified), or the
				Standard Contractual Clauses approved by the European Commission (Art.
				45 and 46(2)(c) GDPR). You may request more information about these
				safeguards at <Mail />.
			</P>

			<H2>8. How long we keep your data</H2>
			<UL>
				<li>
					<b>Early Access Program form responses</b> – until we have sent you
					the registration guide and added you to the tester list, and at the
					latest until the end of the Early Access Program. Your email stays on
					the Google Play tester list while you take part in testing.
				</li>
				<li>
					<b>Invitations</b> – invite links are deleted once used; Keycloak
					invitation records are deleted once you register or the invitation
					expires.
				</li>
				<li>
					<b>Account data</b> – for as long as your account exists. Deleted
					within 30 days of your deletion request.
				</li>
				<li>
					<b>Tasks</b> – until you delete them in the app, or until your account
					is deleted.
				</li>
				<li>
					<b>Push tokens</b> – until the token becomes invalid (e.g. when you
					uninstall the app) or until your account is deleted.
				</li>
				<li>
					<b>Technical server logs</b> – short-term only, at most 30 days.
				</li>
			</UL>
			<P>
				We currently do not create separate backups; once deleted, data cannot
				be restored.
			</P>

			<H2 id="delete-account">9. How to delete your account and data</H2>
			<P>
				You can request deletion of your Planee account at any time. Send an
				email to <Mail /> from the email address associated with your account,
				with the subject <b>"Delete my Planee account"</b>. We may ask you to
				confirm the request to verify your identity.
			</P>
			<P>
				Within 30 days of receiving your request, we will permanently delete
				your account and all associated data – your account data, tasks, push
				tokens, Early Access Program form responses and your entry in the
				Google Play tester list. We do not retain any of your data after deletion, unless
				required by law. You can also delete individual tasks directly in the
				app at any time.
			</P>

			<H2>10. Your rights</H2>
			<P>Under the GDPR you have the right to:</P>
			<UL>
				<li>
					<b>access</b> your personal data and receive a copy of it (Art. 15);
				</li>
				<li>
					<b>rectification</b> of inaccurate or incomplete data (Art. 16);
				</li>
				<li>
					<b>erasure</b> of your data (Art. 17) – see Section 9;
				</li>
				<li>
					<b>restriction</b> of processing (Art. 18);
				</li>
				<li>
					<b>data portability</b> – receive your data in a structured,
					machine-readable format (Art. 20);
				</li>
				<li>
					<b>object</b> to processing based on our legitimate interests (Art.
					21);
				</li>
				<li>
					<b>withdraw consent</b> at any time, where processing is based on
					consent (e.g. the notification permission or optional cookies on
					Google's form), without affecting the
					lawfulness of prior processing.
				</li>
			</UL>
			<P>
				To exercise your rights, contact us at <Mail />. We will respond without
				undue delay and at the latest within one month (Art. 12(3) GDPR).
				Exercising your rights is free of charge.
			</P>
			<P>
				You also have the right to lodge a complaint with a supervisory
				authority, in particular in the EU Member State of your residence. In
				the Czech Republic, this is the{" "}
				<b>Office for Personal Data Protection</b> (Úřad pro ochranu osobních
				údajů), Pplk. Sochora 27, 170 00 Praha 7,{" "}
				<a className="underline" href="https://uoou.gov.cz">
					uoou.gov.cz
				</a>
				.
			</P>

			<H2>11. Security</H2>
			<P>
				We protect your data using appropriate technical and organisational
				measures, including encryption of all data in transit (HTTPS/TLS),
				secure authentication (OpenID Connect with PKCE), hashed passwords,
				encrypted storage of login tokens on your device, and access to servers
				restricted to the administrator.
			</P>

			<H2>12. Children</H2>
			<P>
				The Service is not intended for children. You must be at least{" "}
				<b>15 years old</b> to use it. We do not knowingly process personal data
				of children under 15. If you believe we hold such data, contact us and
				we will delete it.
			</P>

			<H2>13. Providing your data</H2>
			<P>
				Providing your email address in the sign-up form and account data at
				registration is necessary to join the Early Access Program and use the
				Service; without it we cannot provide the Service to you. Granting the
				notification permission is optional.
			</P>

			<H2>14. Changes to this policy</H2>
			<P>
				We may update this Privacy Policy, for example when the Early Access
				Program ends and public registration opens. The current version is always available on
				this page with its effective date. We will inform you of significant
				changes in the app or by email.
			</P>
		</article>
	);
}
