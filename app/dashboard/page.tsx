import MainLayout from '../layouts/MainLayaout';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
    return (
        <MainLayout moreClass='p-4'>
            <DashboardContent />
        </MainLayout>
    );
}