document.addEventListener('DOMContentLoaded', ()=>{
	const btn = document.querySelector('.sidebar-toggle');
	const sidebar = document.querySelector('.sidebar');
	if(!btn || !sidebar) return;
	// Prevent animation on initial load
	sidebar.classList.add('no-anim');


	const queryString = window.location.search;
	const searchParams = new URLSearchParams(queryString);
	const sidebarParam = searchParams.get('sidebar');

	if (sidebarParam === null) {
		// Restore saved state (if any)
		const saved = localStorage.getItem('sidebar-open');
		if (saved !== 'false') {
			sidebar.classList.add('open');
		} else {
			sidebar.classList.remove('open');
		}
	} else if (sidebarParam === 'open') {
		// Force the sidebar to be open
		if (document.documentElement.clientWidth > 800) {
			sidebar.classList.add('open');
		} else {
			sidebar.classList.remove('open');
		}
	} else {
		// Force the sidebar to be closed
		if (document.documentElement.clientWidth > 800) {
			sidebar.classList.remove('open');
		} else {
			sidebar.classList.add('open');
		}
	}

	// Allow animations after initial state is applied
	setTimeout(() => { sidebar.classList.remove('no-anim'); }, 1000);

	btn.addEventListener('click', ()=>{
		const isOpen = sidebar.classList.toggle('open');
		sidebar.classList.remove('no-anim');
		localStorage.setItem('sidebar-open', isOpen ? 'true' : 'false');
	});
});