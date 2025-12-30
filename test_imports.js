try {
    const lucide = await import('lucide-react');
    console.log('Lucide keys:', Object.keys(lucide).slice(0, 10));
} catch (e) {
    console.error('Lucide import failed:', e);
}

try {
    const echarts = await import('echarts');
    console.log('Echarts keys:', Object.keys(echarts).slice(0, 10));
} catch (e) {
    console.error('Echarts import failed:', e);
}
