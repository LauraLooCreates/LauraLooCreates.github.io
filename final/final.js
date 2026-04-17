document.addEventListener('DOMContentLoaded', () => {
	// place any `.dot` elements at the start of the path
	const pathSvg = document.getElementById('path');
	if (pathSvg) {
		const pathEl = pathSvg.querySelector('path');
		const dots = pathSvg.querySelectorAll('.dot');
		if (pathEl && dots.length) {
			// get the first point on the path (start)
			const p = pathEl.getPointAtLength(0);
			dots.forEach((dot) => {
				dot.setAttribute('cx', p.x);
				dot.setAttribute('cy', p.y);
			});
		}
	}

	// existing follow-circle pointer code (if present)
	const svg = document.getElementById('follow-svg');
	const circle = document.getElementById('follow-circle');
	if (!svg || !circle) return;

	const moveHandler = (e) => {
		const pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const loc = pt.matrixTransform(svg.getScreenCTM().inverse());

		circle.setAttribute('cx', loc.x);
		circle.setAttribute('cy', loc.y);
	};

	svg.addEventListener('pointermove', moveHandler);
});