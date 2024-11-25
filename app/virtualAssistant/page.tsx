import MainLayout from '../layouts/MainLayaout';

import AssistantContent from './AssistantContent';

// flow/
// ├── cards/
// │   ├── CustomerService/
// │   │   └── CustomerServiceCard.tsx
// │   └── WhatsApp/
// │       └── LinkWhatsappCard.tsx
// ├── config/
// │   ├── FlowTypes.ts
// │   ├── initialEdges.ts
// │   └── initialNodes.ts
// └── Flow.tsx

export default function VirtualAssistant() {
  return (
    <MainLayout>
      <AssistantContent />
    </MainLayout>
  );
}