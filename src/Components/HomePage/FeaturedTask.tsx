"use client";

import React, { useEffect, useState } from "react";
import { type StaticImageData } from "next/image";
import { Star } from "lucide-react";
import Fe1 from "../../../public/assets/fe1.png";
import Fe2 from "../../../public/assets/fe2.png";
import Fe3 from "../../../public/assets/fe3.png";
import Fe4 from "../../../public/assets/fe4.png";
import TaskModal from "../Tasks/TaskModal";
import StartTaskModal from "../Tasks/StartTaskModal";
import ModernSection from "../Shared/ModernSection";
import ModernCard from "../Shared/ModernCard";

// We'll load featured tasks from the backend. Backend supports `type` query.
type BackendTask = {
    _id?: string;
    title?: string;
    description?: string;
    rewardCents?: number;
    reward?: number;
    metadata?: Record<string, unknown>;
};

interface FeaturedTaskDisplay {
    image: string | StaticImageData;
    title: string;
    description: string;
    reward: number;
    raw: BackendTask;
}

const FeaturedTask: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<FeaturedTaskDisplay | null>(null);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [items, setItems] = useState<BackendTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeClaimedTask, setActiveClaimedTask] = useState<BackendTask | null>(null);

    const fetchFeatured = async () => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${api}/api/v1/tasks?type=featured&limit=4`);
            const data = await res.json().catch(() => ({}));
            if (data && Array.isArray(data.tasks)) {
                setItems(data.tasks as BackendTask[]);
            } else {
                setItems([]);
            }
        } catch (err) {
            console.error("Failed to load featured tasks", err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatured();
    }, []);

    const openStartWithClaim = (claimed?: BackendTask) => {
        setIsStartOpen(true);
        setActiveClaimedTask(claimed ?? null);
    };

    const handleSeeMore = () => {
        console.log("See more featured tasks");
    };

    return (
        <ModernSection
            title="Featured Tasks"
            description="Complete featured tasks to earn bigger rewards"
            onSeeMore={handleSeeMore}
            icon={<Star className="text-teal-400" size={20} />}
        >
            {loading && <div className="text-sm text-gray-400">Loading featured tasks...</div>}
            {!loading && items.length === 0 && (
                <div className="text-sm text-gray-400">No featured tasks available</div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {items.map((task, index) => {
                    const img = (task.metadata?.logoUrl || task.metadata?.imageUrl) as string | undefined || [Fe1, Fe2, Fe3, Fe4][index % 4];
                    const title = task.title || "Untitled";
                    const desc = task.description || task.metadata?.shortDescription as string || "";
                    const reward = typeof task.rewardCents === "number" ? task.rewardCents : (task.reward || 0);
                    return (
                        <ModernCard
                            key={task._id || index}
                            image={img}
                            title={title}
                            description={desc}
                            reward={reward}
                            onClick={() => setSelectedTask({ image: img, title, description: desc, reward, raw: task })}
                            variant="featured"
                            showPlatforms={true}
                            platforms={["web", "ios", "android"]}
                        />
                    );
                })}
            </div>

            {/* Modals */}
            <TaskModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onStart={(claimedTask?: BackendTask) => openStartWithClaim(claimedTask)}
                task={selectedTask}
            />

            <StartTaskModal
                isOpen={isStartOpen}
                onClose={() => setIsStartOpen(false)}
                task={activeClaimedTask}
                onComplete={() => {
                    fetchFeatured();
                    setActiveClaimedTask(null);
                }}
            />
        </ModernSection>
    );
};

export default FeaturedTask;