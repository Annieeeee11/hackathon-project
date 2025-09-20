import { IconDashboard, IconMessageCircle, IconTarget, IconTrophy } from "@tabler/icons-react"
import { Button } from "../ui/button"

const QuickActions = () => {

    return (<div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-3">
            <a href="/chat">
                <Button className="w-full justify-start mb-5" variant="outline">
                    <IconMessageCircle className="w-4 h-4 mr-2" />
                    Chat with AI Professor
                </Button>
            </a>
            <a href="/assessments">
                <Button className="w-full justify-start mb-5" variant="outline">
                    <IconDashboard className="w-4 h-4 mr-2" />
                    Take Assessment
                </Button>
            </a>
            <a >
                <Button className="w-full justify-start mb-5" variant="outline">
                    <IconTarget className="w-4 h-4 mr-2" />
                    Set Learning Goals
                </Button>
            </a>
            <a>
                <Button className="w-full justify-start mb-5" variant="outline">
                    <IconTrophy className="w-4 h-4 mr-2" />
                    View Achievements
                </Button>
            </a>
        </div>
    </div>
    )
}

export default QuickActions;