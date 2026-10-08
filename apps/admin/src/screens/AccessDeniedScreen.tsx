export async function AccessDeniedScreen() {
	return (
		<div className="flex items-center justify-center w-screen h-screen">
			<h1 className="text-4xl">Access denied</h1>
			<div className="fixed bottom-10 flex flex-col w-full items-center justify-center gap-4">
				<p className="text-muted-foreground">
					Are you supposed to have access? Maybe try another account.
				</p>
			</div>
		</div>
	);
}
