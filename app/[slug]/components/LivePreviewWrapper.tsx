"use client"

import { useState, useEffect } from 'react'
import BeautyTemplate from "../layouts/BeautyTemplate";
import NailsTemplate from "../layouts/NailsTemplate";
import BrowTemplate from "../layouts/BrowTemplate";

export default function LivePreviewWrapper({ initialSections, tenant, services, galleries }: any) {
    const [sections, setSections] = useState(initialSections);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'UPDATE_SECTION') {
                const updatedSection = event.data.section;
                setSections((prev: any[]) => prev.map(s => s.id === updatedSection.id ? updatedSection : s));
            } else if (event.data?.type === 'UPDATE_ALL_SECTIONS') {
                setSections(event.data.sections);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const activeSections = sections.filter((s: any) => s.active);

    const layout = tenant?.layout || "beauty";

    if (layout === "nails") {
        return <NailsTemplate sections={activeSections} tenant={tenant} services={services} galleries={galleries} />
    }

    if (layout === "brow") {
        return <BrowTemplate sections={activeSections} tenant={tenant} services={services} galleries={galleries} />
    }

    // Default
    return <BeautyTemplate sections={activeSections} tenant={tenant} services={services} galleries={galleries} />
}
