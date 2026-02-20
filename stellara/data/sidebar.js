document.addEventListener('DOMContentLoaded', ()=>{
	const btn = document.querySelector('.sidebar-toggle');
	const sidebar = document.querySelector('.sidebar');
	if(!btn || !sidebar) return;
	// Prevent animation on initial load
	sidebar.classList.add('no-anim');

	// Restore saved state (if any)
	const saved = localStorage.getItem('sidebar-open');
	if (!saved) {
		// No saved state, default to open
		sidebar.classList.add('open');
	} else if (saved === 'true') {
		sidebar.classList.add('open');
	}
	console.log(saved);	

	// Allow animations after initial state is applied
	setTimeout(() => { sidebar.classList.remove('no-anim'); }, 300);

	btn.addEventListener('click', ()=>{
		const isOpen = sidebar.classList.toggle('open');
		sidebar.classList.remove('no-anim');
		localStorage.setItem('sidebar-open', isOpen ? 'true' : 'false');
	});
});