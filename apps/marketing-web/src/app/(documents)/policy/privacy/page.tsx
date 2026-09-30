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
				<i>Effective date: 30 September 2026</i>
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

			<H2>3. Accounts</H2>
			<P>
				Users currently cannot register themselves. Accounts are created by us,
				the administrator, at your request. When you ask for an account, you
				provide us with the data needed to create it (see below). You then log
				in through our own identity service (Keycloak), which we operate
				ourselves.
			</P>

			<H2>4. What data we process, why, and on what legal basis</H2>

			<H3>4.1 Account data</H3>
			<UL>
				<li>
					<b>Data:</b> your name, email address, username, password (stored only
					as a salted hash), an internal user identifier, your account roles,
					and the date the account was created and last updated.
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

			<H3>4.2 Your tasks</H3>
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

			<H3>4.3 Push notifications</H3>
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

			<H3>4.4 Technical logs</H3>
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

			<H3>4.5 Feature configuration</H3>
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

			<H2>5. Data stored on your device and cookies</H2>
			<H3>Android app</H3>
			<P>
				The app stores your login tokens in the encrypted secure storage of your
				device and keeps a local cache of your tasks while running. This data is
				removed when you log out or uninstall the app. The app does not contain
				any analytics, advertising or crash reporting SDKs.
			</P>
			<H3>Web application</H3>
			<P>
				The web application uses only <b>strictly necessary cookies</b> required
				to log you in and keep you logged in: an encrypted session cookie (valid
				for up to 30 days), a security (CSRF) cookie and a cookie remembering
				where to return after login. These cookies are necessary to provide the
				Service you requested and therefore do not require your consent (§ 89(3)
				of Czech Act No. 127/2005 Coll., on Electronic Communications).
			</P>
			<H3>Website</H3>
			<P>
				The website <i>planee.martinpetr.dev</i> does not use cookies or
				analytics. Fonts are served from our own server, so your browser does
				not contact third-party font services.
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
					<b>Google (Google Play)</b> – distributes the app and provides in-app
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
				transferred to the USA via Expo and Google. Such transfers are carried
				out on the basis of the European Commission's adequacy decision for the
				EU–US Data Privacy Framework (where the recipient is certified), or the
				Standard Contractual Clauses approved by the European Commission (Art.
				45 and 46(2)(c) GDPR). You may request more information about these
				safeguards at <Mail />.
			</P>

			<H2>8. How long we keep your data</H2>
			<UL>
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
				your account and all associated data – your account data, tasks and push
				tokens. We do not retain any of your data after deletion, unless
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
					consent (e.g. the notification permission), without affecting the
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
				Providing account data is necessary to create an account and use the
				Service; without it we cannot provide the Service to you. Granting the
				notification permission is optional.
			</P>

			<H2>14. Changes to this policy</H2>
			<P>
				We may update this Privacy Policy, for example when we add new features
				such as self-registration. The current version is always available on
				this page with its effective date. We will inform you of significant
				changes in the app or by email.
			</P>
		</article>
	);
}
