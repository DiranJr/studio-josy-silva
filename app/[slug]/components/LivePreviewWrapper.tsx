"use client"

import { useState, useEffect } from 'react'
import BeautyTemplate from "../layouts/BeautyTemplate";
import NailsTemplate from "../layouts/NailsTemplate";
import BrowTemplate from "../layouts/BrowTemplate";
import ElegantTemplate from "../layouts/ElegantTemplate";
import MinimalTemplate from "../layouts/MinimalTemplate";
import VibrantTemplate from "../layouts/VibrantTemplate";
import BotanicalTemplate from "../layouts/BotanicalTemplate";
import RetroTemplate from "../layouts/RetroTemplate";
import ModernTemplate from "../layouts/ModernTemplate";
import PastelTemplate from "../layouts/PastelTemplate";

const TEMPLATES: Record<string, any> = {
    beauty: BeautyTemplate,
    nails: NailsTemplate,
    brow: BrowTemplate,
    elegant: ElegantTemplate,
    minimal: MinimalTemplate,
    vibrant: VibrantTemplate,
    botanical: BotanicalTemplate,
    retro: RetroTemplate,
    modern: ModernTemplate,
    pastel: PastelTemplate,
};

export default function LivePreviewWrapper({ initialSections, tenant, services, galleries }: any) {
    const [sections, setSections] = useState(initialSections);
    const [layout, setLayout] = useState(tenant?.layout || "beauty");

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'UPDATE_SECTION') {
                const updatedSection = event.data.section;
                setSections((prev: any[]) => prev.map(s => s.id === updatedSection.id ? updatedSection : s));
            } else if (event.data?.type === 'UPDATE_ALL_SECTIONS') {
                setSections(event.data.sections);
            } else if (event.data?.type === 'UPDATE_LAYOUT') {
                setLayout(event.data.layout);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const activeSections = sections.filter((s: any) => s.active);
    const TemplateComponent = TEMPLATES[layout] || BeautyTemplate;

    return (
        <TemplateComponent
            sections={activeSections}
            tenant={{ ...tenant, layout }}
            services={services}
            galleries={galleries}
        />
    );
}
