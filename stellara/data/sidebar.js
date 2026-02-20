document.addEventListener('DOMContentLoaded', ()=>{
	const btn = document.querySelector('.sidebar-toggle');
	const sidebar = document.querySelector('.sidebar');
	if(!btn || !sidebar) return;
	// Restore saved state (if any)
	const saved = localStorage.getItem('sidebar-open');
	if (saved != '1') {
		sidebar.classList.add('open');
	} else {
		sidebar.classList.remove('open');
	}

	// Allow animations after initial state is applied
	setTimeout(() => { sidebar.classList.remove('no-anim'); }, 300);

	btn.addEventListener('click', ()=>{
		const isOpen = sidebar.classList.toggle('open');
		sidebar.classList.remove('no-anim');
		localStorage.setItem('sidebar-open', isOpen ? '1' : '0');
	});
});